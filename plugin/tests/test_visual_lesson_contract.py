"""Static guardrails for ASIT Skills-only visual-first + auto-follow-on release."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class VisualLessonContractTest(unittest.TestCase):
    def test_runtime_lesson_skill_loads_visual_standard(self):
        lesson = (ROOT / 'skills/asit-lessons/SKILL.md').read_text(encoding='utf-8')
        self.assertIn('references/visual-lesson-standard.md', lesson)
        self.assertIn('before', lesson.lower())
        self.assertIn('Save Gate', lesson)
        self.assertIn('media-provenance.md', lesson)
        self.assertIn('game-patterns.md', lesson)
        self.assertIn('post-submit continuation', lesson)
    def test_auto_continuation_has_visual_gate(self):
        flow = (ROOT/'skills/asit-assessment/references/auto-continuation.md').read_text(encoding='utf-8').lower()
        for item in ('visual standard','consent','preflight','new lesson','render'):
            self.assertIn(item, flow)
    def test_manifest_version(self):
        manifest = json.loads((ROOT / 'plugin.json').read_text(encoding='utf-8'))
        self.assertEqual(manifest['version'], '0.3.2')
if __name__ == '__main__':
    unittest.main()
