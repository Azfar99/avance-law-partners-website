"""Pack the offline Three.js render into two local WebP atlases (Pillow)."""
from pathlib import Path
from PIL import Image
import json
import re
root = Path(__file__).resolve().parents[1]
poses = json.loads((root / 'audit/intro-render/pose-checks.json').read_text())
if poses['result'] != 'PASS':
    raise RuntimeError('Render and validate the fixed-pivot poses before packing')
# Keep the sparks/smoke origin on the rendered head's actual contact point.
x, y = poses['contactPixel']
scene_path = root / 'scripts/brand-opening-scene.js'
scene = scene_path.read_text(encoding='utf-8')
updated, count = re.subn(r'const x = [\d.]+, y = [\d.]+, t = sinceContact;',
                         f'const x = {x:.2f}, y = {y:.2f}, t = sinceContact;', scene)
if count != 1:
    raise RuntimeError('Expected one contact origin in the playback source')
if updated != scene:
    scene_path.write_text(updated, encoding='utf-8')
frames = [Image.open(root / 'audit/intro-render' / f'frame-{i:02d}.png').convert('RGB') for i in range(32)]
for size in (320, 512):
    atlas = Image.new('RGB', (size * 8, size * 4), '#000000')
    for i, frame in enumerate(frames):
        atlas.paste(frame.resize((size, size), Image.Resampling.LANCZOS), ((i % 8) * size, (i // 8) * size))
    target = root / f'public/images/intro-gavel-{size}.webp'
    atlas.save(target, 'WEBP', quality=84, method=6)
    print(f'{target.name}: {target.stat().st_size} bytes')
