from PIL import Image
import base64
import io
import os

img_path = r'C:\Users\karri\.gemini\antigravity\brain\457ba64e-d31d-4487-a898-617af66f43ab\.user_uploaded\media_1788515861928.jpg'
img = Image.open(img_path)

# Lakshmi: x: 30 to 110, y: 20 to 120
lakshmi = img.crop((30, 20, 110, 120))
os.makedirs(r'C:\Users\karri\.gemini\antigravity\scratch\kms_seafoods_bill_app\public\logos', exist_ok=True)
lakshmi.save(r'C:\Users\karri\.gemini\antigravity\scratch\kms_seafoods_bill_app\public\logos\lakshmi.png')

# Ganesha: x: 546 to 618, y: 24 to 120
ganesha = img.crop((546, 24, 618, 120))
ganesha.save(r'C:\Users\karri\.gemini\antigravity\scratch\kms_seafoods_bill_app\public\logos\ganesha.png')

# Convert to Base64 strings for guaranteed embedding in PDF without any missing asset issues
def to_b64(image):
    buffered = io.BytesIO()
    image.save(buffered, format='PNG')
    return 'data:image/png;base64,' + base64.b64encode(buffered.getvalue()).decode()

with open(r'C:\Users\karri\.gemini\antigravity\scratch\kms_seafoods_bill_app\src\components\logoBase64.ts', 'w') as f:
    f.write(f'export const LAKSHMI_LOGO_B64 = "{to_b64(lakshmi)}";\n')
    f.write(f'export const GANESHA_LOGO_B64 = "{to_b64(ganesha)}";\n')

print('Base64 logos exported successfully!')
