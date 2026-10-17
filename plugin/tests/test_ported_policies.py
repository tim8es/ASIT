"""Static migrated-policy checks: verifies the skill references, not runtime execution."""
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parent
def read(rel): return (ROOT/rel).read_text(encoding="utf-8")

class PortedPoliciesTest(unittest.TestCase):
    def test_adapter_logic_ported_and_linked(self):
        lessons=read("skills/asit-lessons/SKILL.md")
        progress=read("skills/asit-progress/SKILL.md")
        media=read("skills/asit-media/SKILL.md")
        self.assertIn("references/selection-invariants.md",lessons)
        self.assertIn("references/evidence-review.md",progress)
        self.assertIn("references/elllo-source-validation.md",media)
        selection=read("skills/asit-lessons/references/selection-invariants.md")
        for s in ("two latest","two distinct sessions","contexts","state revision","unmet prerequisites"):
            self.assertIn(s.lower(),selection.lower())
        evidence=read("skills/asit-progress/references/evidence-review.md")
        for s in ("2, 4, 7, 14, 21","summary_only","read back","transferable"):
            self.assertIn(s.lower(),evidence.lower())
        elllo=read("skills/asit-media/references/elllo-source-validation.md")
        self.assertIn("Conversation 1–4",elllo)
        self.assertIn("15–60s",elllo)
    def test_old_runtime_and_build_tree_removed(self):
        for dirname in ("src","scripts","install","prompts","ui","templates","schemas","tests","curriculum","evals","examples"):
            self.assertFalse((REPO/dirname).exists(),dirname)
        self.assertFalse((REPO/"package.json").exists())
        self.assertFalse(list(ROOT.rglob("*.mjs")))
if __name__=="__main__": unittest.main()
