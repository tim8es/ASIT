#!/usr/bin/env python3
"""Validate and package the ASIT Skills-only source. No runtime execution of lesson UI."""
import argparse, json, re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
ROOT=Path(__file__).resolve().parents[1]
NAME="asit-english-tutor"
EXPECTED={"asit-teacher","asit-onboarding","asit-lessons","asit-exercises","asit-media",
          "asit-voice","asit-assessment","asit-progress","asit-core","asit-english"}
def check():
 manifest=json.loads((ROOT/"plugin.json").read_text(encoding="utf-8"))
 other=json.loads((ROOT/".codex-plugin/plugin.json").read_text(encoding="utf-8"))
 assert manifest["name"]==NAME
 assert manifest["version"]==other["version"]
 assert re.fullmatch(r"\d+\.\d+\.\d+",manifest["version"])
 assert len(manifest["extensions"]["com.openai"]["interface"]["shortDescription"])<=30
 assert (ROOT/"README.md").exists() and (ROOT/"ACCEPTANCE.md").exists()
 skills={p.parent.name:p for p in (ROOT/"skills").glob("*/SKILL.md")}
 assert set(skills)==EXPECTED
 assert not list(ROOT.rglob("mcp.json"))
 for name,path in skills.items():
  s=path.read_text(encoding="utf-8")
  assert s.startswith("---\n")
  assert re.search(rf"(?m)^name:\s*{name}\s*$",s)
  assert len(s.encode("utf-8"))<1024*1024
 for path in (ROOT/"skills").rglob("*"):
  if not path.is_file():continue
  assert path.suffix in {".md",".json"},str(path)
  if path.suffix==".json":json.loads(path.read_text(encoding="utf-8"))
 for path in (ROOT/"skills").rglob("*.md"):
  s=path.read_text(encoding="utf-8")
  for url in re.findall(r"\[[^\]]*\]\(([^)]+)\)",s):
   target=url.split("#",1)[0]
   if not target or "://" in target or target.startswith(("mailto:","#")):continue
   assert (path.parent/target).is_file(),f"Broken relative link: {path} -> {target}"
 teacher=(ROOT/"skills/asit-teacher/SKILL.md").read_text(encoding="utf-8")
 assert "ui-contract.md" in teacher
 for name in EXPECTED-{"asit-teacher"}:assert name in teacher,name
 ui=(ROOT/"skills/asit-exercises/references/ui-spec.json")
 spec=json.loads(ui.read_text(encoding="utf-8"))
 assert spec["contract_version"]==manifest["version"]
 for data in spec["visual_exemplar"]["finite_answer_fields"].values():
  assert data["key"] in data["values"]
 assert "progress_explorer" in (ROOT/"skills/asit-exercises/references/pattern-registry.md").read_text()
 print(f"ASIT package source OK — version {manifest['version']}; skills: {len(skills)}")
def build(output):
 files=[ROOT/"plugin.json",ROOT/"README.md",ROOT/"ACCEPTANCE.md"]
 files.extend(p for p in (ROOT/"skills").rglob("*") if p.is_file())
 output.parent.mkdir(parents=True,exist_ok=True)
 with ZipFile(output,"w",ZIP_DEFLATED,compresslevel=9) as z:
  for p in sorted(files):
   z.write(p,arcname=f"{NAME}/{p.relative_to(ROOT).as_posix()}")
 with ZipFile(output) as z:assert z.testzip() is None
 print(f"Packed {len(files)} source files into {output}")
if __name__=="__main__":
 p=argparse.ArgumentParser()
 p.add_argument("--check",action="store_true")
 p.add_argument("--output",type=Path)
 a=p.parse_args();check()
 if a.output:build(a.output)
