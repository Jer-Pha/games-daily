from decouple import config
from json import dumps
from time import perf_counter

import games_daily.utils as gd_utils
from games_daily.ai import build_article_data
from games_daily.cache import send_to_redis_cache
from games_daily.scrape import scrape_headlines

start_time = perf_counter()

ARTICLE_LIMIT = 10
PROMPT_LIMIT = 10
DEBUG = config("DEBUG", default=True, cast=bool)


if __name__ == "__main__":
    if DEBUG:
        test_site = ""
        existing_articles, new_articles = scrape_headlines(
            ARTICLE_LIMIT,
            site=test_site,
        )
        # print(dumps(new_articles, indent=4, ensure_ascii=False))
        article_data = (
            build_article_data(new_articles, PROMPT_LIMIT) + existing_articles
        )
        # print(dumps(article_data, indent=4, ensure_ascii=False))
        print(len(article_data))
        topic_data = gd_utils.build_topic_data(article_data)
        core_data = gd_utils.organize_news_data(
            article_data,
            topic_data,
            ARTICLE_LIMIT,
        )
        print(dumps(core_data, indent=4, ensure_ascii=False))
    else:
        existing_articles, new_articles = scrape_headlines(ARTICLE_LIMIT)
        article_data = (
            build_article_data(new_articles, PROMPT_LIMIT) + existing_articles
        )
        topic_data = gd_utils.build_topic_data(article_data)
        core_data = gd_utils.organize_news_data(
            article_data,
            topic_data,
            ARTICLE_LIMIT,
        )
        send_to_redis_cache(topic_data, key="topics")
        send_to_redis_cache(core_data, key="articles")

    end_time = perf_counter()
    execution_time = end_time - start_time
    print(gd_utils.format_duration(execution_time))
