import os
import time
import httpx


GAMMA_URL = os.getenv("POLYMARKET_GAMMA_URL", "https://gamma-api.polymarket.com")


def scan_once() -> None:
    try:
        with httpx.Client(timeout=15) as client:
            client.get(f"{GAMMA_URL}/markets", params={"active": "true", "limit": 5})
        print("[scanner] scan completed")
    except Exception as exc:
        print(f"[scanner] scan failed: {exc}")


if __name__ == "__main__":
    while True:
        scan_once()
        time.sleep(3600)
