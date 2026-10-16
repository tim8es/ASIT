"""Static acceptance checks for ASIT v0.2.6. No production Sheets writes."""
import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

def get(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

class SaveGateContractTests(unittest.TestCase):
    def test_both_manifests_synchronized(self):
        a = json.loads(get("plugin.json"))
        b = json.loads(get(".codex-plugin/plugin.json"))
        self.assertEqual(a["name"], b["name"])
        self.assertEqual(a["version"], "0.2.6")
        self.assertEqual(a["version"], b["version"])
        self.assertEqual(a["extensions"]["com.openai"]["onboardingSkill"], "./skills/asit-onboarding/SKILL.md")

    def test_dispatch_and_assessor(self):
        entry = get("skills/asit-teacher/SKILL.md")
        ass = get("skills/asit-assessment/SKILL.md")
        self.assertIn("ASIT_ATTEMPT_V2", entry)
        self.assertIn("immediately load `asit-assessment`", entry)
        self.assertIn("before any final response", ass)
        self.assertIn("Not saved", ass)
        self.assertIn("Not verified", ass)
        self.assertIn("Attempt saved / Partial sync", ass)
        self.assertIn("Fully synced", ass)

    def test_registration_and_prefs(self):
        lesson = get("skills/asit-lessons/SKILL.md")
        rules = get("skills/asit-lessons/references/lesson-rules.md")
        self.assertIn("before** presenting", lesson)
        self.assertIn("Register separate Activities", lesson)
        self.assertIn("distinct Activity", rules)
        self.assertIn("five-exercise", rules)

    def test_storage_idempotency_privacy_and_readback(self):
        p = get("skills/asit-progress/references/storage-v2.md")
        for token in ["summary_only", "exact Attempt ID", "before any retry", "read back", "state_revision", "NOT a running hook", "pre-registered"]:
            self.assertIn(token.lower(), p.lower())
        for header in ["Config:", "Goals:", "Competencies:", "Plans:", "Activities:", "Attempts:", "Reviews:", "Sessions:", "Events:"]:
            self.assertIn(header, p)
        self.assertIn('`off`, `summary_only`', p)

    def test_attempt_key_guard(self):
        p = get("skills/asit-assessment/references/attempt-protocol.md")
        self.assertIn("useId()", p)
        self.assertIn("parentAttemptId", p)
        self.assertIn("taskId", p)
        self.assertIn("replay", p.lower())

if __name__ == "__main__":
    unittest.main()
