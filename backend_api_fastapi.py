from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
import google.generativeai as genai
import json
import os

# Initialize FastAPI
app = FastAPI(title="GovGrid Backend API")

# Configure Google Gemini API (Ensure you set GOOGLE_API_KEY in your environment)
# For production on GCP, you would use vertexai, but this is great for rapid prototyping.
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class GrievanceResponse(BaseModel):
    complaint_id: str
    category: str
    severity_score: int
    extracted_location: str
    lat: float
    lng: float
    damage_assessment: str

@app.post("/webhook/mock_whatsapp")
async def process_mock_message(
    message: str = Form(...),
    image: UploadFile = File(None)
):
    """
    Mock endpoint to receive WhatsApp-style inputs (Text + Optional Image).
    Routes data to Gemini for structured extraction.
    """
    try:
        # 1. Prepare the prompt instructing Gemini to output strict JSON
        prompt = f"""
        You are a civic infrastructure AI assistant analyzing a citizen's complaint.
        Extract the details and output ONLY valid JSON matching this schema:
        {{
          "complaint_id": "generate-a-random-uuid",
          "category": "Roads | Water | Electricity | Sanitation",
          "severity_score": 1-10,
          "extracted_location": "Location name from text",
          "lat": float (estimate based on location or 0.0),
          "lng": float (estimate based on location or 0.0),
          "damage_assessment": "Short description of the issue"
        }}
        
        Citizen Message: "{message}"
        """

        contents = [prompt]

        # 2. Append image to multimodal payload if provided
        if image:
            image_bytes = await image.read()
            contents.append({
                "mime_type": image.content_type,
                "data": image_bytes
            })

        # 3. Call Gemini 1.5 Flash (Fast & Multimodal)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(contents)
        
        # 4. Clean and parse the JSON response
        # (In a real app, handle markdown block stripping more robustly)
        response_text = response.text.strip().strip("```json").strip("```")
        structured_data = json.loads(response_text)

        # Here you would typically save `structured_data` to BigQuery or PostgreSQL
        
        return {"status": "success", "data": structured_data}

    except Exception as e:
        return {"status": "error", "message": str(e)}

# Run this file using: uvicorn backend_api:app --reload --port 8000