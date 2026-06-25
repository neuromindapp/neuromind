import json
from typing import Any

import httpx
from anthropic import AsyncAnthropic

from app.core.config import settings


class AIProviderUnavailable(RuntimeError):
    pass


async def generate_deep_dive(prompt: str) -> dict[str, Any]:
    provider = settings.ai_provider.lower().strip()
    if provider == "gemini":
        return await _generate_with_gemini(prompt)
    if provider in {"anthropic", "claude", "research"}:
        return await _generate_with_anthropic(prompt)
    raise AIProviderUnavailable(f"Unsupported AI provider: {settings.ai_provider}")


async def _generate_with_gemini(prompt: str) -> dict[str, Any]:
    if not settings.gemini_api_key:
        raise AIProviderUnavailable("GEMINI_API_KEY is not configured")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.gemini_model}:generateContent"
    )
    payload = {
        "system_instruction": {"parts": [{"text": settings.ai_system_instruction}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json"},
    }
    async with httpx.AsyncClient(timeout=90) as client:
        response = await client.post(url, params={"key": settings.gemini_api_key}, json=payload)
        response.raise_for_status()

    data = response.json()
    text = data["candidates"][0]["content"]["parts"][0]["text"]
    return _parse_json_text(text)


async def _generate_with_anthropic(prompt: str) -> dict[str, Any]:
    if not settings.anthropic_api_key:
        raise AIProviderUnavailable("ANTHROPIC_API_KEY is not configured")

    client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    response = await client.messages.create(
        model=settings.anthropic_deepdive_model,
        max_tokens=3500,
        system=settings.ai_system_instruction,
        messages=[{"role": "user", "content": prompt}],
    )
    text = "".join(block.text for block in response.content if getattr(block, "type", "") == "text")
    return _parse_json_text(text)


def _parse_json_text(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`").removeprefix("json").strip()
    if "{" in cleaned and "}" in cleaned:
        cleaned = cleaned[cleaned.find("{") : cleaned.rfind("}") + 1]
    parsed = json.loads(cleaned)
    if not isinstance(parsed, dict):
        raise ValueError("AI response must be a JSON object")
    return parsed
