from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image, UnidentifiedImageError
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change based on frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(pdf_bytes):
    try:
        images = convert_from_bytes(pdf_bytes)
        text = " ".join([pytesseract.image_to_string(img, lang="eng") for img in images])
        return text.lower().strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF processing error: {str(e)}")

def extract_text_from_image(image_bytes):
    try:
        image = Image.open(BytesIO(image_bytes))
        text = pytesseract.image_to_string(image, lang="eng")
        return text.lower().strip()
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Invalid image file")

def check_keywords(text, keywords):
    words_in_text = text.split()
    for word in words_in_text:
        if word in keywords:
            return word
    return "No keywords found."

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_ext = file.filename.split(".")[-1].lower()
        file_bytes = await file.read()

        if file_ext == "pdf":
            text = extract_text_from_pdf(file_bytes)
        elif file_ext in ["jpg", "jpeg", "png"]:
            text = extract_text_from_image(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        keyword_dict = {"location", "policy", "premium", "claim", "coverage"}
        match_word = check_keywords(text, keyword_dict)

        return {"extracted_text": text, "matched_keyword": match_word}

    except HTTPException as e:
        raise e  # Rethrow known errors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
