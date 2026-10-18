"""ASIT answer-integrity source contracts; do not prove clipboard restrictions."""
import unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def read(s): return (R/s).read_text(encoding="utf-8")
class AnswerIntegrityContractTest(unittest.TestCase):
 def test_required_by_dispatch_and_lesson(self):
  lesson=read("skills/asit-lessons/SKILL.md")
  self.assertIn("answer-integrity.md",lesson)
  self.assertIn("before",lesson.lower())
  self.assertIn("UI contract",lesson)
 def test_no_cross_task_copying_or_answer_hint(self):
  p=read("skills/asit-lessons/references/answer-integrity.md")
  for marker in ["copyable","clipboard","placeholder","alt","rubric","before learner input","after-action","unverified"]:
   self.assertIn(marker,p)
  self.assertIn("UI contract",p)
 def test_assessment_unverified(self):
  p=read("skills/asit-assessment/SKILL.md")
  self.assertIn("not independent production evidence",p)
  self.assertIn("unverified client report",p)
 def test_no_user_specific_defaults(self):
  p=read("skills/asit-lessons/references/answer-integrity.md")
  self.assertNotIn("this user's explicit request",p)
if __name__=="__main__": unittest.main()
