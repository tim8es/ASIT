"""Static guardrails for a genuinely runnable, independent browser game example.

This does not execute a browser or verify the ChatGPT client.
"""
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "prototypes/parcel-mission.html"

class ParcelMissionPrototypeTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = PAGE.read_text(encoding="utf-8")

    def test_real_motion_and_reduced_motion(self):
        self.assertIn("transition:transform", self.page)
        self.assertIn(".scene.moved .parcel", self.page)
        self.assertIn("prefers-reduced-motion:reduce", self.page)
        self.assertIn('viewBox="0 0 360 230"', self.page)
        self.assertIn("transform-box:view-box", self.page)

    def test_real_actions_and_accessible_feedback(self):
        for expected in (
            'id="move"', 'id="replay"', 'id="finish"',
            'aria-live="polite"', 'addEventListener("click"', 'scene.classList.add("moved")',
            "scene.classList.remove", "Correct", "Incorrect — Try again",
        ):
            self.assertIn(expected, self.page)

    def test_privacy_and_grading_are_not_faked(self):
        for expected in ("Standalone browser demo", "No analytics", "not assessed", "Nothing was saved"):
            self.assertIn(expected, self.page)

if __name__ == "__main__":
    unittest.main()
