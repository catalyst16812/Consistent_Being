// Comprehensive Exercise Database with biomechanical classifications,
// training focus (heavy vs high reps), execution form cues, and equipment mappings.

export const EXERCISE_DATABASE = [
  // ===================== CHEST =====================
  {
    name: 'Flat Barbell Bench Press',
    family: 'chest_horizontal_press',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Chest (Mid/Lower)'],
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    focus: 'Focus on heavy progressive overload (5–8 reps)',
    tips: [
      'Retract and depress shoulder blades firmly into the bench.',
      'Maintain a slight natural arch in the lower back and plant feet flat.',
      'Lower the bar with controlled tempo to the lower chest/sternum (~45° elbow tuck).',
      'Drive feet into the floor and press up without flaring elbows out excessively.'
    ],
    description: 'The premier compound barbell movement for upper-body pushing power and pectoral hypertrophy.'
  },
  {
    name: 'Flat Dumbbell Press',
    family: 'chest_horizontal_press',
    type: 'compound',
    equipment: 'Dumbbell',
    primaryMuscles: ['Chest (Mid/Lower)'],
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    focus: 'Focus on deep stretch and heavy/moderate working sets (6–10 reps)',
    tips: [
      'Allows a greater active range of motion and converges at the top for peak contraction.',
      'Keep wrists stacked directly over elbows throughout the descent.',
      'Avoid clashing dumbbells at the top to maintain constant tension.'
    ],
    description: 'Great for balanced unilateral chest development and shoulder-friendly pressing.'
  },
  {
    name: 'Incline Barbell Bench Press',
    family: 'chest_incline_press',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Clavicular Chest (Upper)'],
    secondaryMuscles: ['Anterior Deltoids', 'Triceps'],
    focus: 'Focus on heavy progressive overload (6–8 reps)',
    tips: [
      'Set bench angle to 30°–45° for optimal upper chest recruitment.',
      'Lower the bar smoothly to the collarbone/upper chest line.',
      'Do not let hips lift off the bench.'
    ],
    description: 'Builds upper chest shelf and overhead pressing transfer.'
  },
  {
    name: 'Incline Dumbbell Press',
    family: 'chest_incline_press',
    type: 'compound',
    equipment: 'Dumbbell',
    primaryMuscles: ['Clavicular Chest (Upper)'],
    secondaryMuscles: ['Anterior Deltoids', 'Triceps'],
    focus: 'Focus on moderate weight with deep stretch at the bottom (8–12 reps)',
    tips: [
      'Keep shoulder blades pinned back throughout.',
      'Squeeze upper chest at top without locking elbows violently.',
      'Maintain 30° bench inclination.'
    ],
    description: 'Hypertrophy staple for filling out upper pectoral thickness.'
  },
  {
    name: 'Machine Chest Press',
    family: 'chest_horizontal_press',
    type: 'compound',
    equipment: 'Machine',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    focus: 'Focus on controlled eccentric and maximum hypertrophy fatigue (8–12 reps)',
    tips: [
      'Adjust seat height so handles align with mid-chest.',
      'Keep back flat against the pad and drive through the palms.',
      'Safe for training to absolute muscular failure without a spotter.'
    ],
    description: 'Stable pressing path ideal for targeting chest fibers with minimal stabilizer fatigue.'
  },
  {
    name: 'Incline Machine Press',
    family: 'chest_incline_press',
    type: 'compound',
    equipment: 'Machine',
    primaryMuscles: ['Upper Chest'],
    secondaryMuscles: ['Anterior Deltoids', 'Triceps'],
    focus: 'Focus on sustained tension (8–12 reps)',
    tips: [
      'Line handles up with upper chest.',
      'Control the eccentric phase for 2–3 seconds.'
    ],
    description: 'Targeted upper chest stimulus with fixed biomechanical path.'
  },
  {
    name: 'Dips (Chest Focus)',
    family: 'chest_dips_pushups',
    type: 'compound',
    equipment: 'Bodyweight',
    primaryMuscles: ['Lower Chest', 'Triceps'],
    secondaryMuscles: ['Anterior Deltoids'],
    focus: 'Focus on bodyweight mastery or weighted overload (6–10 reps)',
    tips: [
      'Lean torso forward ~30° with elbows slightly flared to shift tension from triceps to chest.',
      'Lower until upper arms are parallel to floor; do not overstretch anterior shoulder joint.'
    ],
    description: 'Classic compound movement for lower pec mass and pushing power.'
  },
  {
    name: 'Push-Up',
    family: 'chest_dips_pushups',
    type: 'compound',
    equipment: 'Bodyweight',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Core', 'Anterior Deltoids'],
    focus: 'Focus on high reps, cadence, and full depth (12–25 reps)',
    tips: [
      'Maintain a rigid plank from head to heels with glutes braced.',
      'Tuck elbows ~45° and touch chest to floor on every repetition.'
    ],
    description: 'Foundational bodyweight horizontal push.'
  },
  {
    name: 'Cable Chest Flye',
    family: 'chest_flyes',
    type: 'isolation',
    equipment: 'Cable',
    primaryMuscles: ['Chest (Pectoralis Major)'],
    secondaryMuscles: ['Anterior Deltoids'],
    focus: 'Focus on high reps, continuous tension, and peak contraction (10–15 reps)',
    tips: [
      'Keep a slight bend in the elbows that remains static throughout.',
      'Think of hugging a wide tree trunk on the concentric phase.',
      'Squeeze pecs for 1 second at the peak.'
    ],
    description: 'Isolates chest adduction with constant cable tension through full range of motion.'
  },
  {
    name: 'Pec Deck Machine',
    family: 'chest_flyes',
    type: 'isolation',
    equipment: 'Machine',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Anterior Deltoids'],
    focus: 'Focus on high reps and mind-muscle pump (12–15 reps)',
    tips: [
      'Set seat so arms are parallel with chest.',
      'Push pads together with inner chest contraction.'
    ],
    description: 'Locked-in isolation for chest pump and adduction.'
  },

  // ===================== BACK =====================
  {
    name: 'Barbell Deadlift',
    family: 'posterior_hinge_heavy',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Posterior Chain (Hamstrings, Glutes, Erector Spinae)'],
    secondaryMuscles: ['Lats', 'Upper Back', 'Traps', 'Forearms', 'Core'],
    focus: 'Focus on heavy progressive overload with strict form (4–6 reps)',
    tips: [
      'Set feet hip-width apart with bar over midfoot.',
      'Hinge hips, grip bar firmly, pull slack out of the bar, and wedge hips into position.',
      'Push the floor away through midfoot and lock out with glutes without hyperextending lower back.',
      'Reset on floor between reps — avoid uncontrolled touch-and-go.'
    ],
    description: 'The king of posterior chain strength and full-body structural density.'
  },
  {
    name: 'Trap Bar Deadlift',
    family: 'posterior_hinge_heavy',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Lower Back'],
    secondaryMuscles: ['Traps', 'Forearms'],
    focus: 'Focus on heavy weight with neutral spine (5–8 reps)',
    tips: [
      'Neutral grip places less shear stress on lumbar spine and shoulders.',
      'Squat-hinge hybrid: drive through the floor.'
    ],
    description: 'Back-friendly, high-force deadlift alternative.'
  },
  {
    name: 'Sumo Deadlift',
    family: 'posterior_hinge_heavy',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Glutes', 'Adductors', 'Hamstrings'],
    secondaryMuscles: ['Quads', 'Erector Spinae', 'Traps'],
    focus: 'Focus on technical execution and heavy loads (4–6 reps)',
    tips: [
      'Wide stance with toes pointed out.',
      'Keep hips open, knees tracking over toes, and chest upright.'
    ],
    description: 'Shorter range of motion with heavier emphasis on hips and adductors.'
  },
  {
    name: 'Barbell Bent-Over Row',
    family: 'back_horizontal_row',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Middle Traps'],
    secondaryMuscles: ['Biceps', 'Rear Deltoids', 'Lower Back'],
    focus: 'Focus on heavy working weight with controlled torso (6–10 reps)',
    tips: [
      'Hinge forward at roughly 45° with flat back and knees slightly bent.',
      'Pull bar toward lower ribcage/belly button by driving elbows back.',
      'Avoid excessive body English or swinging torso upward.'
    ],
    description: 'Builds back thickness, spinal erector endurance, and pulling power.'
  },
  {
    name: 'Pendlay Row',
    family: 'back_horizontal_row',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Upper Back', 'Lats', 'Rhomboids'],
    secondaryMuscles: ['Rear Deltoids', 'Biceps'],
    focus: 'Focus on explosive concentric power from dead stop (5–8 reps)',
    tips: [
      'Torso parallel to floor on every rep.',
      'Bar returns to the floor between each rep for a dead stop.'
    ],
    description: 'Strict power-rowing movement that eliminates momentum.'
  },
  {
    name: 'Chest-Supported Row',
    family: 'back_horizontal_row',
    type: 'compound',
    equipment: 'Machine',
    primaryMuscles: ['Mid Back', 'Rhomboids', 'Lats'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    focus: 'Focus on maximum back isolation without lower back fatigue (8–12 reps)',
    tips: [
      'Pad supports the sternum completely eliminating lumbar strain.',
      'Retract scapulae fully at top and get a full stretch at bottom.'
    ],
    description: 'Pure upper-back hypertrophy tool safe for lifters with lower back fatigue.'
  },
  {
    name: 'Dumbbell Row',
    family: 'back_horizontal_row',
    type: 'compound',
    equipment: 'Dumbbell',
    primaryMuscles: ['Lats', 'Mid Back'],
    secondaryMuscles: ['Biceps', 'Forearms'],
    focus: 'Focus on heavy weight with full stretch and squeeze (8–12 reps)',
    tips: [
      'Support knee and hand on flat bench.',
      'Pull dumbbell in an arc toward hip pocket rather than straight up.'
    ],
    description: 'Unilateral rowing staple for lat width and grip strength.'
  },
  {
    name: 'Seated Cable Row',
    family: 'back_horizontal_row',
    type: 'compound',
    equipment: 'Cable',
    primaryMuscles: ['Mid Back', 'Lats', 'Rhomboids'],
    secondaryMuscles: ['Biceps', 'Erector Spinae'],
    focus: 'Focus on controlled eccentric and strong scapular squeeze (8–12 reps)',
    tips: [
      'Sit tall with knees slightly bent.',
      'Pull handle to lower ribs while driving elbows back and squeezing shoulder blades together.'
    ],
    description: 'Consistent cable resistance for upper and mid-back density.'
  },
  {
    name: 'Lat Pulldown',
    family: 'back_vertical_pull',
    type: 'compound',
    equipment: 'Cable',
    primaryMuscles: ['Latissimus Dorsi'],
    secondaryMuscles: ['Biceps', 'Brachialis', 'Lower Traps'],
    focus: 'Focus on progressive overload with clean form (8–12 reps)',
    tips: [
      'Grip slightly wider than shoulder width.',
      'Lean back very slightly (10°–15°) and drive elbows down toward hip pockets.',
      'Touch bar to upper chest; do not pull behind neck.'
    ],
    description: 'Prime movement for developing lat width and the V-taper silhouette.'
  },
  {
    name: 'Pull-Up',
    family: 'back_vertical_pull',
    type: 'compound',
    equipment: 'Bodyweight',
    primaryMuscles: ['Latissimus Dorsi', 'Upper Back'],
    secondaryMuscles: ['Biceps', 'Core', 'Forearms'],
    focus: 'Focus on bodyweight strength or weighted progression (5–10 reps)',
    tips: [
      'Full dead-hang stretch at bottom, pull until chin clears the bar.',
      'Avoid kipping or swinging legs.'
    ],
    description: 'Gold standard vertical pulling movement for upper-body relative strength.'
  },
  {
    name: 'Chin-Up',
    family: 'back_vertical_pull',
    type: 'compound',
    equipment: 'Bodyweight',
    primaryMuscles: ['Lats', 'Biceps'],
    secondaryMuscles: ['Chest', 'Forearms'],
    focus: 'Focus on full range of motion (6–10 reps)',
    tips: [
      'Supinated (underhand) grip brings biceps into stronger leverage.',
      'Squeeze back and arms at the top.'
    ],
    description: 'Vertical pull prioritizing biceps and lower lat engagement.'
  },
  {
    name: 'Assisted Pull-Up',
    family: 'back_vertical_pull',
    type: 'compound',
    equipment: 'Machine',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Biceps', 'Upper Back'],
    focus: 'Focus on high volume and learning the pull-up motor pattern (8–12 reps)',
    tips: [
      'Use counterweight to achieve full range without compensation.'
    ],
    description: 'Excellent regression tool for building up to free pull-ups.'
  },
  {
    name: 'Face Pull',
    family: 'rear_delts_upper_back',
    type: 'isolation',
    equipment: 'Cable',
    primaryMuscles: ['Rear Deltoids', 'Rotator Cuff (Infraspinatus, Teres Minor)'],
    secondaryMuscles: ['Rhomboids', 'Mid/Upper Traps'],
    focus: 'Focus on high reps, external rotation, and posture (12–15 reps)',
    tips: [
      'Set cable at eye level with rope attachment.',
      'Pull rope towards face while actively externally rotating hands back like a double bicep pose.',
      'Hold the contraction for 1 second on every rep.'
    ],
    description: 'Crucial longevity exercise for shoulder health, external rotation, and rear delt hypertrophy.'
  },
  {
    name: 'Straight-Arm Lat Pulldown',
    family: 'back_pullovers',
    type: 'isolation',
    equipment: 'Cable',
    primaryMuscles: ['Latissimus Dorsi'],
    secondaryMuscles: ['Triceps (Long Head)', 'Core'],
    focus: 'Focus on high reps and deep lat stretch (12–15 reps)',
    tips: [
      'Slight forward lean at hips with arms straight (slight elbow unlock).',
      'Sweep bar down toward thighs in an arc purely using lats.'
    ],
    description: 'Isolates lats without bicep involvement.'
  },

  // ===================== SHOULDERS =====================
  {
    name: 'Overhead Press',
    family: 'shoulders_overhead_press',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Anterior Deltoids', 'Lateral Deltoids'],
    secondaryMuscles: ['Triceps', 'Upper Traps', 'Core'],
    focus: 'Focus on heavy progressive overload (5–8 reps)',
    tips: [
      'Stand with feet shoulder-width, squeeze glutes and brace core.',
      'Start with bar resting on front deltoids, tuck chin slightly, and press directly overhead.',
      'Lock out with head pushing forward through the window of the arms.'
    ],
    description: 'The ultimate test and builder of vertical pressing strength and broad shoulders.'
  },
  {
    name: 'Machine Shoulder Press',
    family: 'shoulders_overhead_press',
    type: 'compound',
    equipment: 'Machine',
    primaryMuscles: ['Anterior Deltoids'],
    secondaryMuscles: ['Lateral Deltoids', 'Triceps'],
    focus: 'Focus on controlled cadence and hypertrophy fatigue (8–12 reps)',
    tips: [
      'Seat height adjusted so handles start around ear level.',
      'Keep back firmly pressed into pad and press upward smoothly.'
    ],
    description: 'Safe, stable overhead pressing without core balance limitations.'
  },
  {
    name: 'Seated Dumbbell Shoulder Press',
    family: 'shoulders_overhead_press',
    type: 'compound',
    equipment: 'Dumbbell',
    primaryMuscles: ['Anterior & Lateral Deltoids'],
    secondaryMuscles: ['Triceps'],
    focus: 'Focus on moderate weight with full overhead lockout (8–12 reps)',
    tips: [
      'Set bench to 80°–85° incline.',
      'Lower dumbbells until upper arms are parallel or slightly below.',
      'Press up smoothly without clinking dumbbells.'
    ],
    description: 'Allows natural wrist rotation and unilateral shoulder balance.'
  },
  {
    name: 'Arnold Press',
    family: 'shoulders_overhead_press',
    type: 'compound',
    equipment: 'Dumbbell',
    primaryMuscles: ['Anterior & Lateral Deltoids'],
    secondaryMuscles: ['Triceps'],
    focus: 'Focus on smooth rotation and moderate reps (8–12 reps)',
    tips: [
      'Start with palms facing chest, rotate outwards as you press overhead.'
    ],
    description: 'Increases anterior deltoid time under tension with rotational loading.'
  },
  {
    name: 'Dumbbell Lateral Raise',
    family: 'shoulders_lateral_raise',
    type: 'isolation',
    equipment: 'Dumbbell',
    primaryMuscles: ['Lateral Deltoids (Side Delts)'],
    secondaryMuscles: ['Upper Traps'],
    focus: 'Focus on high reps, strict form, and no swinging (12–15 reps)',
    tips: [
      'Lean slightly forward (~10°).',
      'Lead with elbows, raising arms in the scapular plane (slightly in front of the body).',
      'Do not shrug shoulders up into neck.'
    ],
    description: 'Essential isolation movement for creating shoulder width and the capped deltoid look.'
  },
  {
    name: 'Cable Lateral Raise',
    family: 'shoulders_lateral_raise',
    type: 'isolation',
    equipment: 'Cable',
    primaryMuscles: ['Lateral Deltoids'],
    secondaryMuscles: ['Upper Traps'],
    focus: 'Focus on constant tension and peak stretch (12–15 reps)',
    tips: [
      'Set pulley to wrist or hip height.',
      'Provides peak tension at the bottom of the movement where dumbbells offer zero tension.'
    ],
    description: 'Superior resistance curve for side delts compared to dumbbells.'
  },
  {
    name: 'Rear Delt Flye (Dumbbell)',
    family: 'rear_delts_upper_back',
    type: 'isolation',
    equipment: 'Dumbbell',
    primaryMuscles: ['Rear Deltoids'],
    secondaryMuscles: ['Rhomboids'],
    focus: 'Focus on high reps and mind-muscle squeeze (12–15 reps)',
    tips: [
      'Bend forward with torso parallel to floor.',
      'Raise arms wide leading with pinkies without pinching shoulder blades together too early.'
    ],
    description: 'Isolates the posterior head of the deltoid for 3D shoulder roundness.'
  },

  // ===================== LEGS (QUADS & GLUTES) =====================
  {
    name: 'Barbell Squat',
    family: 'legs_squat_heavy',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Core', 'Adductors', 'Calves'],
    focus: 'Focus on heavy progressive overload with depth (5–8 reps)',
    tips: [
      'Bar positioned securely across upper traps (high bar) or rear delts (low bar).',
      'Take a deep belly breath, brace core 360°, and sit down between hips.',
      'Descend until thighs are at least parallel to floor.',
      'Drive up through whole foot, keeping chest proud and knees tracking over toes.'
    ],
    description: 'The premier lower-body compound lift for quad mass, hip power, and systemic strength.'
  },
  {
    name: 'Front Squat',
    family: 'legs_squat_heavy',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Quadriceps'],
    secondaryMuscles: ['Upper Back', 'Core', 'Glutes'],
    focus: 'Focus on upright posture and quad depth (6–10 reps)',
    tips: [
      'Rack bar across anterior deltoids with high elbows.',
      'Forces a strictly upright torso, heavily targeting the quads and thoracic extensors.'
    ],
    description: 'Quad-dominant squat variation with minimal lumbar shearing.'
  },
  {
    name: 'Leg Press',
    family: 'legs_squat_heavy',
    type: 'compound',
    equipment: 'Machine',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Hamstrings'],
    focus: 'Focus on heavy loads and deep knee flexion (10–12 reps)',
    tips: [
      'Keep lower back and glutes pinned to the seat; do not let hips lift or tuck under (butt wink).',
      'Lower sled under control until knees are near chest, then press without violently locking out knees.'
    ],
    description: 'High-load quad builder without spinal loading.'
  },
  {
    name: 'Hack Squat',
    family: 'legs_squat_heavy',
    type: 'compound',
    equipment: 'Machine',
    primaryMuscles: ['Quadriceps (Vastus Lateralis/Medialis)'],
    secondaryMuscles: ['Glutes'],
    focus: 'Focus on deep knee flexion and quad stretch (8–12 reps)',
    tips: [
      'Place feet lower on platform for maximal quad stretch.',
      'Control the descent for 3 seconds.'
    ],
    description: 'Pure quad hypertrophy tool with locked spine protection.'
  },
  {
    name: 'Goblet Squat',
    family: 'legs_squat_heavy',
    type: 'compound',
    equipment: 'Dumbbell',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Core'],
    focus: 'Focus on perfect depth and mobility (10–12 reps)',
    tips: [
      'Hold dumbbell or kettlebell vertically against chest.',
      'Pry knees open with elbows at bottom of squat.'
    ],
    description: 'Great for warm-ups, knee health, and beginners mastering squat mechanics.'
  },
  {
    name: 'Bulgarian Split Squat',
    family: 'legs_unilateral',
    type: 'compound',
    equipment: 'Dumbbell',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Adductors'],
    focus: 'Focus on unilateral balance and deep hip stretch (8–12 reps)',
    tips: [
      'Elevate rear foot on bench behind you.',
      'Descend straight down until back knee hovers just above the floor.',
      'Slight forward lean places more emphasis on glutes, upright emphasizes quads.'
    ],
    description: 'Brutal unilateral exercise fixing strength imbalances and building functional legs.'
  },
  {
    name: 'Walking Lunge',
    family: 'legs_unilateral',
    type: 'compound',
    equipment: 'Dumbbell',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Calves'],
    focus: 'Focus on continuous steps and hip stability (10–12 reps per leg)',
    tips: [
      'Take long steps to target glutes, shorter steps for quads.'
    ],
    description: 'Dynamic lower-body movement building athletic stride strength.'
  },
  {
    name: 'Leg Extension',
    family: 'legs_quad_isolation',
    type: 'isolation',
    equipment: 'Machine',
    primaryMuscles: ['Quadriceps (Rectus Femoris)'],
    secondaryMuscles: [],
    focus: 'Focus on high reps, terminal knee extension, and pause at top (12–15 reps)',
    tips: [
      'Align machine pivot point with knee joint.',
      'Pause for 1 second at full extension to squeeze the rectus femoris.'
    ],
    description: 'The only exercise that isolates the rectus femoris quad head in shortened position.'
  },

  // ===================== POSTERIOR CHAIN (HAMSTRINGS & GLUTES) =====================
  {
    name: 'Romanian Deadlift',
    family: 'legs_hinge_rdl',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Hamstrings', 'Gluteus Maximus'],
    secondaryMuscles: ['Erector Spinae', 'Lats', 'Forearms'],
    focus: 'Focus on heavy/moderate weight with intense hamstring stretch (8–10 reps)',
    tips: [
      'Slight soft bend in knees, kept static throughout the movement.',
      'Push hips backward as far as possible like closing a car door with your glutes.',
      'Lower bar along thighs until you feel a deep hamstring stretch, then drive hips forward to lockout.'
    ],
    description: 'The premier stretch-mediated hypertrophy builder for hamstrings and glutes.'
  },
  {
    name: 'Dumbbell Romanian Deadlift',
    family: 'legs_hinge_rdl',
    type: 'compound',
    equipment: 'Dumbbell',
    primaryMuscles: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Lower Back'],
    focus: 'Focus on deep stretch and hip hinge tracking (8–12 reps)',
    tips: [
      'Keep dumbbells skimming alongside thighs and shins.',
      'Allows hands to rest in a more natural neutral grip.'
    ],
    description: 'Comfortable hinge movement allowing custom wrist angles.'
  },
  {
    name: 'Lying Leg Curl',
    family: 'legs_hamstring_curl',
    type: 'isolation',
    equipment: 'Machine',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Calves'],
    focus: 'Focus on high reps and controlled negative (10–15 reps)',
    tips: [
      'Keep hips pushed down into the bench to prevent lumbar arching.',
      'Curl heel all the way to glutes, hold for a beat, and lower for 3 seconds.'
    ],
    description: 'Direct knee-flexion isolation for the hamstring muscle group.'
  },
  {
    name: 'Seated Leg Curl',
    family: 'legs_hamstring_curl',
    type: 'isolation',
    equipment: 'Machine',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Calves'],
    focus: 'Focus on stretch-mediated knee flexion (10–15 reps)',
    tips: [
      'Seated position places the hip in flexion, putting the hamstrings under greater resting stretch for superior hypertrophy.'
    ],
    description: 'Scientifically proven optimal machine for hamstring hypertrophy.'
  },
  {
    name: 'Hip Thrust',
    family: 'legs_glute_bridge',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductors'],
    focus: 'Focus on heavy loads with lockout pause (8–12 reps)',
    tips: [
      'Back supported against bench at shoulder blade level, pad across hips.',
      'Drive through heels to full hip extension, tucking chin and posterior pelvic tilt at the top.'
    ],
    description: 'Unmatched peak contraction overload for the gluteal muscles.'
  },

  // ===================== ARMS (BICEPS & TRICEPS) =====================
  {
    name: 'Barbell Curl',
    family: 'arms_biceps_heavy',
    type: 'isolation',
    equipment: 'Barbell',
    primaryMuscles: ['Biceps Brachii'],
    secondaryMuscles: ['Brachialis', 'Forearms'],
    focus: 'Focus on strict overload and full range (8–10 reps)',
    tips: [
      'Pin elbows to sides.',
      'Do not lean back or swing hips to initiate the curl.',
      'Lower slowly under control.'
    ],
    description: 'Heavy mass builder for the front of the arms.'
  },
  {
    name: 'Dumbbell Curl',
    family: 'arms_biceps_heavy',
    type: 'isolation',
    equipment: 'Dumbbell',
    primaryMuscles: ['Biceps Brachii'],
    secondaryMuscles: ['Forearms'],
    focus: 'Focus on supination and peak contraction (10–12 reps)',
    tips: [
      'Rotate wrist outward (supinate) at the top so pinky is higher than thumb.',
      'Keep elbows static.'
    ],
    description: 'Allows natural supination for complete bicep recruitment.'
  },
  {
    name: 'Incline Dumbbell Curl',
    family: 'arms_biceps_stretch',
    type: 'isolation',
    equipment: 'Dumbbell',
    primaryMuscles: ['Biceps (Long Head)'],
    secondaryMuscles: ['Forearms'],
    focus: 'Focus on deep long-head bicep stretch (10–12 reps)',
    tips: [
      'Set bench to 45°–60° incline.',
      'Arms hang behind torso providing unmatched stretch on the long head of the bicep.'
    ],
    description: 'Key exercise for building the bicep peak via stretch.'
  },
  {
    name: 'Preacher Curl',
    family: 'arms_biceps_preacher',
    type: 'isolation',
    equipment: 'Barbell',
    primaryMuscles: ['Biceps (Short Head)'],
    secondaryMuscles: ['Brachialis'],
    focus: 'Focus on strict contraction without momentum (10–12 reps)',
    tips: [
      'Upper arms rest flush against angled pad.',
      'Prevents any shoulder or body sway.'
    ],
    description: 'Strict bicep short-head mass builder.'
  },
  {
    name: 'Hammer Curl',
    family: 'arms_biceps_hammer',
    type: 'isolation',
    equipment: 'Dumbbell',
    primaryMuscles: ['Brachialis', 'Brachioradialis'],
    secondaryMuscles: ['Biceps'],
    focus: 'Focus on heavy weight with neutral grip (10–12 reps)',
    tips: [
      'Maintain neutral palms-facing-in grip throughout.',
      'Develops the brachialis which pushes the bicep up, increasing arm thickness.'
    ],
    description: 'Builds arm thickness and forearm grip strength.'
  },
  {
    name: 'Cable Hammer Curl',
    family: 'arms_biceps_hammer',
    type: 'isolation',
    equipment: 'Cable',
    primaryMuscles: ['Brachialis', 'Forearms'],
    secondaryMuscles: ['Biceps'],
    focus: 'Focus on continuous tension with rope (10–12 reps)',
    tips: [
      'Use rope attachment and pull handles upward with neutral wrists.'
    ],
    description: 'Consistent cable resistance for brachialis and forearm development.'
  },
  {
    name: 'Cable Triceps Pushdown',
    family: 'arms_triceps_pushdown',
    type: 'isolation',
    equipment: 'Cable',
    primaryMuscles: ['Triceps (Lateral and Medial Heads)'],
    secondaryMuscles: [],
    focus: 'Focus on high reps and full elbow lockout (10–12 reps)',
    tips: [
      'Elbows pinned to ribs.',
      'Push attachment down until arms are fully straight; squeeze triceps hard for 1 second.'
    ],
    description: 'Foundational tricep movement for outer arm definition.'
  },
  {
    name: 'Rope Overhead Triceps Extension',
    family: 'arms_triceps_overhead',
    type: 'isolation',
    equipment: 'Cable',
    primaryMuscles: ['Triceps (Long Head)'],
    secondaryMuscles: [],
    focus: 'Focus on deep long-head stretch (10–12 reps)',
    tips: [
      'Overhead arm position places the triceps long head into maximum stretch.',
      'Flourish rope apart at lockout.'
    ],
    description: 'Essential for developing the largest portion of the triceps muscle.'
  },
  {
    name: 'Skull Crusher',
    family: 'arms_triceps_overhead',
    type: 'isolation',
    equipment: 'Barbell',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: [],
    focus: 'Focus on controlled lowering to crown of head (8–12 reps)',
    tips: [
      'Lower bar to top of forehead or slightly behind head for greater stretch.',
      'Keep elbows tucked, do not let them flare wide.'
    ],
    description: 'Classic barbell mass builder for the triceps.'
  },
  {
    name: 'Close-Grip Bench Press',
    family: 'chest_horizontal_press',
    type: 'compound',
    equipment: 'Barbell',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Chest', 'Anterior Deltoids'],
    focus: 'Focus on heavy progressive overload (6–8 reps)',
    tips: [
      'Grip shoulder-width apart (not excessively narrow to protect wrists).',
      'Keep elbows tucked close to sides.'
    ],
    description: 'Heavy compound exercise for overloading the triceps with maximum weight.'
  },

  // ===================== CALVES & ABS =====================
  {
    name: 'Standing Calf Raise',
    family: 'calves_standing',
    type: 'isolation',
    equipment: 'Machine',
    primaryMuscles: ['Gastrocnemius'],
    secondaryMuscles: ['Soleus'],
    focus: 'Focus on full pause at deep stretch and peak extension (12–15 reps)',
    tips: [
      'Straight knees engage the gastrocnemius.',
      'Pause for 2 full seconds at the bottom stretch to eliminate Achilles tendon spring reflex.'
    ],
    description: 'Builds calf diamond shape and vertical ankle power.'
  },
  {
    name: 'Seated Calf Raise',
    family: 'calves_seated',
    type: 'isolation',
    equipment: 'Machine',
    primaryMuscles: ['Soleus'],
    secondaryMuscles: [],
    focus: 'Focus on high reps and deep stretch (12–15 reps)',
    tips: [
      'Bent knees take the gastrocnemius off tension, putting soleus in direct isolation.',
      'Full stretch at the bottom.'
    ],
    description: 'Builds lower calf width and ankle stability.'
  },
  {
    name: 'Hanging Leg Raise',
    family: 'abs_core',
    type: 'isolation',
    equipment: 'Bodyweight',
    primaryMuscles: ['Rectus Abdominis (Lower)'],
    secondaryMuscles: ['Hip Flexors', 'Grip'],
    focus: 'Focus on posterior pelvic curl without swinging (10–15 reps)',
    tips: [
      'Curl pelvis upward toward ribcage rather than just swinging legs.',
      'Control the lowering phase.'
    ],
    description: 'Gold standard bodyweight core flexion movement.'
  },
  {
    name: 'Cable Woodchopper',
    family: 'abs_core',
    type: 'isolation',
    equipment: 'Cable',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Transverse Abdominis'],
    focus: 'Focus on rotational control (12–15 reps)',
    tips: [
      'Rotate through torso while keeping hips stable.'
    ],
    description: 'Rotational core power and oblique definition.'
  },
  {
    name: 'Plank',
    family: 'abs_core',
    type: 'isolation',
    equipment: 'Bodyweight',
    primaryMuscles: ['Core & Transverse Abdominis'],
    secondaryMuscles: ['Shoulders', 'Glutes'],
    focus: 'Focus on high tension hold (45–60 seconds)',
    tips: [
      'Squeeze glutes and abs tight, maintaining flat neutral spine.'
    ],
    description: 'Foundational isometric anti-extension core stability.'
  }
];

// Popular Preset Training Splits
export const PRESET_SPLITS = {
  'preset-pplul': {
    id: 'preset-pplul',
    name: '5-Day Push / Pull / Legs / Upper / Lower',
    short: '5-Day PPLUL',
    daysCount: 5,
    description: 'High-frequency balanced split for hypertrophy and progressive overload.',
    days: [
      {
        key: 'push',
        day: 1,
        label: 'Day 1 - Push',
        short: 'Push',
        focus: 'Chest · Shoulders · Triceps',
        exercises: [
          { name: 'Flat Barbell Bench Press', targetReps: '6-8', sets: 4 },
          { name: 'Machine Shoulder Press', targetReps: '8-10', sets: 3 },
          { name: 'Incline Dumbbell Press', targetReps: '8-12', sets: 3 },
          { name: 'Cable Triceps Pushdown', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'pull',
        day: 2,
        label: 'Day 2 - Pull',
        short: 'Pull',
        focus: 'Back · Biceps',
        exercises: [
          { name: 'Barbell Bent-Over Row', targetReps: '6-10', sets: 4 },
          { name: 'Lat Pulldown', targetReps: '8-12', sets: 3 },
          { name: 'Face Pull', targetReps: '12-15', sets: 3 },
          { name: 'Barbell Curl', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'legs',
        day: 3,
        label: 'Day 3 - Legs',
        short: 'Legs',
        focus: 'Quads · Hamstrings · Calves',
        exercises: [
          { name: 'Barbell Squat', targetReps: '5-8', sets: 4 },
          { name: 'Leg Press', targetReps: '10-12', sets: 3 },
          { name: 'Romanian Deadlift', targetReps: '8-10', sets: 3 },
          { name: 'Standing Calf Raise', targetReps: '12-15', sets: 3 },
        ],
      },
      {
        key: 'upper',
        day: 4,
        label: 'Day 4 - Upper',
        short: 'Upper',
        focus: 'Full upper body',
        exercises: [
          { name: 'Overhead Press', targetReps: '6-10', sets: 4 },
          { name: 'Seated Cable Row', targetReps: '8-12', sets: 3 },
          { name: 'Dumbbell Lateral Raise', targetReps: '12-15', sets: 3 },
          { name: 'Hammer Curl', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'lower',
        day: 5,
        label: 'Day 5 - Lower',
        short: 'Lower',
        focus: 'Posterior chain · Calves',
        exercises: [
          { name: 'Barbell Deadlift', targetReps: '4-6', sets: 3 },
          { name: 'Front Squat', targetReps: '6-10', sets: 3 },
          { name: 'Lying Leg Curl', targetReps: '10-15', sets: 3 },
          { name: 'Seated Calf Raise', targetReps: '12-15', sets: 3 },
        ],
      },
    ],
  },
  'preset-upper-lower': {
    id: 'preset-upper-lower',
    name: '4-Day Upper / Lower Split',
    short: '4-Day Upper/Lower',
    daysCount: 4,
    description: '2 Upper and 2 Lower sessions per week. Ideal balance of recovery and frequency.',
    days: [
      {
        key: 'upper-a',
        day: 1,
        label: 'Day 1 - Upper A',
        short: 'Upper A',
        focus: 'Chest · Back · Shoulders',
        exercises: [
          { name: 'Flat Barbell Bench Press', targetReps: '6-8', sets: 4 },
          { name: 'Barbell Bent-Over Row', targetReps: '6-10', sets: 4 },
          { name: 'Overhead Press', targetReps: '8-10', sets: 3 },
          { name: 'Lat Pulldown', targetReps: '8-12', sets: 3 },
          { name: 'Cable Triceps Pushdown', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'lower-a',
        day: 2,
        label: 'Day 2 - Lower A',
        short: 'Lower A',
        focus: 'Quads · Hamstrings · Calves',
        exercises: [
          { name: 'Barbell Squat', targetReps: '5-8', sets: 4 },
          { name: 'Romanian Deadlift', targetReps: '8-10', sets: 3 },
          { name: 'Leg Press', targetReps: '10-12', sets: 3 },
          { name: 'Standing Calf Raise', targetReps: '12-15', sets: 3 },
        ],
      },
      {
        key: 'upper-b',
        day: 3,
        label: 'Day 3 - Upper B',
        short: 'Upper B',
        focus: 'Incline Press · Rows · Arms',
        exercises: [
          { name: 'Incline Dumbbell Press', targetReps: '8-12', sets: 4 },
          { name: 'Seated Cable Row', targetReps: '8-12', sets: 3 },
          { name: 'Dumbbell Lateral Raise', targetReps: '12-15', sets: 3 },
          { name: 'Barbell Curl', targetReps: '10-12', sets: 3 },
          { name: 'Face Pull', targetReps: '12-15', sets: 3 },
        ],
      },
      {
        key: 'lower-b',
        day: 4,
        label: 'Day 4 - Lower B',
        short: 'Lower B',
        focus: 'Deadlift · Front Squat · Posterior Chain',
        exercises: [
          { name: 'Barbell Deadlift', targetReps: '4-6', sets: 3 },
          { name: 'Front Squat', targetReps: '6-10', sets: 3 },
          { name: 'Lying Leg Curl', targetReps: '10-15', sets: 3 },
          { name: 'Seated Calf Raise', targetReps: '12-15', sets: 3 },
        ],
      },
    ],
  },
  'preset-full-body': {
    id: 'preset-full-body',
    name: '3-Day Full Body Routine',
    short: '3-Day Full Body',
    daysCount: 3,
    description: '3 high-efficiency sessions per week hitting every muscle group with ample recovery.',
    days: [
      {
        key: 'full-a',
        day: 1,
        label: 'Day 1 - Full Body A',
        short: 'Full Body A',
        focus: 'Squat · Bench · Row',
        exercises: [
          { name: 'Barbell Squat', targetReps: '5-8', sets: 4 },
          { name: 'Flat Barbell Bench Press', targetReps: '6-8', sets: 4 },
          { name: 'Barbell Bent-Over Row', targetReps: '6-10', sets: 4 },
          { name: 'Cable Triceps Pushdown', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'full-b',
        day: 2,
        label: 'Day 2 - Full Body B',
        short: 'Full Body B',
        focus: 'Deadlift · Overhead Press · Lats',
        exercises: [
          { name: 'Barbell Deadlift', targetReps: '4-6', sets: 3 },
          { name: 'Overhead Press', targetReps: '6-8', sets: 4 },
          { name: 'Lat Pulldown', targetReps: '8-12', sets: 3 },
          { name: 'Barbell Curl', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'full-c',
        day: 3,
        label: 'Day 3 - Full Body C',
        short: 'Full Body C',
        focus: 'Leg Press · Incline DB · Cable Row',
        exercises: [
          { name: 'Leg Press', targetReps: '10-12', sets: 3 },
          { name: 'Incline Dumbbell Press', targetReps: '8-12', sets: 3 },
          { name: 'Seated Cable Row', targetReps: '8-12', sets: 3 },
          { name: 'Dumbbell Lateral Raise', targetReps: '12-15', sets: 3 },
          { name: 'Standing Calf Raise', targetReps: '12-15', sets: 3 },
        ],
      },
    ],
  },
  'preset-ppl-3': {
    id: 'preset-ppl-3',
    name: '3-Day Push / Pull / Legs',
    short: '3-Day PPL',
    daysCount: 3,
    description: 'Classic 3-day body-part split focusing on movement planes.',
    days: [
      {
        key: 'ppl-push',
        day: 1,
        label: 'Day 1 - Push',
        short: 'Push',
        focus: 'Chest · Shoulders · Triceps',
        exercises: [
          { name: 'Flat Barbell Bench Press', targetReps: '6-8', sets: 4 },
          { name: 'Machine Shoulder Press', targetReps: '8-10', sets: 3 },
          { name: 'Incline Dumbbell Press', targetReps: '8-12', sets: 3 },
          { name: 'Cable Triceps Pushdown', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'ppl-pull',
        day: 2,
        label: 'Day 2 - Pull',
        short: 'Pull',
        focus: 'Back · Rear Delts · Biceps',
        exercises: [
          { name: 'Barbell Bent-Over Row', targetReps: '6-10', sets: 4 },
          { name: 'Lat Pulldown', targetReps: '8-12', sets: 3 },
          { name: 'Face Pull', targetReps: '12-15', sets: 3 },
          { name: 'Barbell Curl', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'ppl-legs',
        day: 3,
        label: 'Day 3 - Legs',
        short: 'Legs',
        focus: 'Quads · Hamstrings · Calves',
        exercises: [
          { name: 'Barbell Squat', targetReps: '5-8', sets: 4 },
          { name: 'Romanian Deadlift', targetReps: '8-10', sets: 3 },
          { name: 'Leg Press', targetReps: '10-12', sets: 3 },
          { name: 'Standing Calf Raise', targetReps: '12-15', sets: 3 },
        ],
      },
    ],
  },
  'preset-ppl-6': {
    id: 'preset-ppl-6',
    name: '6-Day Push / Pull / Legs (2x/Week)',
    short: '6-Day PPL',
    daysCount: 6,
    description: 'High-volume bodybuilding split hitting every muscle group twice every 7 days.',
    days: [
      {
        key: 'ppl-6-push1',
        day: 1,
        label: 'Day 1 - Push 1',
        short: 'Push 1',
        focus: 'Heavy Bench · Delts · Triceps',
        exercises: [
          { name: 'Flat Barbell Bench Press', targetReps: '5-8', sets: 4 },
          { name: 'Overhead Press', targetReps: '6-8', sets: 3 },
          { name: 'Incline Dumbbell Press', targetReps: '8-12', sets: 3 },
          { name: 'Cable Triceps Pushdown', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'ppl-6-pull1',
        day: 2,
        label: 'Day 2 - Pull 1',
        short: 'Pull 1',
        focus: 'Heavy Deadlift · Rows · Biceps',
        exercises: [
          { name: 'Barbell Deadlift', targetReps: '4-6', sets: 3 },
          { name: 'Barbell Bent-Over Row', targetReps: '6-10', sets: 4 },
          { name: 'Lat Pulldown', targetReps: '8-12', sets: 3 },
          { name: 'Barbell Curl', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'ppl-6-legs1',
        day: 3,
        label: 'Day 3 - Legs 1',
        short: 'Legs 1',
        focus: 'Heavy Squat · Quads · Calves',
        exercises: [
          { name: 'Barbell Squat', targetReps: '5-8', sets: 4 },
          { name: 'Leg Press', targetReps: '10-12', sets: 3 },
          { name: 'Romanian Deadlift', targetReps: '8-10', sets: 3 },
          { name: 'Standing Calf Raise', targetReps: '12-15', sets: 3 },
        ],
      },
      {
        key: 'ppl-6-push2',
        day: 4,
        label: 'Day 4 - Push 2',
        short: 'Push 2',
        focus: 'Incline Barbell · Shoulders · Flyes',
        exercises: [
          { name: 'Incline Barbell Bench Press', targetReps: '6-8', sets: 4 },
          { name: 'Machine Shoulder Press', targetReps: '8-10', sets: 3 },
          { name: 'Dumbbell Lateral Raise', targetReps: '12-15', sets: 3 },
          { name: 'Dips (Chest Focus)', targetReps: '8-12', sets: 3 },
        ],
      },
      {
        key: 'ppl-6-pull2',
        day: 5,
        label: 'Day 5 - Pull 2',
        short: 'Pull 2',
        focus: 'Pull-Ups · Cable Rows · Rear Delts',
        exercises: [
          { name: 'Pull-Up', targetReps: '6-10', sets: 4 },
          { name: 'Seated Cable Row', targetReps: '8-12', sets: 3 },
          { name: 'Face Pull', targetReps: '12-15', sets: 3 },
          { name: 'Hammer Curl', targetReps: '10-12', sets: 3 },
        ],
      },
      {
        key: 'ppl-6-legs2',
        day: 6,
        label: 'Day 6 - Legs 2',
        short: 'Legs 2',
        focus: 'Front Squat · Hamstrings · Calves',
        exercises: [
          { name: 'Front Squat', targetReps: '6-10', sets: 4 },
          { name: 'Dumbbell Romanian Deadlift', targetReps: '8-12', sets: 3 },
          { name: 'Lying Leg Curl', targetReps: '10-15', sets: 3 },
          { name: 'Seated Calf Raise', targetReps: '12-15', sets: 3 },
        ],
      },
    ],
  },
};

// Default export of the default split (backward compatibility)
export const SPLIT_DAYS = PRESET_SPLITS['preset-pplul'].days;

// Emoji badges for equipment and movement types
export function getEquipmentEmoji(equipment) {
  switch ((equipment || '').toLowerCase()) {
    case 'barbell': return '🏋️';
    case 'dumbbell': return '🥊';
    case 'machine': return '⚙️';
    case 'cable': return '⛓️';
    case 'bodyweight': return '🤸';
    case 'kettlebell': return '🫖';
    default: return '🔧';
  }
}

export function getTypeEmoji(type) {
  return (type || '').toLowerCase() === 'compound' ? '🛠️' : '🔧';
}

// Core compound movements tracked on the strength trajectory chart
// and eligible for the "+20 XP · upper rep limit" bonus.
export const CORE_LIFTS = ['Flat Barbell Bench Press', 'Barbell Deadlift', 'Barbell Squat'];

export const LIFT_SHORT = {
  'Flat Barbell Bench Press': 'Bench',
  'Barbell Deadlift': 'Deadlift',
  'Barbell Squat': 'Squat',
};

export const LIFT_COLORS = {
  'Flat Barbell Bench Press': '#34d399',
  'Barbell Deadlift': '#fbbf24',
  'Barbell Squat': '#38bdf8',
};

// Backward-compatible SWAP_MAP generated dynamically from exercise families
export const SWAP_MAP = EXERCISE_DATABASE.reduce((acc, ex) => {
  if (ex.family) {
    acc[ex.name] = EXERCISE_DATABASE.filter(
      (other) => other.family === ex.family && other.name !== ex.name
    ).map((other) => other.name);
  } else {
    acc[ex.name] = [];
  }
  return acc;
}, {});

// Quick helper to look up exercise details from name
export function getExerciseDetails(name) {
  const found = EXERCISE_DATABASE.find(
    (e) => e.name.toLowerCase() === (name || '').toLowerCase()
  );
  if (found) return found;
  return {
    name: name || 'Custom Exercise',
    family: 'custom',
    type: 'compound',
    equipment: 'Custom',
    primaryMuscles: ['Target Muscle'],
    secondaryMuscles: [],
    focus: 'Focus on controlled form and progressive overload (8–12 reps)',
    tips: ['Maintain a controlled tempo and steady breathing throughout the movement.'],
    description: 'Custom exercise logged for your workout session.'
  };
}

// Bi-directional swap options: returns all exercises sharing the same family
export function getBiDirectionalSwaps(exerciseName) {
  const current = getExerciseDetails(exerciseName);
  if (!current || !current.family || current.family === 'custom') {
    return EXERCISE_DATABASE.filter((e) => e.name !== exerciseName);
  }
  // Return all exercises in same family
  const familyMembers = EXERCISE_DATABASE.filter(
    (e) => e.family === current.family && e.name !== current.name
  );
  return familyMembers;
}
