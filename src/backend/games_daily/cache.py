from decouple import config
from json import dumps

from redis import StrictRedis
from redis.exceptions import ConnectionError

REDIS_HOST = config("REDIS_HOST")
REDIS_PORT = config("REDIS_PORT")
REDIS_PW = config("REDIS_PW")

if None in (REDIS_HOST, REDIS_PORT, REDIS_PW):
    raise ValueError("Environment variable(s) not found.")


def send_to_redis_cache(data, key):
    """Sends a Python dictionary to a Redis cache in JSON format."""
    try:
        # Connect to Redis
        redis_client = StrictRedis(
            host=REDIS_HOST,
            port=int(REDIS_PORT),
            db=0,
            password=REDIS_PW,
        )

        # Store JSON data in Redis with specified key
        redis_client.set(
            key,
            dumps(data, ensure_ascii=False, separators=(",", ":")),
        )
        print(f"Data successfully sent to Redis with key '{key}'")

    except ConnectionError as e:
        print(f"Error connecting to Redis: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
