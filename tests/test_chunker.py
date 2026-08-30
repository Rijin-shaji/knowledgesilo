from app.ingestion.chunker import chunk_text

def test_chunk_text_produces_multiple_chunks_for_long_text():
    text = " ".join([f"word{i}" for i in range(1200)])
    chunks = chunk_text(text)
    assert len(chunks) > 1


def test_chunk_text_single_chunk_for_short_text():
    text = "This is a short sentence."
    chunks = chunk_text(text)
    assert len(chunks) == 1


def test_chunks_overlap():
    text = " ".join([f"word{i}" for i in range(1200)])
    chunks = chunk_text(text, chunk_size=500, overlap=50)

    chunk1_words = set(chunks[0].split())
    chunk2_words = set(chunks[1].split())
    overlap_words = chunk1_words & chunk2_words

    assert len(overlap_words) > 0