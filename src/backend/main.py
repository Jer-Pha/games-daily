import pillow_avif
from json import dumps
from os import makedirs, path
from time import perf_counter

import games_daily.utils as gd_utils
from games_daily.ai import build_article_data
from games_daily.cache import send_to_redis_cache
from games_daily.scrape import scrape_headlines
from games_daily.settings import ARTICLE_LIMIT, PROMPT_LIMIT, DEBUG

start_time = perf_counter()

if __name__ == "__main__":
    if DEBUG:
        test_site = ""
        existing_articles, new_articles = scrape_headlines(
            ARTICLE_LIMIT,
            site=test_site,
        )
        if not path.exists("debug"):
            makedirs("debug")

        with open(
            "debug/existing_articles.txt", "w", encoding="utf-8"
        ) as file:
            file.write(dumps(existing_articles, indent=4, ensure_ascii=False))

        with open("debug/new_articles.txt", "w", encoding="utf-8") as file:
            file.write(dumps(new_articles, indent=4, ensure_ascii=False))

        article_data = (
            build_article_data(new_articles, PROMPT_LIMIT) + existing_articles
        )

        with open("debug/article_data.txt", "w", encoding="utf-8") as file:
            file.write(dumps(article_data, indent=4, ensure_ascii=False))

        topic_data = gd_utils.build_topic_data(article_data)

        with open("debug/topic_data.txt", "w", encoding="utf-8") as file:
            file.write(dumps(topic_data, indent=4, ensure_ascii=False))

        articles_by_topic = gd_utils.organize_by_topic(
            article_data,
            topic_data,
            ARTICLE_LIMIT,
        )
        with open(
            "debug/articles_by_topic.txt", "w", encoding="utf-8"
        ) as file:
            file.write(dumps(articles_by_topic, indent=4, ensure_ascii=False))

        articles_by_site = gd_utils.organize_by_site(article_data)

        with open("debug/articles_by_site.txt", "w", encoding="utf-8") as file:
            file.write(dumps(articles_by_site, indent=4, ensure_ascii=False))
    else:
        existing_articles, new_articles = scrape_headlines(ARTICLE_LIMIT)
        article_data = (
            build_article_data(new_articles, PROMPT_LIMIT) + existing_articles
        )
        topic_data = gd_utils.build_topic_data(article_data)
        articles_by_topic = gd_utils.organize_by_topic(
            article_data,
            topic_data,
            ARTICLE_LIMIT,
        )
        articles_by_site = gd_utils.organize_by_site(article_data)
        send_to_redis_cache(topic_data, key="topics")
        send_to_redis_cache(articles_by_topic, key="articles-by-topic")
        send_to_redis_cache(articles_by_site, key="articles-by-site")

    end_time = perf_counter()
    execution_time = end_time - start_time
    print(gd_utils.format_duration(execution_time))
