from decouple import config
from json import loads
from math import ceil
from re import sub
from time import sleep

import google.generativeai as gemini
from google.api_core.exceptions import ResourceExhausted

from .settings import SITES

API_KEY = config("API_KEY")
gemini.configure(api_key=API_KEY)
MODEL_NAME, REQUEST_DELAY = "gemini-2.0-flash-exp", 4

if not API_KEY:
    raise ValueError("Environment variable 'API_KEY' not found.")


def clean_article_data(data):
    """This function cleans Gemini's JSON response data"""
    # Strip everything before the first `[` and last `]`
    data = sub(r"^[\s\S]*?(\[[\s\S]*\])[\s\S]*?$", r"\1", data)

    # Temporarily swap out correct double quotes to look for unescaped
    # double quotes
    x = "@#@"
    data = data.replace('"summary":"', f"{x}summary{x}: {x}")
    data = data.replace('"summary": "', f"{x}summary{x}: {x}")
    data = data.replace('"topic":"', f"{x}topic{x}: {x}")
    data = data.replace('"topic": "', f"{x}topic{x}: {x}")
    data = data.replace('"id":"', f"{x}id{x}: {x}")
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
    article_content = {
        str(article["id"]): article["content"] for article in articles
    }

    # Construct the prompt for Gemini
    prompt = f"""
    Please carefully analyze the following articles and provide the requested information:

    The following dictionary array has the article id as the key and the content of the article as the value:
    {article_content}

    Tasks for each article:
    1. Summarize the article in 80-150 words, focusing on the main points and key takeaways. Use engaging language to entice readers to click and learn more. Maintain a neutral, third-person perspective, avoiding first-person pronouns. Summarize the article's main points and key findings factually, avoiding personal opinions or beliefs. Do not use line breaks or bullet points in the summary.
    2. Identify the most prominent proper noun that represents the central theme or focus of the article, also known as the topic. For example, it may be about a specific video game title, or a video game developer, or a video game publisher, or a movie, or an actor, etc. Choose one proper noun that the article is about.
    3. For each article, take a moment to review the information you provided for tasks 1 and 2. If you believe they are accurate, move on to the next article's text. If you believe they need work, please repeat all tasks for the current article.
    4. Take a breath, don't rush. Accuracy to the prompt is much more important than speed. When you're ready, go ahead and start the next article.

    Response:
    Please return the information in the following structured JSON format. The response should be a list of dictionaries. For each dictionary in the list, there should be three keys: "id", "summary", and "topic". All three values are strings, including "id". The id should match the article's id in the provided dictionary. The summary and topics should be your created summary and topic for each article, matching the id. Before submitting your response, take a break. After the break, review your response data and ensure the format is accurate. Also, make sure that the response's individual dictionaries accurately match the article id, summary, and topic. It is extremely important that the JSON data is properly structured so that it can be converted into a Python dictionary without issue and that the summaries and topics accurately match their provided article id.

    Output format:
    [
        {{
            "id": "article id",
            "summary": "article summary",
            "topic": "article topic",
        }},
        ...
    ]
    """

    return prompt


def add_data_to_gemini_response(data, articles):
    """Adds additional info to response data by matching URL."""
    # Create a dictionary mapping URLs to headlines
    article_dict = {
        article["id"]: {
            "headline": article["headline"],
            "image": article["image"],
            "image-296": article["image-296"],
            "image-412": article["image-412"],
            "color": article["color"],
            "site": article["site"],
            "url": article["url"],
            "weight": article["weight"],
        }
        for article in articles
    }

    # Update response data with all article data
    for item in data:
        id = int(item["id"])  # Change back to integer
        if id in article_dict:
            try:
                item["id"] = id
                item["url"] = article_dict[id]["url"]
                item["headline"] = article_dict[id]["headline"]
                item["image"] = article_dict[id]["image"]
                item["image-296"] = article_dict[id]["image-296"]
                item["image-412"] = article_dict[id]["image-412"]
                item["color"] = article_dict[id]["color"]
                item["site"] = article_dict[id]["site"]
                item["weight"] = article_dict[id]["weight"]
            except KeyError as e:
                print(e)
            except Exception as e:
                print(e)

    return data


def get_gemini_response(articles):
    """Sends a list of article texts to the Gemini API and processes
    the response.
    """
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

    print(f"Total articles for Gemini: {len(articles)}")

    # Send URLs to Gemini
    for i in range(ceil(len(articles) / limit)):
        article_batch = articles[i * limit : (i + 1) * limit]

        response = None
        attempts = 0
        while not response:
            try:
                response = get_gemini_response(article_batch)
            except ResourceExhausted:
                attempts += 1
                if attempts >= 10:
                    print("---- Quota hit ----")
                    break
                sleep(REQUEST_DELAY)
            except Exception as e:
                print(e)
                break

        if response and response != "error":
            data += response

        sleep(REQUEST_DELAY)
    return data


def get_canonical_topics(topics):
    """Sends a list of topics to the Gemini API and processes the response."""
    # Build the prompt then send it to the Gemini API
    prompt = f"""Please carefully analyze the following gaming/entertainment topics and provide the requested information:

        Topics: {topics}

        Request:
        Given the list of topics, please provide a dictionary mapping each canonical topic to a list of similar topics.
        - For the canonical topic, prioritize the most complete/common name. The "canonical topic" should be the most complete and commonly used name for the franchise or game within the group, and should act as the primary name for each group of topics that we are making. Always use the most common spelling/capitalization.
        - Focus on grouping specific game franchises and avoid grouping based on broader intellectual property, publishers, or companies. For example, group topics related to Assassin's Creed games together, but do not group Assassin's Creed games based on their publisher Ubisoft.
        - Opposite of the previous point, more broad topics from the provided list should not be grouped with narrower, more-specific topics. For example, Marvel should not be grouped with the canonical Marvel Rivals.
        - If a topic is a character's name that you can identify from a franchise, please group it with the correct franchise. For example, topics Geralt, Ciri, The Witcher 3, Witcher IV, and The Witcher 4 should all be grouped as The Witcher. If a character is associated with a single title in a franchise, they should still be grouped with the entire franchise.
        - Use the full name for the canonical topic when applicable. For instance, if you have 'PS5' and 'Playstation 5', use 'PlayStation 5' as the canonical title.
        - Do not group topics related to the same larger IP such as all games based on Marvel characters. For example, Marvel Rivals should not be grouped with LEGO Marvel Super Heroes or Avengers: Secret War.
        - If you are unsure of a topic or it is ambiguous, please leave it as-is. It can be its own canonical topic. This also applies to character names that could belong to multiple franchises.
        - Duplicates in the list are caused by a difference in capitalization. If you come across duplicates, treat them as a single topic and choose the most-common capitalization.
        - These topics are pulled from news articles from various outlets. Some topics may be directly related to a video game website. For example: IGN's Top 100 Games, IGN Code of Conduct, and Game of the Year at IGN.com should all be grouped as IGN. News topics that are explicitly associated with a publication (ex. "Destructoid's Best PC Game of 2024") or general article topics, like "Rock Paper Shotgun Advent Calendar 2024", should be grouped by their outlet name. If the canonical topic refers to the outlet, it should only be the outlet name in the following list instead of a longer topic. For reference, here is a list of all outlets these topics were pulled from: {list(SITES.values())}.
        - Include all canonical topics as keys in the response. If the key is the same as the original topic from the list, the value for the key/value pair should be an empty list.
        - If the resulting dictionary has two canonical topics that are identical, then treat them as a single canonical topic, and associate all values to the one canonical topic. Combine their values into a single list and remove the duplicate key.
        - Very important: topics (canonical or similar) should only appear once in the response unless they are match the previous point about . If this is not accurate then the combination function may become an infinite loop.
        - The response should include every topic from the original list, either as in a list as a "similar topic" or as a key as the "canonical topic".
        - Before submitting your response, take a break. After the break, review your response data and ensure the groupings are accurate. I would rather under-group topics than have unrelated topics grouped together.


        Response:
        Please return the information in the following structured JSON format. The response should be a single JSON dictionary, with each key being the suggested canonical topic and each value being a list of similar topics that this canonical topic represents.

            Output format:
            {{
                'Canonical Topic 1': ['similar topic 1', 'similar topic 2', ...],
                'Canonical Topic 2': ['similar topic 1', 'similar topic 2', ...],
                ...
            }}
        """
    model = gemini.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)

    # Combine text from all parts (should only be one, this is a failsafe)
    data = (
        "".join([part.text for part in response.candidates[0].content.parts])
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        data = loads(data)
    except:
        print("JSON Decode Error\n\n")
        return {}

    return data
