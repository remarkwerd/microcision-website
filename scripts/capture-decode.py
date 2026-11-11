import json, hashlib, sys, pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent / 'baseline'
for f in sorted((root/'raw').glob('*.jsonstr')):
    o = json.loads(json.loads(f.read_text().strip()))
    slug = f.stem
    h = hashlib.sha256(o['text'].encode()).hexdigest()
    ok = h == o['sha256']
    (root/'text'/f'{slug}.txt').write_text(o['text'])
    meta = {k: v for k, v in o.items() if k != 'text'}
    (root/'raw'/f'{slug}.meta.json').write_text(json.dumps(meta, indent=2))
    print(f"{slug:45} {'OK ' if ok else 'MISMATCH'} {len(o['text'])} chars  title={o['title']!r}")
