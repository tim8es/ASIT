"""Offline structural regression checks for ASIT's installed Skills-only references.
These checks never establish host UI execution, actual image rendering or trusted provider writes.
Run: python -m unittest discover -s tests -p 'test_*.py' from package root.
"""
import json
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'skills/asit-exercises/references'
TPL = (REF / 'complete-native-lesson.md').read_text()
SPEC = json.loads((REF / 'ui-spec.json').read_text())


class TestNativeUIContract(unittest.TestCase):
    def test_finite_answer_keys_are_in_real_value_domains(self):
        for field, entry in SPEC['visual_exemplar']['finite_answer_fields'].items():
            self.assertIn(entry['key'], entry['values'])
            for value in entry['values']:
                self.assertTrue(('value="' + value + '"') in TPL or ('value:"' + value + '"') in TPL)
            self.assertIn(f'{field} === "{entry["key"]}"', TPL)

    def test_bad_cross_field_comparison_never_reappears(self):
        self.assertNotIn('prediction === "in_box"', TPL)
        self.assertNotIn('position === "nearer"', TPL)

    def test_one_logical_send_and_confirm_skip(self):
        self.assertEqual(TPL.count('GenUI.issueNewTurn('), 1)
        self.assertIn('skipped_task_ids: missing', TPL)
        self.assertIn('if (missing.length) setConfirmSkip(true);', TPL)
        self.assertIn('onClick={send}', TPL)
        self.assertIn('Continue lesson', TPL)
        self.assertIn('setIsSending(true)', TPL)
        self.assertIn('answer: JSON.stringify(', TPL)

    def test_five_grade_id_slots(self):
        ids = SPEC['visual_exemplar']['task_ids']
        self.assertEqual(len(ids), SPEC['default_full_lesson']['graded_tasks'])
        for i in ids:
            self.assertIn('"' + i + '"', TPL)

    def test_card_mode_is_shared_state(self):
        self.assertIn('DIL.useState("cards")', TPL)
        self.assertIn('mode === "all" || page === n', TPL)
        self.assertIn('onChange={setMode}', TPL)
        self.assertIn('onClick={()=>setPage(', TPL)
        self.assertIn('firstPrediction', TPL)
        self.assertIn('firstPosition', TPL)
        self.assertIn('setStage(0);setPosition("")', TPL)

    def test_open_answers_do_not_receive_exact_local_verdict(self):
        self.assertIn('Review after Submit', TPL)
        self.assertNotIn('objectName === "ball"', TPL)
        self.assertNotIn('message ===', TPL)

    def test_family_contracts_do_not_require_svg_for_reading(self):
        fams = SPEC['families']
        self.assertFalse(fams['reading_reasoning']['diagram_required'])
        self.assertFalse(fams['communication_mission']['diagram_required'])
        self.assertTrue(fams['listening_lab']['hearing_report_required'])
        self.assertFalse(fams['dialogue_voice']['static_quiz_is_dialogue'])

    def test_single_authority_link_in_main_routers(self):
        for skill in ['asit-teacher', 'asit-lessons', 'asit-exercises']:
            body = (ROOT / f'skills/{skill}/SKILL.md').read_text()
            self.assertIn('ui-contract.md', body)

    def test_manifest_has_consistent_patch_version(self):
        a = json.loads((ROOT/'plugin.json').read_text())
        b = json.loads((ROOT/'.codex-plugin/plugin.json').read_text())
        self.assertEqual(a['version'], SPEC['contract_version'])
        self.assertEqual(a['version'], b['version'])
        self.assertEqual(a['name'], b['name'])

    def test_no_personal_preference_leak_in_normative_rules(self):
        body = (ROOT/'skills/asit-lessons/references/answer-integrity.md').read_text()
        self.assertNotIn('this user\'s explicit request', body)
        self.assertNotIn('User preference (explicit)', body)


if __name__ == '__main__':
    unittest.main()
