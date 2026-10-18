"""ASIT Core remains separate from English and UI. Static source checks."""
import json
from pathlib import Path
import unittest
R=Path(__file__).resolve().parents[1]
def read(p):return (R/p).read_text(encoding="utf-8")
class CoreAdapterContractTest(unittest.TestCase):
 def test_version_alignment(self):
  a=json.loads(read("plugin.json")); b=json.loads(read(".codex-plugin/plugin.json"))
  self.assertEqual(a["version"],"0.3.7")
  self.assertEqual(a["version"],b["version"])
 def test_core_english_independent(self):
  core=read("skills/asit-core/SKILL.md"); english=read("skills/asit-english/SKILL.md")
  for x in ("subject-neutral","ASIT_ATTEMPT_V2","asit-progress","selection-invariants.md"):
   self.assertIn(x.lower(),core.lower())
  for x in ("CEFR","ELLLO","can-do-starters.md","rubric","unassessed"):
   self.assertIn(x,english)
 def test_renderer_uses_adapters(self):
  router=read("skills/asit-teacher/SKILL.md"); lesson=read("skills/asit-lessons/SKILL.md")
  for x in ("asit-core","asit-english","asit-assessment","asit-progress"):
   self.assertIn(x,router)
  self.assertIn("ui-contract.md",lesson)
  self.assertIn("ui-families.md",lesson)
if __name__=="__main__":unittest.main()
