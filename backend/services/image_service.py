from enum import Enum
from uuid import uuid4

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status

from config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)

CLOUDINARY_ROOT_FOLDER = "intach-pune"

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

# Magic-byte signatures for each allowed type, checked against actual file
# content rather than the client-supplied Content-Type header, which can be
# spoofed to smuggle e.g. HTML/SVG payloads past the extension allowlist.
_IMAGE_SIGNATURES: dict[str, tuple[bytes, ...]] = {
    "image/jpeg": (b"\xff\xd8\xff",),
    "image/png": (b"\x89PNG\r\n\x1a\n",),
    "image/webp": (b"RIFF",),  # WEBP also requires b"WEBP" at offset 8
}


class ImageFolder(str, Enum):
    SHOP = "shop"
    MONUMENT = "monument"
    HERITAGE_SUBMISSION = "heritage-submission"
    EVENT = "event"
    TRAIL = "trail"


def _matches_declared_type(contents: bytes, content_type: str) -> bool:
    signatures = _IMAGE_SIGNATURES.get(content_type)
    if signatures is None:
        return False
    if not any(contents.startswith(sig) for sig in signatures):
        return False
    if content_type == "image/webp" and contents[8:12] != b"WEBP":
        return False
    return True


def upload_image(file: UploadFile, folder: ImageFolder) -> str:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG, PNG, or WEBP images are allowed",
        )

    contents = file.file.read()

    if len(contents) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must be smaller than 5MB",
        )

    if not _matches_declared_type(contents, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File content does not match a valid JPEG, PNG, or WEBP image",
        )

    result = cloudinary.uploader.upload(
        contents,
        folder=f"{CLOUDINARY_ROOT_FOLDER}/{folder.value}",
        public_id=str(uuid4()),
        resource_type="image",
    )

    return result["secure_url"]
