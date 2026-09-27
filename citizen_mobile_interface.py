import streamlit as st
import requests
import json

# Streamlit page config to look like a mobile app
st.set_page_config(page_title="JanVani - Citizen App", page_icon="📱", layout="centered")

st.title("📱 JanVani (Mock WhatsApp)")
st.caption("Send a message and photo to report a civic issue.")

# Setup session state for chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
        if "image" in msg:
            st.image(msg["image"], width=200)

# Sidebar for Image Upload (Simulating camera attachment)
with st.sidebar:
    st.header("📎 Attachments")
    uploaded_image = st.file_uploader("Upload a photo of the issue", type=["jpg", "png", "jpeg"])

# Chat input block
if prompt := st.chat_input("Type your complaint here in any language... (e.g., The road near Khajaguda lake is completely broken)"):
    
    # Add user message to UI
    st.session_state.messages.append({"role": "user", "content": prompt})
    if uploaded_image:
        st.session_state.messages[-1]["image"] = uploaded_image
    
    with st.chat_message("user"):
        st.markdown(prompt)
        if uploaded_image:
            st.image(uploaded_image, width=200)

    # Send to FastAPI Backend
    with st.spinner("GovGrid AI is processing..."):
        try:
            # Prepare multipart form data
            files = {}
            if uploaded_image:
                uploaded_image.seek(0)
                files["image"] = (uploaded_image.name, uploaded_image.getvalue(), uploaded_image.type)
            
            data = {"message": prompt}
            
            # Hit the local FastAPI server
            response = requests.post("http://localhost:8000/webhook/mock_whatsapp", data=data, files=files)
            
            if response.status_code == 200:
                result = response.json()
                if result["status"] == "success":
                    ai_reply = f"✅ **Complaint Logged Successfully!**\n\n" \
                               f"**Category:** {result['data']['category']}\n" \
                               f"**Severity:** {result['data']['severity_score']}/10\n" \
                               f"**Assessment:** {result['data']['damage_assessment']}"
                else:
                    ai_reply = f"❌ Error: {result.get('message')}"
            else:
                ai_reply = "❌ Server error. Ensure FastAPI is running on port 8000."
                
        except requests.exceptions.ConnectionError:
            ai_reply = "❌ Could not connect to backend. Please start the FastAPI server!"

    # Display AI response
    with st.chat_message("assistant"):
        st.markdown(ai_reply)
    st.session_state.messages.append({"role": "assistant", "content": ai_reply})