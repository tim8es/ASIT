"""Offline contract checks; not a live ChatGPT UI acceptance test."""
from pathlib import Path
import unittest
ROOT = Path(__file__).resolve().parents[1]

class CreativeDirectionTests(unittest.TestCase):
    def test_director_is_invoked_in_both_full_lesson_routes(self):
        for name in ('asit-teacher','asit-lessons'):
            text = (ROOT / 'skills' / name / 'SKILL.md').read_text()
            self.assertIn('../asit-creative-director/SKILL.md', text)
    def test_quality_gate_is_mandatory(self):
        director = (ROOT / 'skills/asit-creative-director/SKILL.md').read_text()
        lesson_gate = (ROOT / 'skills/asit-lessons/references/lesson-quality-gate.md').read_text()
        self.assertIn('creative-quality-gate.md', director)
        self.assertIn('creative-quality-gate.md', lesson_gate)
        self.assertIn('hard stop', (ROOT / 'skills/asit-creative-director/references/creative-quality-gate.md').read_text())
    def test_media_and_accessibility_boundaries_survive(self):
        director = (ROOT / 'skills/asit-creative-director/SKILL.md').read_text()
        self.assertIn('accessibility', director)
        self.assertIn('never invent image references', director)
        self.assertIn('NOT a rendering engine', director)
    def test_reference_pack_exists(self):
        root=ROOT / 'skills/asit-creative-director/references'
        for f in ('design-system.md','experience-patterns.md','creative-quality-gate.md','golden-examples.md'):
            self.assertTrue((root/f).exists(),f)
    def test_does_not_force_unrelated_visuals(self):
        director=(ROOT / 'skills/asit-creative-director/SKILL.md').read_text()
        self.assertIn('no illustration', director)
        self.assertIn('text-only preference', director)

if __name__ == '__main__': unittest.main()
