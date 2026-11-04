"""Deterministic derivatives of the supplied logo. Requires Pillow; no artwork is invented."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import base64

root = Path(__file__).resolve().parents[1]
public = root / 'public'
logo = Image.open(public / 'images/avance-law-partners-logo.png').convert('RGBA')
for size, name in [(320, 'avance-law-partners-logo.webp'), (240, 'avance-law-partners-intro.webp')]:
    logo.resize((size, size), Image.Resampling.LANCZOS).save(public / 'images' / name, 'WEBP', quality=88, method=6)

for size in [480, 960]:
    logo.resize((size, size), Image.Resampling.LANCZOS).save(
        public / 'images' / f'avance-law-partners-intro-{size}.webp', 'WEBP', quality=92, method=6)

# Retain the authentic ALP monogram, omit the tiny wordmark, flatten its gold for small sizes.
emblem = logo.crop((95, 115, 1110, 755))
alpha = emblem.getchannel('A').point(lambda value: 255 if value > 150 else 0)
mark = Image.new('RGBA', emblem.size, '#c9a227')
mark.putalpha(alpha)
mark = ImageOps.contain(mark, (228, 228), Image.Resampling.LANCZOS)
icon = Image.new('RGBA', (256, 256), '#101923')
icon.alpha_composite(mark, ((256-mark.width)//2, (256-mark.height)//2))
for size in [16, 32]:
    icon.resize((size, size), Image.Resampling.LANCZOS).save(public / f'favicon-{size}x{size}.png')
icon.save(public / 'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])
icon.resize((180,180), Image.Resampling.LANCZOS).save(public / 'apple-touch-icon.png')
# Self-contained SVG container keeps the exact derived monogram; embedded PNG is disclosed.
from io import BytesIO
buffer = BytesIO()
icon.save(buffer, 'PNG', optimize=True)
embedded = base64.b64encode(buffer.getvalue()).decode('ascii')
(public / 'favicon.svg').write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">'
    '<!-- Authentic logo monogram, embedded at 256px; dedicated 16/32px PNG fallbacks supplied. -->'
    f'<image width="256" height="256" href="data:image/png;base64,{embedded}"/></svg>', encoding='utf8')

card = Image.new('RGB', (1200,630), '#101923')
stamp = ImageOps.contain(logo, (430,430), Image.Resampling.LANCZOS)
card.paste(stamp, (55,100), stamp)
draw = ImageDraw.Draw(card)
serif = ImageFont.truetype('C:/Windows/Fonts/times.ttf', 66)
sans = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 25)
draw.text((530,190), 'Avance Law', font=serif, fill='#f6f1e4')
draw.text((530,267), 'Partners', font=serif, fill='#f6f1e4')
draw.line((533,366,684,366), fill='#c9a227', width=2)
draw.text((533,403), 'Dhaka, Bangladesh', font=sans, fill='#c9a227')
card.save(public / 'images/social-card.png', optimize=True)
print('Brand derivatives generated from the supplied logo.')
