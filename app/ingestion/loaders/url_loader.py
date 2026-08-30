import httpx
import trafilatura

async def load_url(url: str) -> str:
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        response = await client.get(url)
        response.raise_for_status()

    extracted = trafilatura.extract(response.text)
    return extracted or ""