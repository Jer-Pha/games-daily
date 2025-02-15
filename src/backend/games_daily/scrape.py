from bs4 import BeautifulSoup
from html import unescape
from json import load
from os import path
from random import randint
from requests import get, head
from time import sleep
from uuid import uuid4

from games_daily.utils import get_image_dominant_color, get_previous_scrape
from games_daily.images import process_image


def check_is_image_url(url):
    """Image URL validation."""
    try:
        lower_url = url.lower()

        # Do not allow .gif images
        if lower_url.endswith(".gif"):
            return False

        response = head(url, allow_redirects=True)
        if "Content-Type" in response.headers and response.headers[
            "Content-Type"
        ].startswith("image/"):
            return True

        # If Content-Type is not image, check to see if the url ends in a
        # common image file extension
        return lower_url.endswith(
            (
                ".jpg",
                ".jpeg",
                ".png",
                ".gif",
                ".bmp",
                ".webp",
            )
        )

    except:
        return False


def build_url(url, domain):
    """Constructs URL based on possible partial URL."""
    if not url.startswith(("http", "//", "/")):
        url = "/" + url

    url = (
        "https://www." + domain + url if not url.startswith("http") else url
    ).split("#")[0]

    return url


def scrape_article_image(selector, domain, response):
    """Get a single image URL from an individual article."""
    soup = BeautifulSoup(response.content, "html.parser")
    images = soup.select(selector)

    # Loop until an image matches the following criteria
    for img in images:
        if img.has_attr("data-src"):  # Fix for Indie Games Plus
            image_url = build_url(img["data-src"].split("?")[0], domain)
        else:
            image_url = build_url(img["src"].split("?")[0], domain)

        # Ensure the image source is the correct file type
        # and Kotaku-specific tracking image catch
        if (
            check_is_image_url(image_url)
            and "scorecardresearch" not in image_url
        ):
            return image_url
    return ""


def get_headline_text(article, selectors):
    """Gets headline for selected article."""
    headline = (
        article.select_one(selectors["headline"])
        if "headline" in selectors
        else article
    )
    headline = (
        headline[selectors["headline_attr"]]
        if "headline_attr" in selectors
        else "".join(
            child.text.strip()
            for child in headline.children
            if child.name is None
        )  # Ensure sibling text is not included
    )

    headline = unescape(headline)  # Decode HTML entities

    return headline


def get_image_url(response, site_data):
    """Gets image URL for selected article."""
    image = ""

    for selector in site_data["article"]["image_selectors"]:
        image = scrape_article_image(
            selector,
            site_data["domain"],
            response,
        )
        if image:
            break

    if not image:
        image = site_data["fallback_image"]

    return image


def get_article_content(response, site_data):
    """Gets author content for selected article."""

    soup = BeautifulSoup(response.content, "html.parser")
    content = soup.select_one(site_data["article"]["content"])

    if content:
        content = content.get_text(separator=" ", strip=True)
    else:
        print("no content")
        content = ""

    return content


def scrape_headlines(limit, site=None):
    """Scrapes headlines and URLs from video game news sites"""
    print("Start scrape...")

    config_file = path.join(
        path.dirname(path.abspath(__file__)),
        "utils/config.json",
    )

    with open(config_file, "r") as f:
        json_data = load(f)

    request_headers = json_data["headers"]

    urls_seen = set()
    existing_articles = []
    new_articles = []
    curr_id = 0
    prev_scrape = get_previous_scrape()

    for site_name, site_data in json_data["sites"].items():
        if site and site_name != site:
            continue

        article_count = 0
        weight = limit

        print(f"...scraping {site_name}...")

        for selectors in site_data["gallery"]["article_selectors"]:
            if article_count >= limit:
                break
            elif article_count:
                # Rate limit for multiple scrapes on the same domain
                sleep(randint(1, 3))
            url = "https://" + site_data["domain"]
            request_headers["Referer"] = url
            url += (
                selectors["subdirectory"]
                if "subdirectory" in selectors
                else ""
            )
            response = get(url, headers=request_headers)
            soup = BeautifulSoup(response.content, "html.parser")
            section = soup.select_one(selectors["section"])

            if section:
                for article in section.select(selectors["article"]):
                    if article_count >= limit:
                        break

                    article_url = (
                        article.select_one(selectors["url"])["href"]
                        if "url" in selectors
                        else article["href"]
                    )

                    if (
                        article_url[:4] == "http"
                        and site_data["domain"]
                        not in article_url.split("?")[0]
                    ):  # Don't use external URLs
                        continue

                    url = build_url(article_url, site_data["domain"])

                    if (
                        "url_filter" not in selectors
                        or selectors["url_filter"] in url
                    ) and url not in urls_seen:
                        article_html = get(url, headers=request_headers)
                        headline = get_headline_text(article, selectors)
                        image = get_image_url(article_html, site_data)
                        filename = uuid4().hex

                        if url in prev_scrape:
                            if image == prev_scrape[url]["image"]:
                                image_color = prev_scrape[url]["color"]
                            else:
                                image_color = get_image_dominant_color(image)

                            existing_articles.append(
                                {
                                    "id": curr_id,
                                    "site": site_name,
                                    "headline": headline,
                                    "url": url,
                                    "image": image,
                                    "image-296": prev_scrape[url].get(
                                        "image-296",
                                        process_image(
                                            image, f"{filename}-296.webp", 296
                                        ),
                                    ),
                                    "image-412": prev_scrape[url].get(
                                        "image-412",
                                        process_image(
                                            image, f"{filename}-412.webp", 412
                                        ),
                                    ),
                                    "color": image_color,
                                    "weight": weight,
                                    "summary": prev_scrape[url]["summary"],
                                    "topic": prev_scrape[url]["topic"],
                                }
                            )
                        else:
                            content = get_article_content(
                                article_html, site_data
                            )
                            if not content:
                                continue

                            image_color = get_image_dominant_color(image)
                            new_articles.append(
                                {
                                    "id": curr_id,
                                    "site": site_name,
                                    "headline": headline,
                                    "content": content,
                                    "url": url,
                                    "image-296": process_image(
                                        image, f"{filename}-296.webp", 296
                                    ),
                                    "image-412": process_image(
                                        image, f"{filename}-412.webp", 412
                                    ),
                                    "color": image_color,
                                    "weight": weight,
                                }
                            )

                        urls_seen.add(url)
                        weight -= 1
                        article_count += 1
                        curr_id += 1

    print("...end scrape", end="\n\n")
    return existing_articles, new_articles
