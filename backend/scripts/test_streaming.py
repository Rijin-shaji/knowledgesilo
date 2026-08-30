import httpx

API_KEY = "ks_jFmqBPqT72V4nVg6hR0RY0HnF25E961Wbs4dkcy3Nos"
URL = "http://127.0.0.1:8000/api/v1/query/stream"


def main():
    with httpx.stream(
        "POST",
        URL,
        headers={"X-API-Key": API_KEY},
        json={"question": "What does the Customer Team do?"},
    ) as response:
        for line in response.iter_lines():
            if line:
                print(line)


if __name__ == "__main__":
    main()