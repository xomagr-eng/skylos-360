"""Φτιάχνει τα εικονίδια PWA του ΣΚΥΛΟΣ 360° (πατουσίτσα σε κόκκινο κύκλο, σκούρο φόντο).
Χρήση: python tools/make_icons.py  (από τον φάκελο Skylos360)"""
import os
from PIL import Image, ImageDraw

BG, RED, WHITE = (14, 15, 19), (228, 34, 47), (255, 255, 255)
OUT = os.path.join(os.path.dirname(__file__), '..', 'icons')
os.makedirs(OUT, exist_ok=True)

def paw(d, cx, cy, s):
    # μεγάλο μαξιλαράκι
    d.ellipse([cx - .30*s, cy - .02*s, cx + .30*s, cy + .40*s], fill=WHITE)
    # 4 δάχτυλα
    for dx, dy, r in [(-.36, -.20, .115), (-.13, -.38, .125), (.13, -.38, .125), (.36, -.20, .115)]:
        x, y = cx + dx*s, cy + dy*s
        d.ellipse([x - r*s, y - r*1.25*s, x + r*s, y + r*1.25*s], fill=WHITE)

def icon(size, maskable=False):
    k = 4  # supersampling για λεία άκρα
    S = size * k
    im = Image.new('RGB', (S, S), BG)
    d = ImageDraw.Draw(im)
    # maskable: το περιεχόμενο μέσα στη «ασφαλή ζώνη» (80%)
    circ = .80 if maskable else .92
    m = S * (1 - circ) / 2
    d.ellipse([m, m, S - m, S - m], fill=RED)
    paw(d, S/2, S*.50, S * (.46 if maskable else .52))
    return im.resize((size, size), Image.LANCZOS)

for sz in (192, 512):
    icon(sz).save(os.path.join(OUT, f'icon-{sz}.png'))
    icon(sz, True).save(os.path.join(OUT, f'maskable-{sz}.png'))
icon(180).save(os.path.join(OUT, 'apple-touch-icon.png'))
icon(32).save(os.path.join(OUT, 'favicon-32.png'))
print('ok', sorted(os.listdir(OUT)))
