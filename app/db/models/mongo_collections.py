from app.db.mongo import mongo_db

chat_history_collection = mongo_db["chat_history"]
document_metadata_collection = mongo_db["document_metadata"]
audit_log_collection = mongo_db["audit_log"]