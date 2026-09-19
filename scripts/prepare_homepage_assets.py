from __future__ import annotations

import argparse
import io
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw


PUBLIC_ASSETS = {
    "portrait": "images/profile/haibiao-zhang.jpg",
    "wechat": "images/contact/wechat-haibiao-zhang.png",
    "rf": "images/publications/rf-oscillation-diagnosis.jpg",
    "robust": "images/publications/robust-fault-prediction.png",
    "launcher": "images/publications/ecrh-launcher.png",
    "cfedr": "images/publications/cfedr-eccd.png",
    "twcs": "images/publications/twcs.png",
    "patent1": "images/ip/cn120029768b.png",
    "patent2": "images/ip/cn121619724b.png",
    "copyright1": "images/ip/2025sr1824848.png",
    "copyright2": "images/ip/2020sr0059618.png",
}

LOGOS = {
    "images/institutions/ustc.png": "https://www.ustc.edu.cn/images/zkdlogo.png",
    "images/institutions/swfu.png": "https://www.swfu.edu.cn/images/0917.png",
    "images/institutions/ipp-cas.png": (
        "http://www.ipp.cas.cn/dwgk/bsxt/202304/W020250115795579308228.png"
    ),
}


def open_rgb(path: Path) -> Image.Image:
    with Image.open(path) as source:
        return source.convert("RGB")


def save_image(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix.lower() in {".jpg", ".jpeg"}:
        image.save(path, "JPEG", quality=90, optimize=True, progressive=True)
    else:
        image.save(path, "PNG", optimize=True)


def prepare_portrait(source: Path, destination: Path) -> None:
    image = open_rgb(source)
    side = min(image.width, image.height)
    left = max(0, min(image.width - side, round(image.width * 0.235)))
    top = max(0, min(image.height - side, round(image.height * 0.01)))
    portrait = image.crop((left, top, left + side, top + side))
    portrait.thumbnail((900, 900), Image.Resampling.LANCZOS)
    save_image(portrait, destination)


def copy_optimized(source: Path, destination: Path) -> None:
    save_image(open_rgb(source), destination)


def redact(source: Path, destination: Path, boxes: list[tuple[float, float, float, float]]) -> None:
    image = open_rgb(source)
    draw = ImageDraw.Draw(image)
    for left, top, right, bottom in boxes:
        pixels = (
            round(left * image.width),
            round(top * image.height),
            round(right * image.width),
            round(bottom * image.height),
        )
        draw.rectangle(pixels, fill=(250, 248, 240))
    save_image(image, destination)


def download_logo(url: str, destination: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = response.read()
    with Image.open(io.BytesIO(payload)) as source:
        image = source.convert("RGBA")
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "PNG", optimize=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Prepare confirmed homepage media.")
    parser.add_argument("--public", required=True, type=Path)
    for key in PUBLIC_ASSETS:
        parser.add_argument(f"--{key}", required=True, type=Path)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    public = args.public.resolve()

    prepare_portrait(args.portrait, public / PUBLIC_ASSETS["portrait"])
    for key in ("wechat", "rf", "robust", "launcher", "cfedr", "twcs"):
        copy_optimized(getattr(args, key), public / PUBLIC_ASSETS[key])

    redact(
        args.patent1,
        public / PUBLIC_ASSETS["patent1"],
        [(0.24, 0.385, 0.89, 0.418), (0.23, 0.438, 0.89, 0.472), (0.23, 0.592, 0.89, 0.627)],
    )
    redact(
        args.patent2,
        public / PUBLIC_ASSETS["patent2"],
        [(0.23, 0.385, 0.89, 0.418), (0.22, 0.438, 0.89, 0.472), (0.22, 0.588, 0.89, 0.625)],
    )
    copy_optimized(args.copyright1, public / PUBLIC_ASSETS["copyright1"])
    redact(
        args.copyright2,
        public / PUBLIC_ASSETS["copyright2"],
        [(0.27, 0.335, 0.90, 0.390)],
    )

    for relative_path, url in LOGOS.items():
        download_logo(url, public / relative_path)


if __name__ == "__main__":
    main()
