"""ASIT critical-path contracts without fragile documentation phrase matching."""
import json
import re
import unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def read(p):return (R/p).read_text(encoding="utf-8")
class CriticalPathContractTests(unittest.TestCase):
 def test_version_and_lazy_routing(self):
  p=json.loads(read("plugin.json"))
  self.assertEqual(p["version"],"0.3.6")
  entry=read("skills/asit-teacher/SKILL.md")
  self.assertIn("brief answers",entry)
  self.assertIn("ui-contract.md",entry)
  self.assertIn("UI families",entry)
 def test_blueprint_and_store(self):
  lesson=read("skills/asit-lessons/SKILL.md")
  assess=read("skills/asit-assessment/SKILL.md")
  progress=read("skills/asit-progress/SKILL.md")
  for word in ("Activity","rubric","before","readback","Save Gate"):
   self.assertIn(word.lower(),lesson.lower())
  self.assertIn("grade once",assess)
  for word in ("consent","state_revision","Activities","Attempts","projections"):
   self.assertIn(word.lower(),progress.lower())
 def test_feedback_never_leaks(self):
  feedback=read("skills/asit-exercises/references/visual-feedback.md")
  integrity=read("skills/asit-lessons/references/answer-integrity.md")
  self.assertIn("Incorrect — Try again",feedback)
  self.assertIn("without revealing the solution",feedback)
  self.assertIn("neutral",integrity)
 def test_complete_registry_not_lost(self):
  source=read("skills/asit-exercises/references/pattern-registry.md")
  names=re.findall(r"^\| `([a-z_]+)` \|",source,flags=re.MULTILINE)
  self.assertEqual(len(names),18)
  self.assertIn("image_hotspot",names)
  self.assertIn("progress_explorer",names)
  self.assertIn("listening",names)
 def test_media_and_cefr_borders(self):
  self.assertIn("ELLLO",read("skills/asit-media/SKILL.md"))
  self.assertIn("CEFR",read("skills/asit-english/SKILL.md"))
  self.assertIn("not_assessed",read("skills/asit-exercises/SKILL.md"))
if __name__=="__main__":unittest.main()
