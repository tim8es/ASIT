"""Stable architecture contracts. Static checks do not prove live UI or Sheets writes."""
import json
import re
from pathlib import Path
import unittest
ROOT=Path(__file__).resolve().parents[1]
def read(p): return (ROOT/p).read_text(encoding='utf-8')

class Compatibility(unittest.TestCase):
 def test_release_identity_and_short_description(self):
  a=json.loads(read('plugin.json')); b=json.loads(read('.codex-plugin/plugin.json'))
  s=json.loads(read('skills/asit-exercises/references/ui-spec.json'))
  self.assertEqual(a['version'],b['version']); self.assertEqual(a['version'],s['contract_version'])
  self.assertEqual(a['extensions']['com.openai']['interface'],b['interface'])
  self.assertLessEqual(len(b['interface']['shortDescription']),30)

 def test_core_and_adapter_are_separate(self):
  core=read('skills/asit-core/SKILL.md'); eng=read('skills/asit-english/SKILL.md')
  self.assertIn('subject-neutral',core); self.assertIn('selection-invariants.md',core)
  self.assertIn('CEFR',eng); self.assertIn('ELLLO',eng)
  self.assertIn('asit-core',read('skills/asit-teacher/SKILL.md'))

 def test_save_gate_is_canonical_and_persistent_errors_are_not_silent(self):
  storage=read('skills/asit-progress/references/storage-v2.md')
  self.assertIn('Block new scored UI',storage)
  self.assertIn('never automatically switched to offline',storage)
  self.assertIn('read back',storage.lower())
  self.assertIn('state_revision',storage)
  for tab in ('Config','Goals','Competencies','Plans','Activities','Attempts','Reviews','Sessions','Events'):
   self.assertRegex(storage,rf'(?m)^{tab}:')
  for p in ('skills/asit-teacher/SKILL.md','skills/asit-statekeeper/SKILL.md','skills/asit-lessons/SKILL.md','skills/asit-assessment/SKILL.md'):
   self.assertIn('storage-v2.md',read(p))

 def test_submit_and_independent_evidence(self):
  ass=read('skills/asit-assessment/SKILL.md')
  self.assertIn('ASIT_ATTEMPT_V2',ass)
  self.assertIn('Grade once',ass)
  self.assertIn('not_assessed',ass)
  evidence=read('skills/asit-progress/references/evidence-compatibility.md')
  self.assertIn('supported',evidence)
  self.assertIn('independent',evidence)
  self.assertIn('unverified',evidence)

 def test_appropriate_ui_not_everything_visual(self):
  entry=read('skills/asit-teacher/SKILL.md')
  self.assertIn('quick correction',entry.lower())
  self.assertNotIn('complete-native-lesson.md',entry)
  exercise=read('skills/asit-exercises/SKILL.md')
  self.assertIn('only for matching',exercise)
  ui=read('skills/asit-exercises/references/ui-contract.md')
  self.assertIn('Incorrect — Try again',ui)
  self.assertIn('Cards',ui)
  self.assertIn('GenUI.issueNewTurn',ui)

 def test_media_and_patterns(self):
  fam=read('skills/asit-exercises/references/ui-families.md')
  for n in ('visual_discovery','communication_mission','reading_reasoning','listening_lab','focused_drill','dialogue_voice'):
   self.assertIn(n,fam)
  reg=read('skills/asit-exercises/references/pattern-registry.md')
  self.assertEqual(len(re.findall(r'^\\| \\x60([a-z_]+)\\x60 \\|',reg,flags=re.M)),18)
  media=read('skills/asit-media/SKILL.md')
  self.assertIn('ELLLO',media);self.assertIn('Sound Grammar',media)

 def test_local_skill_links_are_resolvable(self):
  for p in (ROOT/'skills').rglob('*.md'):
   for link in re.findall(r'\\[[^\\]]*\\]\\(([^)]+)\\)',p.read_text(encoding='utf-8')):
    dest=link.split('#',1)[0]
    if not dest or '://' in dest or dest.startswith(('mailto:','#')):continue
    self.assertTrue((p.parent/dest).is_file(),f'{p} -> {dest}')
if __name__=='__main__':unittest.main()
