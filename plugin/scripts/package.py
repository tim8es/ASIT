#!/usr/bin/env python3
"""Validate and build the current ASIT skills-only package (no runtime hooks)."""
import argparse
import json
import re
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

ROOT=Path(__file__).resolve().parents[1]
NAME='asit-english-tutor'
EXPECTED={'asit-teacher','asit-statekeeper','asit-core','asit-english','asit-onboarding','asit-lessons','asit-exercises','asit-creative-director','asit-media','asit-voice','asit-assessment','asit-progress'}
FILES=['plugin.json','.codex-plugin/plugin.json','README.md','ACCEPTANCE.md']

def check():
    a=json.loads((ROOT/'plugin.json').read_text(encoding='utf-8'))
    b=json.loads((ROOT/'.codex-plugin/plugin.json').read_text(encoding='utf-8'))
    c=json.loads((ROOT/'skills/asit-exercises/references/ui-spec.json').read_text(encoding='utf-8'))
    assert a['name']==b['name']==NAME
    assert re.fullmatch(r'\d+\.\d+\.\d+',a['version'])
    assert a['version']==b['version']==c['contract_version']
    assert a['extensions']['com.openai']['interface']==b['interface']
    assert len(b['interface']['shortDescription'])<=30
    assert all((ROOT/x).is_file() for x in FILES)
    skills={p.parent.name:p for p in (ROOT/'skills').glob('*/SKILL.md')}
    assert set(skills)==EXPECTED, 'Wrong ASIT skill set'
    assert not list(ROOT.rglob('mcp.json')), 'ASIT is skills-only'
    for name,path in skills.items():
        text=path.read_text(encoding='utf-8')
        assert text.startswith('---\n')
        assert re.search(r'(?m)^name:\s*'+re.escape(name)+r'\s*$', text)
        assert 'description:' in text.split('---',2)[1]
    links=0
    for p in (ROOT/'skills').rglob('*.md'):
        for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',p.read_text(encoding='utf-8')):
            target=target.split('#',1)[0]
            if not target or '://' in target or target.startswith(('mailto:','#')): continue
            assert (p.parent/target).is_file(), f'Broken link: {p} -> {target}'
            links+=1
    storage=(ROOT/'skills/asit-progress/references/storage-v2.md').read_text(encoding='utf-8')
    assert all(x+':' in storage for x in ('Config','Goals','Competencies','Plans','Activities','Attempts','Reviews','Sessions','Events'))
    assert 'Block new scored UI' in storage and 'ASIT_ATTEMPT_V2' in storage
    print('ASIT package OK',a['version'],len(skills),'skills',links,'links')

def build(output):
    sources=[ROOT/name for name in FILES]
    sources+=sorted(p for p in (ROOT/'skills').rglob('*') if p.is_file() and p.suffix in ('.md','.json'))
    output.parent.mkdir(parents=True,exist_ok=True)
    with ZipFile(output,'w',compression=ZIP_DEFLATED,compresslevel=9) as z:
        for p in sources:
            info=ZipInfo(f'{NAME}/{p.relative_to(ROOT).as_posix()}',date_time=(2024,1,1,0,0,0))
            info.compress_type=ZIP_DEFLATED
            info.external_attr=0o644<<16
            z.writestr(info,p.read_bytes())
    with ZipFile(output) as z: assert len(z.namelist())==len(sources) and z.testzip() is None
    print('Built',output,len(sources),'files')

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--check',action='store_true')
    parser.add_argument('--output',type=Path)
    args=parser.parse_args()
    check()
    if args.output: build(args.output)
