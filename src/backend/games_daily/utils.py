from collections import defaultdict
from io import BytesIO
from json import dumps
from numpy import array
from PIL import Image
from requests import get
from scipy.cluster.vq import kmeans, vq

from .ai import get_canonical_topics
from .settings import SITES


def format_duration(seconds):
    """Formats a duration in seconds into hours, minutes, and seconds."""
    hours = int(seconds // 3600)  # Integer division for hours
    minutes = int((seconds % 3600)) // 60  # Remaining seconds for minutes
    seconds = int(seconds % 60)  # Remaining seconds

    # Build the formatted string
    duration_str = "Execution time: "
    if hours:
        duration_str += f"{hours} hour{'s' if hours > 1 else ''}, "
    if minutes:
        duration_str += f"{minutes} minute{'s' if minutes > 1 else ''}, "
    duration_str += f"{seconds} second{'s' if seconds > 1 else ''}"

    return duration_str


def build_topic_data(article_data):
    """Identifies topics with the most total weight, using Gemini to
    create canonical topic mappings.
    """
    topics_data = defaultdict(lambda: {"weight": 0, "count": 0})
    convert_topics = {}
    topics_seen = set()

    # Extract unique topics
    for article in article_data:
        topic = article["topic"]
        # Remove surrounding quotes that Gemini sometimes adds
        if (topic[0] == "'" and topic[-1] == "'") or (
            topic[0] == '"' and topic[-1] == '"'
        ):
            topic = topic[1:-1]
        topics_seen.add(topic)

    # Call Gemini and create conversion dict
    canonical_topics_dict = get_canonical_topics(list(topics_seen))
    canonical_topics_dict = {
        k: v for k, v in canonical_topics_dict.items() if v
    }

    # Create lookup dictionary. This must be created before the loop to ensure
    # that all values are associated with a canonical key.
    for canonical_topic, topics in canonical_topics_dict.items():
        # Convert the topics to the canonical key
        for topic in topics:
            if topic != canonical_topic:  # New
                convert_topics[topic] = canonical_topic

    # Update article topics
    for article in article_data:
        original_topic = article["topic"]  # Get the original
        while article["topic"] in convert_topics:
            article["topic"] = convert_topics[article["topic"]]
        if original_topic != article["topic"]:
            print(f"Changed topic '{original_topic}' to '{article['topic']}'")

    # Aggregate on updated topic
    for article in article_data:
        topic = article["topic"]
        if "weight" not in article:
            print("###########################")
            print(dumps(article, indent=4))
            print("###########################")

        topics_data[topic]["weight"] += article["weight"]
        topics_data[topic]["count"] += 1

    # Sort topics and create list of dictionaries
    sorted_topics = sorted(
        topics_data.items(),
        key=lambda item: (item[1]["count"], item[1]["weight"]),
        reverse=True,
    )

    # Transform into list of dictionaries
    data = [
        {
            "topic": topic,
            "count": details["count"],
            "weight": details["weight"],
        }
        for topic, details in sorted_topics
    ]

    return data


# def build_topic_data(article_data):
#     """Identifies topics with the most total weight, combining
#     substrings and returning a list of dictionaries.
#     """
#     topics_data = defaultdict(lambda: {"weight": 0, "count": 0})
#     convert_topics = {}
#     topics_seen = set()

#     for article in article_data:
#         # Check if the topic has already been converted
#         # Use while loop to check for multiple conversions
#         while article["topic"] in convert_topics:
#             article["topic"] = convert_topics[article["topic"]]

#         topic = article["topic"]

#         # Remove surrounding quotes that Gemini sometimes adds
#         if (topic[0] == "'" and topic[-1] == "'") or (
#             topic[0] == '"' and topic[-1] == '"'
#         ):
#             topic = topic[1:-1]

#         if topic not in topics_seen:
#             # Find potential substring matches
#             for existing_topic in topics_seen:
#                 if topic.startswith(existing_topic):
#                     topic = existing_topic  # Use the shorter string as key
#                     article["topic"] = existing_topic
#                     break
#                 elif existing_topic.startswith(topic):
#                     # Move data to shorter key and remove longer key
#                     topics_data[topic]["weight"] += topics_data[
#                         existing_topic
#                     ]["weight"]
#                     topics_data[topic]["count"] += topics_data[existing_topic][
#                         "count"
#                     ]
#                     del topics_data[existing_topic]
#                     # Remove the longer topic from topics_seen
#                     topics_seen.remove(existing_topic)

#                     # Track conversions
#                     convert_topics[existing_topic] = topic
#                     break

#             topics_seen.add(topic)

#         if "weight" not in article:
#             print("###########################")
#             print(dumps(article, indent=4))
#             print("###########################")

#         # Update topic data
#         topics_data[topic]["weight"] += article["weight"]
#         topics_data[topic]["count"] += 1

#     # Check for converted topics in all articles
#     for article in article_data:
#         # Use while loop to check for multiple conversions
#         while article["topic"] in convert_topics:
#             article["topic"] = convert_topics[article["topic"]]

#     # Sort topics and create list of dictionaries
#     sorted_topics = sorted(
#         topics_data.items(),
#         key=lambda item: (item[1]["count"], item[1]["weight"]),
#         reverse=True,
#     )

#     # Transform into list of dictionaries
#     data = [
#         {
#             "topic": topic,
#             "count": details["count"],
#             "weight": details["weight"],
#         }
#         for topic, details in sorted_topics
#     ]

#     return data


def organize_by_topic(articles, topics, limit):
    """Organizes article and topic data into the desired JSON structure."""
    data = {
        "trending": [],
        "sections": [],
        "remaining": [],
    }
    seen_ids = set()

    # Extract trending articles
    for article in articles:
        if article["weight"] == limit:
            data["trending"].append(article)
            seen_ids.add(article["id"])
    data["trending"].sort(key=lambda x: x["id"])

    # Create sections
    for topic in topics:
        if topic["count"] >= 3:
            topic_articles = []
            for article in articles:
                if article["topic"] == topic["topic"]:
                    topic_articles.append(article)
                    seen_ids.add(article["id"])

            # Sort by article weight
            topic_articles.sort(key=lambda x: x["weight"], reverse=True)
            data["sections"].append(
                {
                    "topic": topic["topic"],
                    "articles": topic_articles,
                }
            )

    # Collect remaining articles
    data["remaining"] = [
        article for article in articles if article["id"] not in seen_ids
    ]

    # Sort remaining articles by topic count and weight
    data["remaining"].sort(
        key=lambda article: (
            next(
                (t["count"] for t in topics if t["topic"] == article["topic"]),
                0,
            ),
            article["weight"],
        ),
        reverse=True,
    )

    return data


def organize_by_site(articles):
    data = defaultdict(list)
    for article in articles:
        data[SITES[article["site"]]].append(article)

    # Sort each site list
    for val in data.values():
        val.sort(key=lambda article: article["weight"], reverse=True)

    # Sort site order
    data = dict(sorted(data.items(), key=lambda item: item[1][0]["id"]))

    return data


def get_previous_scrape():
    """Returns a dictionary of articles from thelast scrape,
    transformed into the desired format."""
    response = get("https://www.kfdb.app/api/news/articles-by-topic").json()

    transformed_data = {
        article["url"]: {
            "summary": article["summary"],
            "topic": article["topic"],
            "image": article["image"],
            "color": article["color"],
        }
        for article in response["trending"]
        + [
            article
            for section in response["sections"]
            for article in section["articles"]
        ]
        + response["remaining"]
    }

    return transformed_data


def convert_image(url):

    response = get(url, stream=True)
    response.raise_for_status()  # Raise an exception for bad responses

    return response.content


def get_image_dominant_color(url):
    """Gets the dominant color from an image URL using k-means clustering."""

    # Wrap in a try/except block to guarantee a default value
    try:
        # Get image and convert it to an in-memory file
        response = get(url, stream=True)
        response.raise_for_status()  # Raise an exception for bad responses
        image = BytesIO(response.content)

        # Open the image using Pillow then resize for efficiency
        image = Image.open(image).resize((150, 150))

        # Convert the image to a NumPy array
        image_array = array(image)

        # Reshape the array to a list of RGB pixels
        pixels = image_array.reshape((-1, 3))

        # Perform k-means clustering with k=1 (for dominant color)
        centroids, _ = kmeans(pixels.astype(float), 1)

        # Get the closest pixel to the centroid (dominant color)
        dominant_color, _ = vq(pixels, centroids)

        # Get the dominant color from an RGB tuple
        r, g, b = centroids[dominant_color[0]].astype(int)
        return f"rgb({r},{g},{b})"
    except:
        return "rgb(122,122,122)"
