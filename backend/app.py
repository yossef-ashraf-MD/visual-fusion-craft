
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import numpy as np
from PIL import Image
import io
from werkzeug.utils import secure_filename
import logging

# Optional: For more advanced image analysis
# import cv2
# import tensorflow as tf

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create upload folder if it doesn't exist
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5MB max upload

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# Mock database of sample images (in production, this would be a real database)
SAMPLE_IMAGES = [
    {
        "id": "1",
        "url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        "similarity": 0.92,
        "source": "Unsplash"
    },
    {
        "id": "2",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        "similarity": 0.89,
        "source": "Unsplash"
    },
    {
        "id": "3",
        "url": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
        "similarity": 0.85,
        "source": "Unsplash"
    },
    {
        "id": "4",
        "url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
        "similarity": 0.82,
        "source": "Unsplash"
    },
    {
        "id": "5",
        "url": "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5",
        "similarity": 0.78,
        "source": "Unsplash"
    },
    {
        "id": "6",
        "url": "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        "similarity": 0.75,
        "source": "Unsplash"
    }
]

def extract_dominant_colors(img, num_colors=5):
    """Extract dominant colors from an image"""
    # Resize image to speed up processing
    img = img.copy()
    img.thumbnail((100, 100))
    
    # Convert to numpy array and reshape
    arr = np.array(img)
    pixels = arr.reshape(-1, 3)
    
    # Simple color clustering (in production, use k-means)
    unique_colors, counts = np.unique(pixels, axis=0, return_counts=True)
    
    # Sort colors by frequency
    sorted_indices = np.argsort(-counts)[:num_colors]
    top_colors = unique_colors[sorted_indices]
    
    # Calculate percentages
    total_pixels = pixels.shape[0]
    percentages = (counts[sorted_indices] / total_pixels) * 100
    
    # Convert to hex and create response
    color_data = []
    for i, color in enumerate(top_colors):
        hex_color = f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}"
        color_name = get_color_name(color)  # Simplified color naming
        color_data.append({
            "hex": hex_color,
            "name": color_name,
            "percentage": round(percentages[i], 0)
        })
    
    return color_data

def get_color_name(rgb):
    """Simplified function to name colors based on RGB values"""
    r, g, b = rgb
    
    # Simple color naming logic
    if r > 200 and g > 200 and b > 200:
        return "White"
    elif r < 50 and g < 50 and b < 50:
        return "Black"
    elif r > 200 and g < 100 and b < 100:
        return "Red"
    elif r < 100 and g > 200 and b < 100:
        return "Green"
    elif r < 100 and g < 100 and b > 200:
        return "Blue"
    elif r > 200 and g > 200 and b < 100:
        return "Yellow"
    elif r > 200 and g < 100 and b > 200:
        return "Magenta"
    elif r < 100 and g > 200 and b > 200:
        return "Cyan"
    elif r > 150 and g > 75 and b < 75:
        return "Orange"
    elif r > 100 and g < 100 and b > 100:
        return "Purple"
    elif r > 150 and g > 150 and b < 150:
        return "Gold"
    elif r > 100 and g > 75 and b < 50:
        return "Brown"
    elif r > 150 and g > 150 and b > 150:
        return "Gray"
    else:
        return f"RGB({r},{g},{b})"

def mock_object_detection(img):
    """Mock object detection - in production, use a real model"""
    width, height = img.size
    
    # Predefined objects based on image size (simulating detection)
    objects = [
        {
            "name": "Tree",
            "boundingBox": {
                "x": int(width * 0.2),
                "y": int(height * 0.4),
                "width": int(width * 0.15),
                "height": int(height * 0.3)
            }
        },
        {
            "name": "Mountain",
            "boundingBox": {
                "x": int(width * 0.5),
                "y": int(height * 0.2),
                "width": int(width * 0.3),
                "height": int(height * 0.3)
            }
        }
    ]
    
    return objects

def mock_image_labels(img):
    """Mock image classification - in production, use a real model"""
    # These would normally come from a trained model
    labels = [
        {"name": "Nature", "confidence": 0.98},
        {"name": "Landscape", "confidence": 0.95},
        {"name": "Mountain", "confidence": 0.87},
        {"name": "Forest", "confidence": 0.82},
        {"name": "Outdoors", "confidence": 0.79}
    ]
    
    return labels

@app.route("/api/analyze", methods=["POST"])
def analyze_image():
    logger.info("Received analyze image request")
    
    if "image" not in request.files:
        logger.error("No image part in the request")
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files["image"]
    
    if file.filename == "":
        logger.error("No file selected")
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        logger.error(f"File type not allowed: {file.filename}")
        return jsonify({"error": "File type not allowed"}), 400
    
    try:
        # Read the image file
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes))
        
        # Convert to RGB if necessary (in case of PNG with alpha channel)
        if img.mode != "RGB":
            img = img.convert("RGB")
        
        # Extract dominant colors
        colors = extract_dominant_colors(img)
        
        # Detect objects (mocked)
        objects = mock_object_detection(img)
        
        # Generate labels (mocked)
        labels = mock_image_labels(img)
        
        # Save the file (optional, for persistence)
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        
        with open(file_path, "wb") as f:
            f.write(img_bytes)
        
        logger.info(f"Image analysis complete for: {file.filename}")
        
        # Return analysis results
        return jsonify({
            "labels": labels,
            "objects": objects,
            "colors": colors
        })
        
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/similar", methods=["POST"])
def find_similar_images():
    logger.info("Received find similar images request")
    
    if "image" not in request.files:
        logger.error("No image part in the request")
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files["image"]
    
    if file.filename == "":
        logger.error("No file selected")
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        logger.error(f"File type not allowed: {file.filename}")
        return jsonify({"error": "File type not allowed"}), 400
    
    try:
        # In a real application, this would analyze the image and find real similar images
        # For this example, we're just returning the mocked list
        
        # Optionally save the uploaded file
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        
        file.save(file_path)
        logger.info(f"Similar image search complete for: {file.filename}")
        
        # Return similar images
        return jsonify(SAMPLE_IMAGES)
        
    except Exception as e:
        logger.error(f"Error finding similar images: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "OK", "message": "Flask API is running"}), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
