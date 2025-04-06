
# Image Analysis Flask Backend

This backend provides two main endpoints:
- `/api/analyze`: Analyzes an uploaded image and returns labels, objects, and color information
- `/api/similar`: Finds visually similar images to the uploaded image

## Setup and Running

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python app.py
   ```
   
The server will start on http://localhost:5000

## API Documentation

### Analyze Image
- **URL**: `/api/analyze`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Request Body**:
  - `image`: Image file (JPG, PNG, JPEG, WebP)
- **Response**: JSON containing labels, objects, and colors analysis

### Find Similar Images
- **URL**: `/api/similar`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Request Body**:
  - `image`: Image file (JPG, PNG, JPEG, WebP)
- **Response**: JSON array of similar images with id, url, similarity score, and source

### Health Check
- **URL**: `/health`
- **Method**: GET
- **Response**: JSON with status information
