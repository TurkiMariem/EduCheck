import sys

print("Python executable:", sys.executable)
print("Python version:", sys.version)
import numpy as np
from PIL import Image, ImageChops, ImageEnhance, ImageOps


def analyze_image_ela(image_path):
    image = Image.open(image_path)
    ela_image = convert_to_ela_image(image, image_path)
    
    result = detect_manipulation(ela_image)
    return result

def convert_to_ela_image(image, image_path):
    resaved_image_path = "resaved_image.jpg"
    image.save(resaved_image_path, 'JPEG', quality=95)

    resaved_image = Image.open(resaved_image_path)
    ela_image = ImageChops.difference(image, resaved_image)
    
    ela_image = ImageOps.grayscale(ela_image)
    extrema = ela_image.getextrema()
    max_diff = extrema[1]
    scale = 255.0 / max_diff if max_diff != 0 else 1

    ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)
    return ela_image

def detect_manipulation(ela_image):
    ela_array = np.array(ela_image)
    suspicious_pixels = np.sum(ela_array > 200)

    if suspicious_pixels > 1000:
        return "Document appears to be fake or manipulated"
    else:
        return "Document appears authentic"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_ela.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    result = analyze_image_ela(image_path)
    print(result)
