# Learner-visible lesson counter — ASIT v0.1

## What counts

A **full lesson** is a planned multi-item packet with a trusted Activity type `five_part_lesson`, `five_part_integrated_lesson` or `composite_lesson`, at least two `rubric_json.items`, a matching assessed Attempt and an ended Session. Count the finished Session once, even with multiple attempts.

Diagnostic tasks, short retries, unsubmitted or interrupted sessions and superseded activities **do not count**. Exercises completed and competency progress are separate measures.

## Display rule

Use `summarizeLessonProgress({sessions,activities,attempts})` with a bounded authorized **private** tracker read. Return `completed_full_lessons`, `next_full_lesson_number`, and `pending_full_lessons`. Never parse a suffix from `lesson_id`, `activity_id`, or `session_id` to display a learner-facing lesson number. If older history or rubrics are incomplete, say **confirmed completed lessons** and acknowledge that the count could be incomplete; do not invent past completion.

## Next lesson

Show the primary can-do target, whether this is new material, review or transfer, and a short evidence-based reason. After two full lessons on one narrow error, choose another eligible competence plus delayed review unless the learner explicitly asks for more. Prioritize required prerequisites; this is a heuristic rather than a validated optimal teaching algorithm.

## Data boundary

Private learner replies, file IDs, history and scores stay in learner-owned storage, not GitHub, issues, CI logs or tests. Use only synthetic fixtures in this repository.
