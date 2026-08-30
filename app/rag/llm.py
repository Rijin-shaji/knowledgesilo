from groq import Groq
from app.config import settings

client = Groq(api_key=settings.groq_api_key)


def generate_answer(query: str, context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks)

    prompt = f"""Answer the question using ONLY the context below. If the context doesn't contain the answer, say so clearly.

Context:
{context}

Question: {query}

Answer:"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content


def generate_answer_stream(query: str, context_chunks: list[str]):
    context = "\n\n".join(context_chunks)

    prompt = f"""Answer the question using ONLY the context below. If the context doesn't contain the answer, say so clearly.

Context:
{context}

Question: {query}

Answer:"""

    stream = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta