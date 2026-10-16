#!/usr/bin/env python3
"""Validate and build a reproducible skills-only ASIT plugin package.

Runs with Python standard library; never reads private learner data or calls APIs.
Usage:
  python3 plugin/scripts/package.py --check
  python3 plugin/scripts/package.py --output dist/ASIT_Skills_Plugin_v0.2.0.zip
"""
import argparse
import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
NAME = 'asit-english-tutor'
EXPECTED = {'asit-teacher', 'asit-onboarding', 'asit-lessons', 'asit-exercises',
            'asit-media', 'asit-voice', 'asit-assessment', 'asit-progress'}
PACK_ROOT = {'plugin.json', 'README.md', 'ACCEPTANCE.md'}


def check():
    manifest = json.loads((ROOT / 'plugin.json').read_text(encoding='utf-8'))
    assert manifest['$schema'] == 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json'
    assert manifest['name'] == NAME
    assert re.fullmatch(r'\d+\.\d+\.\d+', manifest['version'])
    assert len(manifest['extensions']['com.openai']['interface']['shortDescription']) <= 30
    skills = {p.parent.name: p for p in (ROOT / 'skills').glob('*/SKILL.md')}
    assert set(skills) == EXPECTED, f'Unexpected or missing skills: {set(skills) ^ EXPECTED}'
    assert not list(ROOT.rglob('mcp.json')), 'Skills-only plugin must not package MCP configuration'
    assert all((ROOT / f).is_file() for f in PACK_ROOT)
    total_links = 0
    for name, p in skills.items():
        text = p.read_text(encoding='utf-8')
        assert text.startswith('---\n'), f'{p} missing frontmatter'
        fm = text.split('---', 2)[1]
        assert re.search(rf'(?m)^name:\s*{re.escape(name)}\s*$', fm), name
        assert re.search(r'(?m)^description:\s*\S', fm), name
        assert len(text.encode('utf-8')) <= 1024 * 1024, name
    for p in sorted((ROOT / 'skills').rglob('*.md')):
        text = p.read_text(encoding='utf-8')
        for match in re.finditer(r'\[[^\]]*\]\(([^)]+)\)', text):
            target = match.group(1).split('#', 1)[0]
            if not target or '://' in target or target.startswith(('mailto:', '#')):
                continue
            assert (p.parent / target).is_file(), f'Broken local link: {p} -> {target}'
            total_links += 1
    registry = (ROOT / 'skills/asit-exercises/references/pattern-registry.md').read_text(encoding='utf-8')
    assert 'progress_explorer' in registry
    assert 'image_label' in registry and 'image_hotspot' in registry
    assert 'listening' in registry and 'spoken_response' in registry
    teacher = (ROOT / 'skills/asit-teacher/SKILL.md').read_text(encoding='utf-8')
    for item in EXPECTED - {'asit-teacher'}:
        assert item in teacher, f'Router omitted skill {item}'
    exercise = (ROOT / 'skills/asit-exercises/SKILL.md').read_text(encoding='utf-8')
    visual = (ROOT / 'skills/asit-exercises/references/visual-feedback.md').read_text(encoding='utf-8')
    lessons = (ROOT / 'skills/asit-lessons/SKILL.md').read_text(encoding='utf-8')
    assert 'visual-feedback.md' in exercise and 'only when rendering' in exercise
    assert 'first nonblank attempt' in visual and 'Try again' in visual and 'Review after Submit' in visual
    assert 'Do not block teaching on art generation' in visual
    visual_standard = (ROOT / 'skills/asit-lessons/references/visual-lesson-standard.md').read_text(encoding='utf-8')
    assert 'visual-lesson-standard.md' in lessons
    assert 'Brilliant' in visual_standard and 'Duolingo' in visual_standard and 'Skyeng' in visual_standard
    assert 'two graded visual interactions' in visual_standard
    assert 'Save Gate' in visual_standard
    assert 'Correct' in lessons and 'one final submit' in lessons.lower()
    assert 'ASIT_ATTEMPT_V2' in teacher and 'Save Gate' in teacher
    media = (ROOT / 'skills/asit-media/SKILL.md').read_text(encoding='utf-8')
    assert 'ELLLO' in media and 'Sound Grammar' in media
    progress = (ROOT / 'skills/asit-progress/SKILL.md').read_text(encoding='utf-8')
    assert 'consent' in progress.lower() and (('readback' in progress.lower()) or ('read back' in progress.lower()))
    for p in (ROOT / 'skills').rglob('*'):
        if p.is_file():
            assert p.suffix.lower() == '.md', f'Unexpected asset: {p}'
    print(f'ASIT Skills-only package OK: {len(skills)} skills, {total_links} local references; version {manifest["version"]}')


def build(output: Path):
    files = [ROOT / name for name in sorted(PACK_ROOT)]
    files += sorted(p for p in (ROOT / 'skills').rglob('*') if p.is_file())
    output.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(output, 'w', compression=ZIP_DEFLATED, compresslevel=9) as z:
        for p in files:
            arc = f'{NAME}/{p.relative_to(ROOT).as_posix()}'
            info = ZipInfo(arc, date_time=(2024, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = (0o644 << 16)
            z.writestr(info, p.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)
    with ZipFile(output) as z:
        assert {e.filename for e in z.infolist()} == {f'{NAME}/{p.relative_to(ROOT).as_posix()}' for p in files}
        assert z.testzip() is None
    print(f'Built {output} ({len(files)} files)')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    check()
    if args.output:
        build(args.output)

if __name__ == '__main__':
    main()
