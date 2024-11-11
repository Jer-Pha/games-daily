from decouple import config
from json import loads
from math import ceil
from re import sub
from time import sleep

import google.generativeai as gemini
from google.api_core.exceptions import ResourceExhausted

API_KEY = config("API_KEY")
gemini.configure(api_key=API_KEY)
# MODEL_NAME, REQUEST_DELAY = "gemini-1.5-pro", 30
MODEL_NAME, REQUEST_DELAY = "gemini-1.5-flash", 4

if not API_KEY:
    raise ValueError("Environment variable 'API_KEY' not found.")


def clean_article_data(data):
    """This function cleans Gemini's JSON response data"""
    # Strip everything before the first `[` and last `]`
    data = sub(r"^[\s\S]*?(\[[\s\S]*\])[\s\S]*?$", r"\1", data)

    # Replace backticks if they were used in the JSON
    if "`" in data:
        data = sub(r"`", r'"', data)

    # Temporarily swap out correct double quotes to look for unescaped
    # double quotes
    x = "@#@"
    data = data.replace('"headline": "', f"{x}headline{x}: {x}")
    data = data.replace('"url": "', f"{x}url{x}: {x}")
    data = data.replace('"summary": "', f"{x}summary{x}: {x}")
    data = data.replace('"topic": "', f"{x}topic{x}: {x}")
    data = data.replace('"image": "', f"{x}image{x}: {x}")
    data = data.replace('"id": "', f"{x}id{x}: {x}")
    data = sub(
        r'"( *\t*)(,? *\t*\n)',
        lambda m: x + m.group(2).rstrip() + "\n",
        data,
    )

    # Escape any double quotes that were not escaped
    data = sub(r'(?<!\\)"', r'\\"', data)

    # Replace placeholder
    data = sub(x, '"', data)

    # Add missing commas between articles
    data = sub(r"}\s*{", r"},", data)

    # Add missing commas between values
    data = sub(r'(?<!\\)"\s*(?<!\\)"', r'",', data)

    # Remove trailing commas
    data = sub(r",(?=\s*(}|]))", "", data)

    return data


def build_gemini_prompt(articles):
    """Builds the prompt for Gemini based on the dict of articles."""
    urls = " , ".join([article["url"] for article in articles])

    # Construct the prompt for Gemini
    prompt = f"""
    Please carefully analyze the following articles and provide the requested information:

    Comma-separated article URLs: {urls}

    Tasks:
    1. For each article, please summarize the article in 50-100 words, focusing on the main points and key takeaways. Use engaging language to entice readers to click and learn more. Maintain a neutral, third-person perspective, avoiding first-person pronouns. Summarize the article's main points and key findings factually, avoiding personal opinions or beliefs. Do not use line breaks or bullet points in the summary.
    2. For each article, identify the most prominent proper noun that represents the central theme or focus of the article, also known as the topic. For example, it may be about a specific video game title, or a video game developer, or a video game publisher, or a movie, or an actor, etc. Choose one proper noun that the article is about.
    3. For each article, take a moment to review the information you provided for tasks 1 and 2. If you believe they are accurate, move on to the next article's URL. If you believe they need work, please repeat all tasks for the current article.
    4. Take a breath, don't rush. Accuracy to the prompt is much more important than speed. When you're ready, go ahead and start the next article.

    Response:
    Please return the information in the following structured JSON format, matching your response data with the correct URLs. The only change to the following format that you should make is replacing $YOUR_SUMMARY with your summary and replacing  $YOUR_TOPIC with your topic. The matching URL for each article will be directly after the topic in the JSON array. Please note: all four values are strings, including `id`. I have included an example response after the JSON format. Before submitting your response, look over it one last time with fresh eyes and make sure it meets these instructions. You're doing great, thank you!

    JSON Format:
    [
    """

    for article in articles:
        prompt += f"""
            {{
                `summary`: `$YOUR_SUMMARY`,
                `topic`: `$YOUR_TOPIC,
                `url`: `{article['url']}`,
                `id`: `{article['id']}`
            }}
        """

    prompt += """]

    Example Response:
    [
        {{
            `summary`: `This article discusses the latest advancements in artificial intelligence, highlighting the potential benefits and challenges. The author discusses several steps being taken by leading companies.`,
            `topic`: `Artificial Intelligence`,
            `url`: `https://www.example.com/ai-breakthroughs-and-what-they-mean`,
            `id`: `317`
        }}
    ]"""

    return prompt


def add_data_to_gemini_response(data, articles):
    """Adds additional info to response data by matching URL."""
    # Create a dictionary mapping URLs to headlines
    article_dict = {
        article["id"]: {
            "headline": article["headline"],
            "image": article["image"],
            "site": article["site"],
            "url": article["url"],
            "weight": article["weight"],
        }
        for article in articles
    }

    # Update response data with headline and weight
    for item in data:
        id = int(item["id"])  # Change back to integer
        if id in article_dict:
            try:
                item["id"] = id
                item["url"] = article_dict[id]["url"]
                item["headline"] = article_dict[id]["headline"]
                item["image"] = article_dict[id]["image"]
                item["site"] = article_dict[id]["site"]
                item["weight"] = article_dict[id]["weight"]
            except KeyError as e:
                print(e)
            except Exception as e:
                print(e)

    return data


def get_gemini_response(articles):
    """Sends a list of article URLs to the Gemini API and processes the response."""
    # Build the prompt then send it to the Gemini API
    model = gemini.GenerativeModel(MODEL_NAME)
    prompt = build_gemini_prompt(articles)
    response = model.generate_content(prompt)

    # Combine text from all parts (should only be one, this is a failsafe)
    data = "".join(
        [part.text for part in response.candidates[0].content.parts]
    )
    data = clean_article_data(data)

    try:
        data = loads(data)  # JSON string to list of dicts
        data = add_data_to_gemini_response(data, articles)
    except Exception as e:
        print()
        print(e, end="\n\n")
        print(data, end="\n\n")
        return "error"

    return data


def build_article_data(articles, limit):
    """This function passes all articles to Gemini and builds a dictionary"""
    data = []

    # Send URLs to Gemini
    for i in range(ceil(len(articles) / limit)):
        _articles = articles[i * limit : (i + 1) * limit]

        response = None
        attempts = 0
        while not response:
            try:
                response = get_gemini_response(_articles)
            except ResourceExhausted as e:
                attempts += 1
                if attempts >= 10:
                    print(f"---- Quota hit ----")
                    break
                sleep(REQUEST_DELAY)
            except Exception as e:
                print(e)
                break

        if response and response != "error":
            data += response

        sleep(REQUEST_DELAY)
    return data
