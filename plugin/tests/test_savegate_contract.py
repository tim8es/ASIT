"""Static ASIT v0.2.8 Save Gate and auto-follow-on contract checks.
These checks cannot prove runtime host routing, Google Sheets writes or mobile UI.
"""
import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

def get(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

class SaveGateContractTests(unittest.TestCase):
    def test_manifests_synchronized(self):
        a = json.loads(get('plugin.json'))
        b = json.loads(get('.codex-plugin/plugin.json'))
        self.assertEqual(a['name'], b['name'])
        self.assertEqual(a['version'], '0.3.0')
        self.assertEqual(a['version'], b['version'])
        self.assertEqual(a['extensions']['com.openai']['onboardingSkill'], './skills/asit-onboarding/SKILL.md')

    def test_dispatch_assessment_and_continue(self):
        entry = get('skills/asit-teacher/SKILL.md')
        ass = get('skills/asit-assessment/SKILL.md')
        self.assertIn('ASIT_ATTEMPT_V2', entry)
        self.assertIn('immediately load `asit-assessment`', entry)
        self.assertIn('SAME assistant response', entry)
        self.assertIn('VALIDATE → GRADE → SAVE/VERIFY → DECIDE → PREFLIGHT → RENDER', ass)
        for t in ('Fully synced','Not saved','Not verified','Attempt saved / Partial sync'):
            self.assertIn(t, ass)
        self.assertIn('next full lesson', get('skills/asit-lessons/SKILL.md'))

    def test_next_preflight_is_required_and_saving_is_independent(self):
        lesson = get('skills/asit-lessons/SKILL.md')
        flow = get('skills/asit-assessment/references/auto-continuation.md')
        self.assertIn('Register separate Activities', lesson)
        self.assertIn('BEFORE', lesson)
        self.assertIn('explicitly unsaved', flow)
        self.assertIn('one', flow)
        self.assertIn('same', flow.lower())
        self.assertIn('replay', flow.lower())
        self.assertIn('stop/pause', flow)
        self.assertIn('not a background', flow.lower())
        self.assertIn('one final Submit', flow)
        self.assertIn('never mint a second set', flow.lower())

    def test_storage_contract_preserved(self):
        # The existing storage reference stays installed: this overlay doesn't change its terms.
        # Test the new runtime and avoid silently downgrading its privacy requirements.
        flow = get('skills/asit-assessment/references/auto-continuation.md')
        ass = get('skills/asit-assessment/SKILL.md')
        self.assertIn('summary_only', ass)
        self.assertIn('read back', ass)
        self.assertIn('consent', flow)
        self.assertIn('save-ready', flow)

if __name__ == '__main__':
    unittest.main()
