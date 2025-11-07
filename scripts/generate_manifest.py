
import os
import json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'model', 'static', 'language'))
OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'model', 'static', 'language', 'manifest.json'))

langs = ['java', 'c', 'python']
manifest = {}

for lang in langs:
    dirpath = os.path.join(ROOT, lang)
    entries = []
    if os.path.isdir(dirpath):
        for fname in sorted(os.listdir(dirpath)):
            fpath = os.path.join(dirpath, fname)
            if os.path.isfile(fpath):
                # 웹에서 접근 가능한 경로
                entries.append(f"/static/language/{lang}/{fname}")
    manifest[lang] = entries

with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print(f"manifest written to {OUT}")
