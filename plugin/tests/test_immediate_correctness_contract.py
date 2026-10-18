"""ASIT 0.2.11 static checks: immediate UI verdict and no answer leaks.
Passing these does NOT establish ChatGPT UI runtime behavior.
"""
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
read=lambda p:(ROOT/p).read_text('utf-8')

class ImmediateCorrectnessContractTest(unittest.TestCase):
 def test_teacher_explicit_current_preference(self):
  x=read('skills/asit-teacher/SKILL.md')
  for marker in ['Correct / Incorrect', 'Try again', 'after input', 'first', 'unverified']:
   self.assertIn(marker.lower(),x.lower())
 def test_lesson_feedback_contract(self):
  x=read('skills/asit-lessons/SKILL.md')
  for marker in ['immediate provisional correctness', 'semantic review', 'answer-leak', 'one canonical final Submit']:
   self.assertIn(marker.lower(),x.lower())
 def test_answer_integrity_remains_anti_copy_but_not_anti_feedback(self):
  x=read('skills/asit-lessons/references/answer-integrity.md').lower()
  for marker in ['incorrect — try again','before the first answer','no advance hints','copy/paste','first nonblank','unverified','binary multiple-choice','review after submit']:
   self.assertIn(marker.lower(),x)
  self.assertIn('do not interpret "no hints" as "hide correct/incorrect until final submit',x)
 def test_continuation_preflight_preserves_live_feedback(self):
  x=read('skills/asit-assessment/references/auto-continuation.md')
  self.assertIn('immediate post-response Correct / Incorrect',x)
 def test_not_equal_to_save_gate(self):
  self.assertIn('not the final ASIT grade or a saved Attempt',read('skills/asit-lessons/references/answer-integrity.md'))

if __name__=='__main__': unittest.main()
