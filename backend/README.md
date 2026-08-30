# KnowledgeSilo

A multi-tenant Retrieval-Augmented Generation (RAG) API platform. Companies upload their own documents (PDF, DOCX, TXT, or a URL), and query them through a secure, isolated, rate-limited API — with every answer grounded in their own data and backed by source citations.

## Why this exists

Most RAG demos are single-user prototypes. KnowledgeSilo is built the way a real SaaS product would be: strict tenant data isolation, API-key authentication, per-key rate limiting, async background processing, automated tests, and CI/CD — not just "does the chatbot answer questions," but "would this survive being handed to another engineering team."

## Architecture

- **FastAPI** — async Python API framework
- **PostgreSQL + pgvector** — tenant data, API keys, and document embeddings, with native vector similarity search
- **MongoDB** — chat history, document metadata, and audit logs (flexible-schema data)
- **Redis** — per-API-key rate limiting (sliding window)
- **Celery** — async document ingestion, so large uploads don't block the API
- **LangGraph** — orchestrates the retrieve → generate RAG pipeline
- **Groq (openai/gpt-oss-20b)** — fast LLM inference for grounded answer generation
- **sentence-transformers (all-MiniLM-L6-v2)** — local embedding generation, 384 dimensions

### Tenant isolation

Every document chunk is tagged with a `tenant_id` at write time, and every retrieval query filters on it before any similarity search runs. One company's data is never visible to another's queries, enforced at the database query level — not just in application logic.

### Request flow

1. A tenant authenticates via an `X-API-Key` header (bcrypt-hashed, never stored in plaintext)
2. On upload: file is routed to the right loader (PDF/DOCX/TXT/URL) → text is chunked with overlap → chunks are queued for embedding via a Celery background task → vectors are stored in pgvector, tagged by tenant
3. On query: the question is embedded → the most similar chunks for *that tenant only* are retrieved via pgvector cosine similarity → LangGraph passes the question + context to Groq → a grounded answer with source citations is returned

## Tech stack

| Layer | Tools |
|---|---|
| API | FastAPI, Pydantic |
| Auth | API keys (bcrypt-hashed) + JWT |
| Databases | PostgreSQL + pgvector, MongoDB, Redis |
| Async tasks | Celery |
| RAG | LangGraph, Groq, sentence-transformers |
| Migrations | Alembic |
| Testing | pytest, pytest-asyncio |
| CI/CD | GitHub Actions |
| Containerization | Docker, docker-compose |

## Getting started

**Prerequisites:** Docker, Python 3.11+

```bash
# 1. Clone and enter the project
git clone https://github.com/Rijin-shaji/knowledgesilo.git
cd knowledgesilo/backend

# 2. Set up environment variables
cp .env.example .env
# edit .env with your own values (Groq API key, etc.)

# 3. Start the databases
docker-compose up -d

# 4. Set up Python environment
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt

# 5. Run migrations
alembic upgrade head

# 6. Start the API
uvicorn app.main:app --reload

# 7. In a separate terminal, start the Celery worker
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo   # Windows
celery -A app.tasks.celery_app worker --loglevel=info               # Mac/Linux
```

API docs available at `http://127.0.0.1:8000/docs`.

## Running tests

```bash
pytest tests/ -v
```

## Roadmap

Deliberately out of scope for the core build, to keep it focused and fully working rather than broad and half-finished:

- Streaming (SSE) responses for the `/query` endpoint
- Recursive URL crawling (currently single-page ingestion only)
- Hybrid search (keyword + semantic)
- OCR support for scanned/image-only PDFs
- Prompt-injection and input-sanitization guardrails
- React frontend (in progress)

## License

MIT