from boto3 import client
from requests import get
from io import BytesIO
from PIL import Image
from decouple import config

# Cloudflare R2 configuration
CLOUDFLARE_ACCESS_KEY = config("CLOUDFLARE_ACCESS_KEY")
CLOUDFLARE_SECRET_KEY = config("CLOUDFLARE_SECRET_KEY")
CLOUDFLARE_BUCKET = config("CLOUDFLARE_BUCKET")
CLOUDFLARE_R2_ENDPOINT = config("CLOUDFLARE_R2_ENDPOINT")

s3_client = client(
    "s3",
    endpoint_url=CLOUDFLARE_R2_ENDPOINT,
    aws_access_key_id=CLOUDFLARE_ACCESS_KEY,
    aws_secret_access_key=CLOUDFLARE_SECRET_KEY,
    region_name="auto",
)


def upload_image_to_r2(image_data, filename):
    """Uploads image data to Cloudflare R2."""
    try:
        s3_client.upload_fileobj(
            image_data,
            CLOUDFLARE_BUCKET,
            filename,
            ExtraArgs={
                "ContentType": "image/webp",
                "ACL": "public-read",
            },
        )
        return filename
    except Exception as e:
        print(f"Error uploading to R2: {e}")
        return None


def resize_image(image_url, image_width):
    """Downloads an image, resizes it using Pillow, and returns a
    BytesIO object.
    """
    try:
        response = get(image_url, stream=True)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content))
        width, height = image.size
        new_height = int(height * (image_width / width))
        image = image.resize((image_width, new_height))
        image_io = BytesIO()
        image.convert("RGB").save(image_io, "WEBP", quality=80)
        image_io.seek(0)
        return image_io
    except Exception as e:
        print(f"Error resizing image: {e}")
        return None


def process_image(image_url, filename, image_width):
    """Resizes and uploads an image to Cloudflare R2."""
    image_data = resize_image(image_url, image_width)
    if image_data:
        return upload_image_to_r2(image_data, filename)
    return ""
