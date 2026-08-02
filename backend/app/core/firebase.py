import firebase_admin
from firebase_admin import credentials, auth
from typing import Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def init_firebase():
    if not firebase_admin._apps:
        try:
            if settings.FIREBASE_CREDENTIALS_PATH:
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
            else:
                # Initialize default app (can verify un-authenticated public keys via Google OAuth API)
                firebase_admin.initialize_app()
            logger.info("Firebase Admin SDK initialized successfully.")
        except Exception as e:
            logger.warning(f"Firebase Admin init warning: {e}. Will attempt fallback token verification.")

def verify_firebase_id_token(id_token: str) -> Optional[dict]:
    init_firebase()
    try:
        # Verify the Firebase ID token using Firebase Admin SDK
        decoded_token = auth.verify_id_token(id_token, check_revoked=False)
        return decoded_token
    except Exception as e:
        logger.error(f"Error verifying Firebase ID token: {e}")
        return None
