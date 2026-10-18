"""Save Gate and follow-on source checks. Cannot prove provider writes."""
import unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def read(p):return (R/p).read_text(encoding="utf-8")
class SaveGateContractTest(unittest.TestCase):
 def test_dispatch_and_assessment(self):
  entry=read("skills/asit-teacher/SKILL.md")
  ass=read("skills/asit-assessment/SKILL.md")
  self.assertIn("ASIT_ATTEMPT_V2",entry)
  self.assertIn("asit-assessment",entry)
  self.assertIn("same",entry.lower())
  self.assertIn("VALIDATE → GRADE → SAVE/VERIFY → DECIDE → PREFLIGHT → RENDER",ass)
  for x in ("Fully synced","Not saved","Not verified","Attempt saved / Partial sync"):
   self.assertIn(x,ass)
 def test_before_display_trusted_activity(self):
  lesson=read("skills/asit-lessons/SKILL.md")
  ui=read("skills/asit-exercises/references/ui-contract.md")
  self.assertIn("before",lesson.lower())
  self.assertIn("readback",lesson.lower())
  self.assertIn("immutable ID",ui)
  self.assertIn("UNSAVED",ui)
 def test_storage_privacy_unchanged(self):
  ass=read("skills/asit-assessment/SKILL.md")
  progress=read("skills/asit-progress/SKILL.md")
  flow=read("skills/asit-assessment/references/auto-continuation.md")
  for x in ("summary_only","read back","consent"):
   self.assertIn(x.lower(),ass.lower())
  for x in ("readback","state_revision","Activities","Attempts"):
   self.assertIn(x.lower(),progress.lower())
  self.assertIn("stop/pause",flow)
if __name__=="__main__":unittest.main()
