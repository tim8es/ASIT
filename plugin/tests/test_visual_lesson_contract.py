"""Contract tests for goal-specific UI families. Static only; host QA remains separate."""
import json
from pathlib import Path
import unittest
R=Path(__file__).resolve().parents[1]
def read(s): return (R/s).read_text(encoding="utf-8")
class VisualLessonContractTest(unittest.TestCase):
 def test_goal_before_visual(self):
  a=read("skills/asit-lessons/SKILL.md")
  b=read("skills/asit-exercises/references/ui-contract.md")
  self.assertIn("ui-contract.md",a)
  self.assertIn("can-do",a.lower())
  self.assertIn("SVG movement is not obligatory",b)
 def test_suitable_families(self):
  j=json.loads(read("skills/asit-exercises/references/ui-spec.json"))
  self.assertFalse(j["families"]["reading_reasoning"]["diagram_required"])
  self.assertEqual(j["families"]["visual_discovery"]["diagram_modality"],"visual_symbols")
  self.assertTrue(j["families"]["listening_lab"]["hearing_report_required"])
 def test_versions(self):
  x=json.loads(read("plugin.json"))
  self.assertEqual(x["version"],"0.3.6")
if __name__=="__main__": unittest.main()
