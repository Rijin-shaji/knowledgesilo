from app.core.security import generate_api_key, hash_api_key, verify_api_key

def test_generate_api_key_has_prefix():
    key = generate_api_key()
    assert key.startswith("ks_")


def test_generate_api_key_is_unique():
    key1 = generate_api_key()
    key2 = generate_api_key()
    assert key1 != key2


def test_hash_and_verify_correct_key():
    raw_key = generate_api_key()
    hashed = hash_api_key(raw_key)
    assert verify_api_key(raw_key, hashed) is True


def test_verify_rejects_wrong_key():
    raw_key = generate_api_key()
    hashed = hash_api_key(raw_key)
    assert verify_api_key("wrong_key_entirely", hashed) is False