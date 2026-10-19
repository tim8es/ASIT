"""Static save-recovery instruction regression tests; does not exercise Google Sheets or host safety."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
def txt(path): return (ROOT/path).read_text(encoding="utf-8")

class SaveRecoveryTests(unittest.TestCase):
    def setUp(self):
        self.recovery=txt("skills/asit-progress/references/save-recovery.md")
        self.storage=txt("skills/asit-progress/references/storage-v2.md")

    def test_single_storage_authority(self):
        self.assertIn("subordinate to", self.recovery)
        self.assertIn("Single normative storage contract", self.storage)
        for path in ("skills/asit-progress/SKILL.md", "skills/asit-assessment/SKILL.md"):
            self.assertIn("save-recovery.md",txt(path))
            self.assertIn("storage-v2.md",txt(path))

    def test_distinguishes_provider_transient_and_platform_refusal(self):
        for token in ("transient_provider","ambiguous_write","hard_provider","platform_safety_block","verified_partial_projection","completed_replay"):
            self.assertIn(token, self.recovery)
        self.assertIn("zero retries",self.recovery.lower()) if "zero retries" in self.recovery.lower() else self.assertIn("Stop write attempts", self.recovery)
        self.assertIn("do not change wording", self.recovery)

    def test_bounded_idempotent_retry(self):
        for token in ("parentAttemptId:taskId","verified-absent","at most **one** retry","complete bound","read back","no retrospective Activity creation"):
            self.assertIn(token,self.recovery)

    def test_original_payload_privacy_and_phase_order(self):
        self.assertIn("same original payload and IDs",self.recovery)
        self.assertIn("summary_only",self.recovery)
        self.assertIn("Only after all original Attempts",self.recovery) if "Only after all original Attempts" in self.recovery else self.assertIn("only after all original Attempts", self.recovery)
        self.assertIn("read back",self.recovery)

    def test_retains_existing_receipts_schema_and_no_silent_offline(self):
        for token in ("Fully synced","Attempt saved / Partial sync","Not verified","Not saved"):
            self.assertIn(token,self.recovery)
        self.assertIn("SAVE-REQUIRED",self.storage)
        self.assertIn("Nine exact v2",txt("skills/asit-progress/SKILL.md"))
        self.assertIn("nine-tab",self.recovery.lower()) if "nine-tab" in self.recovery.lower() else self.assertIn("nine original headers",self.recovery)

if __name__ == "__main__": unittest.main()
