"""Fast static regression tests for ASIT routing and canonical Save Gate.
Not proof of live UI, provider writes or model instruction-following.
"""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

def read(relative):
    return (ROOT / relative).read_text(encoding='utf-8')

class InstructionRouteTests(unittest.TestCase):
    def test_release_versions_match(self):
        version = json.loads(read('plugin.json'))['version']
        self.assertEqual(version, '0.3.10')
        self.assertEqual(version, json.loads(read('.codex-plugin/plugin.json'))['version'])
        self.assertEqual(version, json.loads(read('skills/asit-exercises/references/ui-spec.json'))['contract_version'])

    def test_canonical_storage_failure_is_not_silent_offline(self):
        contract = read('skills/asit-progress/references/storage-v2.md')
        self.assertIn('Block new scored UI', contract)
        self.assertIn('explicit', contract.lower())
        for path in ('skills/asit-teacher/SKILL.md', 'skills/asit-lessons/SKILL.md',
                     'skills/asit-statekeeper/SKILL.md', 'skills/asit-assessment/SKILL.md',
                     'skills/asit-assessment/references/auto-continuation.md'):
            text = read(path)
            self.assertIn('storage-v2.md', text, path)
        successor = read('skills/asit-assessment/references/auto-continuation.md')
        self.assertIn('do not', successor.lower())
        self.assertIn('automatically render an UNSAVED', successor)

    def test_quick_route_has_no_mandatory_heavy_example(self):
        router = read('skills/asit-teacher/SKILL.md')
        ui = read('skills/asit-exercises/SKILL.md')
        self.assertIn('Quick correction', router) if 'Quick correction' in router else self.assertIn('quick correction', router.lower())
        self.assertNotIn('complete-native-lesson.md', router)
        self.assertIn('only for matching', ui)

    def test_protocol_and_schema_are_preserved(self):
        storage = read('skills/asit-progress/references/storage-v2.md')
        for tab in ('Config:', 'Goals:', 'Competencies:', 'Plans:', 'Activities:',
                    'Attempts:', 'Reviews:', 'Sessions:', 'Events:'):
            self.assertIn(tab, storage)
        for name in ('recording_consent', 'audio_consent', 'state_revision', 'learner_id'):
            self.assertIn(name, storage)
        for path in ('skills/asit-progress/references/storage-v2.md',
                     'skills/asit-assessment/SKILL.md', 'skills/asit-exercises/SKILL.md'):
            self.assertIn('ASIT_ATTEMPT_V2', read(path))

if __name__ == '__main__':
    unittest.main()
