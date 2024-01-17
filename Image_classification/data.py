from PIL import Image

def get_image_information(image_path):
    try:
        with Image.open(image_path) as img:
            # Get the metadata
            metadata = img.info

            # Get image dimensions
            width, height = img.size

            # Assess picture quality based on dimensions
            picture_quality = "High" if max(width, height) >= 2000 else "Low"

            # Check if it's a vector image based on the mode
            is_vector_image = img.mode == "RGBA"  # This is a simplistic check

        # Create a dictionary with all the information
        image_information = {
            "metadata": metadata,
            "picture_quality": picture_quality,
            "is_vector_image": is_vector_image,
        }

        return image_information
    except Exception as e:
        print(f"Error: {e}")
        return None

image_path = "C:/new/input/fake/f1.jpeg"
information = get_image_information(image_path)

if information:
    print("Image Information:")
    for key, value in information.items():
        if key == 'metadata':
            for x, y in value.items():  # Iterate over 'value' for metadata
                print(f"{x}: {y}")
        else:
            print(f"{key}: {value}")
else:
    print("Failed to retrieve information.")