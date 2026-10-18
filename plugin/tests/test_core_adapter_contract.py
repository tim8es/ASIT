"""Static architecture checks; do not imply runtime behavior."""
from pathlib import Path
import json
import unittest
ROOT=Path(__file__).resolve().parents[1]
def read(p): return (ROOT/p).read_text(encoding="utf-8")
class CoreAdapterContractTest(unittest.TestCase):
 def test_version_alignment(self):
  a=json.loads(read("plugin.json")); b=json.loads(read(".codex-plugin/plugin.json"))
  self.assertEqual(a["version"],"0.3.5")
  self.assertEqual(a["version"],b["version"])
 def test_core_and_english_are_separate(self):
  core=read("skills/asit-core/SKILL.md"); english=read("skills/asit-english/SKILL.md")
  for x in ("subject-neutral","ASIT_ATTEMPT_V2","asit-progress","teaching continues without storage","selection-invariants.md"):
   self.assertIn(x.lower(),core.lower())
  for x in ("CEFR","ELLLO","can-do-starters.md","rubric","unassessed"):
   self.assertIn(x,english)
 def test_lesson_and_router_route_to_adapters(self):
  lesson=read("skills/asit-lessons/SKILL.md")
  router=read("skills/asit-teacher/SKILL.md")
  self.assertIn("../asit-core/references/selection-invariants.md",lesson)
  self.assertIn("../asit-english/references/can-do-starters.md",lesson)
  for x in ("asit-core","asit-english","asit-assessment","asit-progress"):
   self.assertIn(x,router)
  self.assertFalse((ROOT/"skills/asit-lessons/references/selection-invariants.md").exists())
  self.assertFalse((ROOT/"skills/asit-lessons/references/can-do-starters.md").exists())
if __name__=="__main__": unittest.main()
