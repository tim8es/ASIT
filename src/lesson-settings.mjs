/** Portable lesson preferences. These are defaults, not per-learner facts.
 * The learner can change both settings in their private Learner State.
 */
export const DEFAULT_LESSON_SETTINGS=Object.freeze({
 duration_minutes:7,
 exercises_per_lesson:5
});
export const LESSON_SETTING_LIMITS=Object.freeze({
 min_minutes:3,max_minutes:120,min_exercises:1,max_exercises:20
});
function validInteger(value,min,max,label){
 if(!Number.isInteger(value)||value<min||value>max)
   throw new Error(`${label} must be between ${min} and ${max}`);
 return value;
}
/** Explicit one-session override > private saved preference > defaults.
 * Existing state layouts are accepted without silently writing a migration.
 */
export function resolveLessonSettings({learnerState,minutes=null,exerciseCount=null}={}){
 const profile=learnerState?.profile??{};
 const preferences=profile.preferences??{};
 const stored=learnerState?.adaptive_profile?.lesson_delivery_preference??{};
 const duration=minutes??preferences.lesson_duration_minutes??
   stored.duration_minutes??stored.duration_limit_minutes??
   profile.available_minutes??DEFAULT_LESSON_SETTINGS.duration_minutes;
 const count=exerciseCount??preferences.exercises_per_lesson??
   stored.exercises_per_lesson??stored.exercise_count??
   DEFAULT_LESSON_SETTINGS.exercises_per_lesson;
 return {
   duration_minutes:validInteger(duration,LESSON_SETTING_LIMITS.min_minutes,LESSON_SETTING_LIMITS.max_minutes,'Lesson duration'),
   exercises_per_lesson:validInteger(count,LESSON_SETTING_LIMITS.min_exercises,LESSON_SETTING_LIMITS.max_exercises,'Exercise preference'),
   setting_source:{
     duration:minutes!==null?'session_override':preferences.lesson_duration_minutes!=null||stored.duration_minutes!=null||stored.duration_limit_minutes!=null||profile.available_minutes!=null?'learner_state':'default',
     exercises:exerciseCount!==null?'session_override':preferences.exercises_per_lesson!=null||stored.exercises_per_lesson!=null||stored.exercise_count!=null?'learner_state':'default'
   }
 };
}
/** Time estimate, not a measured timer: reduce count when tasks are demanding. */
export function exerciseCapacityForMinutes(minutes){
 validInteger(minutes,LESSON_SETTING_LIMITS.min_minutes,LESSON_SETTING_LIMITS.max_minutes,'Lesson duration');
 if(minutes<=4)return 2;
 if(minutes===5)return 3;
 if(minutes===6)return 4;
 return Math.min(LESSON_SETTING_LIMITS.max_exercises,Math.max(5,Math.floor(minutes*0.8)));
}
