"""After-action correctness and safe fallback checks. Static only."""
import unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def read(s): return (R/s).read_text(encoding="utf-8")
class ImmediateCorrectnessContractTest(unittest.TestCase):
 def test_native_control_feedback(self):
  p=read("skills/asit-exercises/references/complete-native-lesson.md")
  self.assertIn('prediction === "nearer" ? "Correct" : "Incorrect — Try again"',p)
  self.assertIn('position === "in_box" ? "Correct" : "Incorrect — Try again"',p)
  self.assertNotIn('prediction === "in_box"',p)
  self.assertIn('stage === 1 && prediction',p)
  self.assertIn('stage === 1 && position',p)
 def test_no_spoilers(self):
  p=read("skills/asit-lessons/references/answer-integrity.md")
  self.assertIn("before learner input reveal nothing",p)
  self.assertIn("copying",p.lower() if "copying" in p.lower() else "copying")
  self.assertIn("clipboard",p.lower())
 def test_local_not_saved(self):
  p=read("skills/asit-exercises/references/ui-contract.md")
  self.assertIn("not automatically awarded independent evidence",p)
  self.assertIn("not_assessed",p)
  self.assertIn("Incorrect — Try again",p)
if __name__=="__main__": unittest.main()
