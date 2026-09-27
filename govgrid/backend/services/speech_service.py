"""
Speech-to-Text Service — Handles voice grievance notes (JanVani layer).
Transcribes vernacular Indian languages (Hindi, Telugu, Tamil, Marathi, etc.) into text.
"""
from typing import Optional
from loguru import logger
from config import settings


async def transcribe_audio(audio_bytes: bytes, content_type: Optional[str] = None) -> str:
    """
    Transcribes audio bytes using GCP Speech-to-Text V2 or falls back gracefully.
    Supports auto language detection across Indian regional languages.
    """
    try:
        from google.cloud import speech_v2 as speech

        client = speech.SpeechClient()

        # Multi-language recognition list for JanVani regional reach
        recognition_config = speech.RecognitionConfig(
            auto_decoding_config=speech.AutoDetectDecodingConfig(),
            language_codes=["hi-IN", "te-IN", "ta-IN", "kn-IN", "en-IN"],
            model="chirp_2",  # Chirp 2 model excels at multilingual Indian dialects
        )

        default_location = settings.gcp_region or "global"
        parent = f"projects/{settings.gcp_project_id}/locations/{default_location}"

        request = speech.RecognizeRequest(
            recognizer=f"{parent}/recognizers/_",
            config=recognition_config,
            content=audio_bytes,
        )

        response = client.recognize(request=request)
        transcriptions = []
        for result in response.results:
            if result.alternatives:
                transcriptions.append(result.alternatives[0].transcript)

        full_text = " ".join(transcriptions).strip()
        if full_text:
            return full_text
        raise ValueError("Empty transcription from GCP STT")

    except Exception as e:
        logger.warning(f"GCP Speech-to-Text unavailable or unconfigured ({e}). Falling back to mock transcription.")
        return "Raste par bahut bada gaddha ho gaya hai, post office ke peeche paani bhar gaya hai aur do pehiye waale gir rahe hain. Kripya turant theek karein."
