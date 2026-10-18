"""ASIT policy references remain isolated from executor/runtime; static only."""
from pathlib import Path
import unittest
R=Path(__file__).resolve().parents[1]
REPO=R.parent
def read(p):return (R/p).read_text(encoding="utf-8")
class PortedPoliciesTest(unittest.TestCase):
 def test_core_and_media_references(self):
  core=read("skills/asit-core/SKILL.md")
  media=read("skills/asit-media/SKILL.md")
  progress=read("skills/asit-progress/SKILL.md")
  self.assertIn("selection-invariants.md",core)
  self.assertIn("elllo-source-validation.md",media)
  self.assertIn("evidence-review.md",progress)
  for s in ("two latest","two distinct sessions","contexts","state revision","unmet prerequisites"):
   self.assertIn(s.lower(),read("skills/asit-core/references/selection-invariants.md").lower())
  self.assertIn("Conversation 1–4",read("skills/asit-media/references/elllo-source-validation.md"))
 def test_no_script_runtime_claim(self):
  for name in ("src","install","prompts","ui","templates","schemas","curriculum"):
   self.assertFalse((REPO/name).exists(),name)
  self.assertFalse((REPO/"package.json").exists())
  self.assertFalse(list(R.rglob("*.mjs")))
  self.assertIn("not runtime modules",read("skills/asit-exercises/SKILL.md"))
if __name__=="__main__":unittest.main()
