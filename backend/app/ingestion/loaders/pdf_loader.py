import io
from pypdf import PdfReader

def load_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(file_bytes))
    pages_text = []

    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages_text.append(text)

    return "\n\n".join(pages_text)