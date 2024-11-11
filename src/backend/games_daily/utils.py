from collections import defaultdict
from json import dumps
from requests import get


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
    """Identifies topics with the most total weight, combining
    substrings and returning a list of dictionaries.
    """
    topics_data = defaultdict(lambda: {"weight": 0, "count": 0})
    convert_topics = {}
    topics_seen = set()

    for article in article_data:
        # Check if the topic has already been converted
        # Use while loop to check for multiple conversions
        while article["topic"] in convert_topics:
            article["topic"] = convert_topics[article["topic"]]

        topic = article["topic"]

        # Remove surrounding quotes that Gemini sometimes adds
        if topic.startswith(("'", '"')) and topic.endswith(("'", '"')):
            topic = topic[1:-1]

        if topic not in topics_seen:
            # Find potential substring matches
            for existing_topic in topics_seen:
                if topic.startswith(existing_topic):
                    topic = existing_topic  # Use the shorter string as key
                    article["topic"] = existing_topic
                    break
                elif existing_topic.startswith(topic):
                    # Move data to shorter key and remove longer key
                    topics_data[topic]["weight"] += topics_data[
                        existing_topic
                    ]["weight"]
                    topics_data[topic]["count"] += topics_data[existing_topic][
                        "count"
                    ]
                    del topics_data[existing_topic]
                    # Remove the longer topic from topics_seen
                    topics_seen.remove(existing_topic)

                    # Track conversions
                    convert_topics[existing_topic] = topic
                    break

            topics_seen.add(topic)

        if "weight" not in article:
            print("###########################")
            print(dumps(article, indent=4))
            print("###########################")

        # Update topic data
        topics_data[topic]["weight"] += article["weight"]
        topics_data[topic]["count"] += 1

    # Check for converted topics in all articles
    for article in article_data:
        # Use while loop to check for multiple conversions
        while article["topic"] in convert_topics:
            article["topic"] = convert_topics[article["topic"]]

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


def organize_news_data(articles, topics, limit):
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


def get_previous_scrape():
    """Returns a dictionary of articles from thelast scrape,
    transformed into the desired format."""
    response = get("https://www.kfdb.app/api/news/articles").json()

    transformed_data = {
        article["url"]: {
            "summary": article["summary"],
            "topic": article["topic"],
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
