import asyncio
import httpx

API_KEY = "ks_jFmqBPqT72V4nVg6hR0RY0HnF25E961Wbs4dkcy3Nos"
URL = "http://127.0.0.1:8000/me"


async def main():
    async with httpx.AsyncClient() as client:
        for i in range(1, 26):
            response = await client.get(URL, headers={"X-API-Key": API_KEY})
            print(f"Request {i}: {response.status_code}")


if __name__ == "__main__":
    asyncio.run(main())