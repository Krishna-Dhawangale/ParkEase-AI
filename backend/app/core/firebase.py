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
                firebase_admin.initialize_app(options={'projectId': settings.FIREBASE_PROJECT_ID})
            logger.info("Firebase Admin SDK initialized successfully.")
        except Exception as e:
            logger.warning(f"Firebase Admin init warning: {e}. Will attempt fallback token verification.")

import jwt
from jwt import PyJWKClient

url = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
jwks_client = PyJWKClient(url)

def verify_firebase_id_token(id_token: str) -> Optional[dict]:
    try:
        if settings.FIREBASE_CREDENTIALS_PATH:
            # If credentials are provided, use Firebase Admin SDK
            init_firebase()
            return auth.verify_id_token(id_token, check_revoked=False)
            
        # Fallback to manual JWT verification if no credentials are provided to avoid ADC errors
        signing_key = jwks_client.get_signing_key_from_jwt(id_token)
        decoded_token = jwt.decode(
            id_token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.FIREBASE_PROJECT_ID,
            issuer=f"https://securetoken.google.com/{settings.FIREBASE_PROJECT_ID}",
            options={"verify_exp": True},
            leeway=60
        )
        if "uid" not in decoded_token:
            decoded_token["uid"] = decoded_token.get("sub") or decoded_token.get("user_id")
        return decoded_token
    except Exception as e:
        logger.error(f"Error verifying Firebase ID token: {e}")
        return None
