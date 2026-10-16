"""Static guardrails for the ASIT visual-first Skills-only release."""
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

    def test_visual_standard_teaches_through_discovery(self):
        standard = (ROOT / 'skills/asit-lessons/references/visual-lesson-standard.md').read_text(encoding='utf-8').lower()
        for item in ('brilliant', 'duolingo', 'skyeng', 'predict', 'manipulate', 'explain'):
            self.assertIn(item, standard)

    def test_cover_and_real_image_tasks_are_distinct(self):
        standard = (ROOT / 'skills/asit-lessons/references/visual-lesson-standard.md').read_text(encoding='utf-8').lower()
        for item in ('16:9', 'two graded visual interactions', 'image_label', 'image_choice', 'cover never counts', 'text-only'):
            self.assertIn(item, standard)

    def test_storage_and_accessibility_are_respected(self):
        standard = (ROOT / 'skills/asit-lessons/references/visual-lesson-standard.md').read_text(encoding='utf-8')
        for item in ('Save Gate', 'keyboard', 'not_assessed', 'one real Submit'):
            self.assertIn(item, standard)

    def test_manifest_version(self):
        manifest = json.loads((ROOT / 'plugin.json').read_text(encoding='utf-8'))
        self.assertEqual(manifest['version'], '0.2.7')


if __name__ == '__main__':
    unittest.main()
