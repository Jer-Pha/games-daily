# from decouple import config
from json import dumps
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
        # print(dumps(new_articles, indent=4, ensure_ascii=False))
        article_data = (
            build_article_data(new_articles, PROMPT_LIMIT) + existing_articles
        )
        # print(dumps(article_data, indent=4, ensure_ascii=False))
        topic_data = gd_utils.build_topic_data(article_data)
        # print(dumps(topic_data, indent=4, ensure_ascii=False))
        articles_by_topic = gd_utils.organize_by_topic(
            article_data,
            topic_data,
            ARTICLE_LIMIT,
        )
        # print(dumps(articles_by_topic, indent=4, ensure_ascii=False))
        articles_by_site = gd_utils.organize_by_site(article_data)
        print(dumps(articles_by_site, indent=4, ensure_ascii=False))
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
