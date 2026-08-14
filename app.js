const DAY_NAMES = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

const HISTORY_KEY = "zdash:history";
const CONFIG_KEY = "zdash:config";
const THEME_KEY = "zdash:theme";

/* ---------------- PDF storage (IndexedDB) ---------------- */

const PDF_DB_NAME = "zdash-pdfs";
const PDF_STORE = "pdfs";
const PHOTO_STORE = "progressPhotos";

function openPdfDb(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(PDF_DB_NAME, 2);
    req.onupgradeneeded = () => {
      const db = req.result;
      if(!db.objectStoreNames.contains(PDF_STORE)) db.createObjectStore(PDF_STORE);
      if(!db.objectStoreNames.contains(PHOTO_STORE)) db.createObjectStore(PHOTO_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function savePhoto(id, file){
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readwrite");
    tx.objectStore(PHOTO_STORE).put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function getPhoto(id){
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readonly");
    const req = tx.objectStore(PHOTO_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}
async function deletePhoto(id){
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readwrite");
    tx.objectStore(PHOTO_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function savePdf(bookId, file){
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, "readwrite");
    tx.objectStore(PDF_STORE).put(file, bookId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function getPdf(bookId){
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, "readonly");
    const req = tx.objectStore(PDF_STORE).get(bookId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}
async function deletePdf(bookId){
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, "readwrite");
    tx.objectStore(PDF_STORE).delete(bookId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------------- Static content ---------------- */

const DEFAULT_GYM_TYPES = [
  {id:"push", label:"Push", exercises:[]},
  {id:"pull", label:"Pull", exercises:[]},
  {id:"legs", label:"Legs", exercises:[]},
  {id:"kettlebell", label:"Kettlebell circuit", exercises:[]},
];
const DEFAULT_SPORT_EXTRAS = [
  {id:"mobilite", label:"Routine mobilité", onHome:true},
];

const MUSCLE_ICONS = {
  Chest:"🫀", Back:"🔺", "Upper Back":"🔺", Shoulders:"🟠", Biceps:"💪", Triceps:"💪",
  Forearms:"✊", Quadriceps:"🦵", Hamstrings:"🦵", Glutes:"🍑", Calves:"🦵",
  Core:"🌀", "Full Body":"🏋️", Cardio:"🏃", Legs:"🦵", Neck:"🧠",
};

const EXERCISE_LIBRARY = [
  {id:"warmup", name:"Warm Up", muscle:"Full Body", video:"f3zOrYCwquE"},
  {id:"squat", name:"Squat (Barbell)", muscle:"Quadriceps", video:"kRX2NfqM90g"},
  {id:"front_squat", name:"Front Squat", muscle:"Quadriceps", video:"v-mQm_droHg"},
  {id:"deadlift", name:"Deadlift (Barbell)", muscle:"Hamstrings", video:"GxsLrTzyGUU"},
  {id:"romanian_deadlift", name:"Romanian Deadlift (Barbell)", muscle:"Hamstrings", video:"2SHsk9AzdjA"},
  {id:"bench_press", name:"Bench Press (Barbell)", muscle:"Chest", image:"exercise-images/bench_press.png", video:"gRVjAtPip0Y"},
  {id:"incline_bench_press", name:"Incline Bench Press (Barbell)", muscle:"Chest", image:"exercise-images/incline_bench_press.png", video:"kQtx01Qz6s8"},
  {id:"push_up", name:"Push Up", muscle:"Chest", image:"exercise-images/push_up.png", video:"BeC7ewqJsjI"},
  {id:"overhead_press", name:"Overhead Press (Barbell)", muscle:"Shoulders", video:"F3QY5vMz_6I"},
  {id:"lateral_raise", name:"Lateral Raise (Dumbbell)", muscle:"Shoulders", image:"exercise-images/lateral_raise.png", video:"b_LEX4n9lOs"},
  {id:"pull_up", name:"Pull Up", muscle:"Back", video:"vw5Xmu5CIew"},
  {id:"chin_up", name:"Chin Up", muscle:"Back", image:"exercise-images/chin_up.png", video:"brhRXlOhsAM"},
  {id:"lat_pulldown", name:"Lat Pulldown (Cable)", muscle:"Back", video:"SALxEARiMkw"},
  {id:"barbell_row", name:"Bent Over Row (Barbell)", muscle:"Back", image:"exercise-images/barbell_row.png", video:"ML1L5ytxLMY"},
  {id:"seated_cable_row", name:"Seated Cable Row - Bar Grip", muscle:"Back", image:"exercise-images/seated_cable_row.png", video:"xQNrFHEMhI4"},
  {id:"lunge", name:"Lunge", muscle:"Quadriceps", video:"krXwDPKKiSM"},
  {id:"bulgarian_split_squat", name:"Bulgarian Split Squat", muscle:"Quadriceps", image:"exercise-images/bulgarian_split_squat.png", video:"DeCnHqrN22U"},
  {id:"leg_press", name:"Leg Press (Machine)", muscle:"Quadriceps", video:"FciBR6C1knw"},
  {id:"leg_curl", name:"Lying Leg Curl (Machine)", muscle:"Hamstrings", video:"hqI59xXChFk"},
  {id:"calf_raise", name:"Standing Calf Raise", muscle:"Calves", video:"ndQc4mz4mBU"},
  {id:"bicep_curl", name:"Bicep Curl (Dumbbell)", muscle:"Biceps", image:"exercise-images/bicep_curl.png", video:"6DeLZ6cbgWQ"},
  {id:"hammer_curl", name:"Hammer Curl (Dumbbell)", muscle:"Biceps", image:"exercise-images/hammer_curl.png", video:"BRVDS6HVR9Q"},
  {id:"tricep_dip", name:"Triceps Dip", muscle:"Triceps", video:"AE4xaqTICTA"},
  {id:"tricep_pushdown", name:"Triceps Pushdown", muscle:"Triceps", video:"qHDrQglWgS4"},
  {id:"plank", name:"Plank", muscle:"Core", image:"exercise-images/plank.png", video:"mwlp75MS6Rg"},
  {id:"side_plank", name:"Side Plank", muscle:"Core", image:"exercise-images/side_plank.png", video:"iNbH7_edNI8"},
  {id:"russian_twist", name:"Russian Twist (Bodyweight)", muscle:"Core", image:"exercise-images/russian_twist.png", video:"IJDOoVyVjhc"},
  {id:"hanging_leg_raise", name:"Hanging Leg Raise", muscle:"Core", video:"rbOJSK07AGA"},
  {id:"glute_bridge", name:"Glute Bridge", muscle:"Glutes", video:"nuapk_-Q2BI"},
  {id:"hip_thrust", name:"Hip Thrust", muscle:"Glutes", image:"exercise-images/hip_thrust.png", video:"pF17m_CXfL0"},
  {id:"burpee", name:"Burpee", muscle:"Full Body", image:"exercise-images/burpee.png", video:"wGvBfVeCNko"},
  {id:"mountain_climber", name:"Mountain Climber", muscle:"Full Body", image:"exercise-images/mountain_climber.png", video:"ixxk9Qfn61o"},
  {id:"jump_rope", name:"Jump Rope", muscle:"Cardio", video:"kDOGb9C5kp0"},
  {id:"box_jump", name:"Box Jump", muscle:"Legs", image:"exercise-images/box_jump.png", video:"G-bxQY57mKc"},
  {id:"kettlebell_swing", name:"Kettlebell Swing", muscle:"Full Body", video:"pA6o-a3y1Vo"},
  {id:"kettlebell_goblet_squat", name:"Kettlebell Goblet Squat", muscle:"Quadriceps", image:"exercise-images/kettlebell_goblet_squat.png", video:"IkcOjDnHwyI"},
  {id:"kettlebell_halo", name:"Kettlebell Halo", muscle:"Shoulders", image:"exercise-images/kettlebell_halo.png", video:"lKANnpyd6VY"},
  {id:"gorilla_row_kettlebell", name:"Gorilla Row (Kettlebell)", muscle:"Upper Back", image:"exercise-images/gorilla_row_kettlebell.png", video:"bLM3nLvoRdc"},
  {id:"turkish_getup", name:"Kettlebell Turkish Get Up", muscle:"Full Body", video:"sgd8n917Zv0"},
  {id:"farmers_carry", name:"Farmers Walk", muscle:"Full Body", video:"z7E_YU9P1jU"},
  {id:"renegade_row", name:"Renegade Row (Dumbbell)", muscle:"Back", video:"F68p7cJFtOI"},
  {id:"e21s_bicep_curl", name:"21s Bicep Curl", muscle:"Biceps", image:"exercise-images/e21s_bicep_curl.png"},
  {id:"ab_scissors", name:"Ab Scissors", muscle:"Core", image:"exercise-images/ab_scissors.png"},
  {id:"ab_wheel", name:"Ab Wheel", muscle:"Core", image:"exercise-images/ab_wheel.png"},
  {id:"aerobics", name:"Aerobics", muscle:"Cardio", image:"exercise-images/aerobics.png"},
  {id:"air_bike", name:"Air Bike", muscle:"Cardio", image:"exercise-images/air_bike.png"},
  {id:"arnold_press_dumbbell", name:"Arnold Press (Dumbbell)", muscle:"Shoulders", image:"exercise-images/arnold_press_dumbbell.png"},
  {id:"around_the_world", name:"Around The World", muscle:"Chest", image:"exercise-images/around_the_world.png"},
  {id:"assisted_pistol_squats", name:"Assisted Pistol Squats", muscle:"Quadriceps", image:"exercise-images/assisted_pistol_squats.png"},
  {id:"back_extension_hyperextension", name:"Back Extension (Hyperextension)", muscle:"Back"},
  {id:"back_extension_machine", name:"Back Extension (Machine)", muscle:"Back"},
  {id:"back_extension_weighted_hyperextension", name:"Back Extension (Weighted Hyperextension)", muscle:"Back", image:"exercise-images/back_extension_weighted_hyperextension.png"},
  {id:"ball_slams", name:"Ball Slams", muscle:"Full Body", image:"exercise-images/ball_slams.png"},
  {id:"band_pullaparts", name:"Band Pullaparts", muscle:"Upper Back", image:"exercise-images/band_pullaparts.png"},
  {id:"battle_ropes", name:"Battle Ropes", muscle:"Full Body", image:"exercise-images/battle_ropes.png"},
  {id:"behind_the_back_bicep_wrist_curl_barbell", name:"Behind the Back Bicep Wrist Curl (Barbell)", muscle:"Forearms", image:"exercise-images/behind_the_back_bicep_wrist_curl_barbell.png"},
  {id:"behind_the_back_curl_cable", name:"Behind the Back Curl (Cable)", muscle:"Biceps", image:"exercise-images/behind_the_back_curl_cable.png"},
  {id:"belt_squat_machine", name:"Belt Squat (Machine)", muscle:"Quadriceps", image:"exercise-images/belt_squat_machine.png"},
  {id:"bench_dip", name:"Bench Dip", muscle:"Triceps", image:"exercise-images/bench_dip.png"},
  {id:"bench_press_close_grip_barbell", name:"Bench Press - Close Grip (Barbell)", muscle:"Triceps", image:"exercise-images/bench_press_close_grip_barbell.png"},
  {id:"bench_press_wide_grip_barbell", name:"Bench Press - Wide Grip (Barbell)", muscle:"Chest", image:"exercise-images/bench_press_wide_grip_barbell.png"},
  {id:"bench_press_cable", name:"Bench Press (Cable)", muscle:"Chest", image:"exercise-images/bench_press_cable.png"},
  {id:"bench_press_dumbbell", name:"Bench Press (Dumbbell)", muscle:"Chest", image:"exercise-images/bench_press_dumbbell.png"},
  {id:"bench_press_smith_machine", name:"Bench Press (Smith Machine)", muscle:"Chest", image:"exercise-images/bench_press_smith_machine.png"},
  {id:"bent_over_row_band", name:"Bent Over Row (Band)", muscle:"Back", image:"exercise-images/bent_over_row_band.png"},
  {id:"bent_over_row_dumbbell", name:"Bent Over Row (Dumbbell)", muscle:"Back", image:"exercise-images/bent_over_row_dumbbell.png"},
  {id:"bicep_curl_barbell", name:"Bicep Curl (Barbell)", muscle:"Biceps", image:"exercise-images/bicep_curl_barbell.png"},
  {id:"bicep_curl_cable", name:"Bicep Curl (Cable)", muscle:"Biceps", image:"exercise-images/bicep_curl_cable.png"},
  {id:"bicep_curl_machine", name:"Bicep Curl (Machine)", muscle:"Biceps", image:"exercise-images/bicep_curl_machine.png"},
  {id:"bicycle_crunch", name:"Bicycle Crunch", muscle:"Core", image:"exercise-images/bicycle_crunch.png"},
  {id:"bicycle_crunch_raised_legs", name:"Bicycle Crunch Raised Legs", muscle:"Core", image:"exercise-images/bicycle_crunch_raised_legs.png"},
  {id:"bird_dog", name:"Bird Dog", muscle:"Core", image:"exercise-images/bird_dog.png"},
  {id:"box_squat_barbell", name:"Box Squat (Barbell)", muscle:"Quadriceps", image:"exercise-images/box_squat_barbell.png"},
  {id:"boxing", name:"Boxing", muscle:"Cardio", image:"exercise-images/boxing.png"},
  {id:"burpee_broad_jumps", name:"Burpee Broad Jumps", muscle:"Full Body", image:"exercise-images/burpee_broad_jumps.png"},
  {id:"burpee_over_the_bar", name:"Burpee Over the Bar", muscle:"Full Body"},
  {id:"butterfly_pec_deck", name:"Butterfly (Pec Deck)", muscle:"Chest"},
  {id:"cable_core_pallof_press", name:"Cable Core Pallof Press", muscle:"Core"},
  {id:"cable_crunch", name:"Cable Crunch", muscle:"Core", image:"exercise-images/cable_crunch.png"},
  {id:"cable_fly_crossovers", name:"Cable Fly Crossovers", muscle:"Chest", image:"exercise-images/cable_fly_crossovers.png"},
  {id:"cable_pull_through", name:"Cable Pull Through", muscle:"Glutes", image:"exercise-images/cable_pull_through.png"},
  {id:"cable_twist_down_to_up", name:"Cable Twist (Down to up)", muscle:"Core", image:"exercise-images/cable_twist_down_to_up.png"},
  {id:"cable_twist_up_to_down", name:"Cable Twist (Up to down)", muscle:"Core", image:"exercise-images/cable_twist_up_to_down.png"},
  {id:"calf_extension_machine", name:"Calf Extension (Machine)", muscle:"Calves", image:"exercise-images/calf_extension_machine.png"},
  {id:"calf_press_machine", name:"Calf Press (Machine)", muscle:"Calves", image:"exercise-images/calf_press_machine.png"},
  {id:"chest_dip", name:"Chest Dip", muscle:"Chest"},
  {id:"chest_dip_assisted", name:"Chest Dip (Assisted)", muscle:"Chest"},
  {id:"chest_dip_weighted", name:"Chest Dip (Weighted)", muscle:"Chest"},
  {id:"chest_fly_band", name:"Chest Fly (Band)", muscle:"Chest"},
  {id:"chest_fly_dumbbell", name:"Chest Fly (Dumbbell)", muscle:"Chest"},
  {id:"chest_fly_machine", name:"Chest Fly (Machine)", muscle:"Chest", image:"exercise-images/chest_fly_machine.png"},
  {id:"chest_fly_suspension", name:"Chest Fly (Suspension)", muscle:"Chest", image:"exercise-images/chest_fly_suspension.png"},
  {id:"chest_press_band", name:"Chest Press (Band)", muscle:"Chest", image:"exercise-images/chest_press_band.png"},
  {id:"chest_press_machine", name:"Chest Press (Machine)", muscle:"Chest", image:"exercise-images/chest_press_machine.png"},
  {id:"chest_supported_incline_row_dumbbell", name:"Chest Supported Incline Row (Dumbbell)", muscle:"Back", image:"exercise-images/chest_supported_incline_row_dumbbell.png"},
  {id:"chest_supported_reverse_fly_dumbbell", name:"Chest Supported Reverse Fly (Dumbbell)", muscle:"Shoulders", image:"exercise-images/chest_supported_reverse_fly_dumbbell.png"},
  {id:"chest_supported_y_raise", name:"Chest Supported Y Raise", muscle:"Shoulders"},
  {id:"chin_up_assisted", name:"Chin Up (Assisted)", muscle:"Back"},
  {id:"chin_up_weighted", name:"Chin Up (Weighted)", muscle:"Back"},
  {id:"clamshell", name:"Clamshell", muscle:"Glutes"},
  {id:"clap_push_ups", name:"Clap Push Ups", muscle:"Chest"},
  {id:"clean", name:"Clean", muscle:"Full Body"},
  {id:"clean_and_jerk", name:"Clean and Jerk", muscle:"Full Body"},
  {id:"clean_and_press", name:"Clean and Press", muscle:"Full Body"},
  {id:"clean_pull", name:"Clean Pull", muscle:"Full Body", image:"exercise-images/clean_pull.png"},
  {id:"climbing", name:"Climbing", muscle:"Full Body", image:"exercise-images/climbing.png"},
  {id:"concentration_curl", name:"Concentration Curl", muscle:"Biceps", image:"exercise-images/concentration_curl.png"},
  {id:"cross_body_hammer_curl", name:"Cross Body Hammer Curl", muscle:"Biceps", image:"exercise-images/cross_body_hammer_curl.png"},
  {id:"crunch", name:"Crunch", muscle:"Core", image:"exercise-images/crunch.png"},
  {id:"crunch_machine", name:"Crunch (Machine)", muscle:"Core", image:"exercise-images/crunch_machine.png"},
  {id:"crunch_weighted", name:"Crunch (Weighted)", muscle:"Core", image:"exercise-images/crunch_weighted.png"},
  {id:"curtsy_lunge_dumbbell", name:"Curtsy Lunge (Dumbbell)", muscle:"Glutes", image:"exercise-images/curtsy_lunge_dumbbell.png"},
  {id:"cycling", name:"Cycling", muscle:"Cardio"},
  {id:"dead_bug", name:"Dead Bug", muscle:"Core"},
  {id:"dead_hang", name:"Dead Hang", muscle:"Back"},
  {id:"deadlift_band", name:"Deadlift (Band)", muscle:"Hamstrings"},
  {id:"deadlift_dumbbell", name:"Deadlift (Dumbbell)", muscle:"Hamstrings"},
  {id:"deadlift_smith_machine", name:"Deadlift (Smith Machine)", muscle:"Hamstrings"},
  {id:"deadlift_trap_bar", name:"Deadlift (Trap bar)", muscle:"Hamstrings"},
  {id:"deadlift_high_pull", name:"Deadlift High Pull", muscle:"Full Body"},
  {id:"decline_bench_press_barbell", name:"Decline Bench Press (Barbell)", muscle:"Chest"},
  {id:"decline_bench_press_dumbbell", name:"Decline Bench Press (Dumbbell)", muscle:"Chest"},
  {id:"decline_bench_press_smith_machine", name:"Decline Bench Press (Smith Machine)", muscle:"Chest"},
  {id:"decline_chest_fly_dumbbell", name:"Decline Chest Fly (Dumbbell)", muscle:"Chest", image:"exercise-images/decline_chest_fly_dumbbell.png"},
  {id:"decline_crunch_weighted", name:"Decline Crunch (Weighted)", muscle:"Core", image:"exercise-images/decline_crunch_weighted.png"},
  {id:"decline_push_up", name:"Decline Push Up", muscle:"Chest", image:"exercise-images/decline_push_up.png"},
  {id:"diamond_push_up", name:"Diamond Push Up", muscle:"Triceps", image:"exercise-images/diamond_push_up.png"},
  {id:"downward_dog", name:"Downward Dog", muscle:"Full Body", image:"exercise-images/downward_dog.png"},
  {id:"dragonfly", name:"Dragonfly", muscle:"Core"},
  {id:"dumbbell_row", name:"Dumbbell Row", muscle:"Back"},
  {id:"dumbbell_snatch", name:"Dumbbell Snatch", muscle:"Full Body"},
  {id:"dumbbell_squeeze_press", name:"Dumbbell Squeeze Press", muscle:"Chest"},
  {id:"dumbbell_step_up", name:"Dumbbell Step Up", muscle:"Quadriceps"},
  {id:"elbow_to_knee", name:"Elbow to Knee", muscle:"Core"},
  {id:"elliptical_trainer", name:"Elliptical Trainer", muscle:"Cardio"},
  {id:"ez_bar_biceps_curl", name:"EZ Bar Biceps Curl", muscle:"Biceps"},
  {id:"face_pull", name:"Face Pull", muscle:"Shoulders"},
  {id:"feet_up_bench_press_barbell", name:"Feet Up Bench Press (Barbell)", muscle:"Chest"},
  {id:"floor_press_barbell", name:"Floor Press (Barbell)", muscle:"Chest", image:"exercise-images/floor_press_barbell.png"},
  {id:"floor_triceps_dip", name:"Floor Triceps Dip", muscle:"Triceps", image:"exercise-images/floor_triceps_dip.png"},
  {id:"flutter_kicks", name:"Flutter Kicks", muscle:"Core", image:"exercise-images/flutter_kicks.png"},
  {id:"frog_jumps", name:"Frog Jumps", muscle:"Legs", image:"exercise-images/frog_jumps.png"},
  {id:"frog_pumps_dumbbell", name:"Frog Pumps (Dumbbell)", muscle:"Glutes", image:"exercise-images/frog_pumps_dumbbell.png"},
  {id:"front_lever_hold", name:"Front Lever Hold", muscle:"Back", image:"exercise-images/front_lever_hold.png"},
  {id:"front_lever_raise", name:"Front Lever Raise", muscle:"Back", image:"exercise-images/front_lever_raise.png"},
  {id:"front_raise_band", name:"Front Raise (Band)", muscle:"Shoulders"},
  {id:"front_raise_barbell", name:"Front Raise (Barbell)", muscle:"Shoulders"},
  {id:"front_raise_cable", name:"Front Raise (Cable)", muscle:"Shoulders"},
  {id:"front_raise_dumbbell", name:"Front Raise (Dumbbell)", muscle:"Shoulders"},
  {id:"front_raise_suspension", name:"Front Raise (Suspension)", muscle:"Shoulders"},
  {id:"glute_ham_raise", name:"Glute Ham Raise", muscle:"Hamstrings"},
  {id:"glute_kickback_machine", name:"Glute Kickback (Machine)", muscle:"Glutes"},
  {id:"glute_kickback_on_floor", name:"Glute Kickback on Floor", muscle:"Glutes"},
  {id:"goblet_squat", name:"Goblet Squat", muscle:"Quadriceps"},
  {id:"good_morning_barbell", name:"Good Morning (Barbell)", muscle:"Hamstrings", image:"exercise-images/good_morning_barbell.png"},
  {id:"hack_squat", name:"Hack Squat", muscle:"Quadriceps", image:"exercise-images/hack_squat.png"},
  {id:"hack_squat_machine", name:"Hack Squat (Machine)", muscle:"Quadriceps", image:"exercise-images/hack_squat_machine.png"},
  {id:"hammer_curl_band", name:"Hammer Curl (Band)", muscle:"Biceps", image:"exercise-images/hammer_curl_band.png"},
  {id:"hammer_curl_cable", name:"Hammer Curl (Cable)", muscle:"Biceps", image:"exercise-images/hammer_curl_cable.png"},
  {id:"handstand_hold", name:"Handstand Hold", muscle:"Shoulders", image:"exercise-images/handstand_hold.png"},
  {id:"handstand_push_up", name:"Handstand Push Up", muscle:"Shoulders"},
  {id:"hang_clean", name:"Hang Clean", muscle:"Full Body"},
  {id:"hang_snatch", name:"Hang Snatch", muscle:"Full Body"},
  {id:"hanging_knee_raise", name:"Hanging Knee Raise", muscle:"Core"},
  {id:"heel_taps", name:"Heel Taps", muscle:"Core"},
  {id:"hex_press_dumbbell", name:"Hex Press (Dumbbell)", muscle:"Chest"},
  {id:"high_knee_skips", name:"High Knee Skips", muscle:"Cardio"},
  {id:"high_knees", name:"High Knees", muscle:"Cardio"},
  {id:"hiit", name:"HIIT", muscle:"Cardio"},
  {id:"hiking", name:"Hiking", muscle:"Cardio"},
  {id:"hip_abduction_machine", name:"Hip Abduction (Machine)", muscle:"Glutes"},
  {id:"hip_adduction_machine", name:"Hip Adduction (Machine)", muscle:"Glutes", image:"exercise-images/hip_adduction_machine.png"},
  {id:"hip_thrust_barbell", name:"Hip Thrust (Barbell)", muscle:"Glutes", image:"exercise-images/hip_thrust_barbell.png"},
  {id:"hip_thrust_machine", name:"Hip Thrust (Machine)", muscle:"Glutes", image:"exercise-images/hip_thrust_machine.png"},
  {id:"hip_thrust_smith_machine", name:"Hip Thrust (Smith Machine)", muscle:"Glutes", image:"exercise-images/hip_thrust_smith_machine.png"},
  {id:"hollow_rock", name:"Hollow Rock", muscle:"Core", image:"exercise-images/hollow_rock.png"},
  {id:"incline_bench_press_dumbbell", name:"Incline Bench Press (Dumbbell)", muscle:"Chest", image:"exercise-images/incline_bench_press_dumbbell.png"},
  {id:"incline_bench_press_smith_machine", name:"Incline Bench Press (Smith Machine)", muscle:"Chest"},
  {id:"incline_chest_fly_dumbbell", name:"Incline Chest Fly (Dumbbell)", muscle:"Chest"},
  {id:"incline_chest_press_machine", name:"Incline Chest Press (Machine)", muscle:"Chest"},
  {id:"incline_push_ups", name:"Incline Push Ups", muscle:"Chest"},
  {id:"inverted_row", name:"Inverted Row", muscle:"Back"},
  {id:"iso_lateral_chest_press_machine", name:"Iso-Lateral Chest Press (Machine)", muscle:"Chest"},
  {id:"iso_lateral_high_row_machine", name:"Iso-Lateral High Row (Machine)", muscle:"Back"},
  {id:"iso_lateral_low_row", name:"Iso-Lateral Low Row", muscle:"Back"},
  {id:"iso_lateral_row_machine", name:"Iso-Lateral Row (Machine)", muscle:"Back"},
  {id:"jack_knife_suspension", name:"Jack Knife (Suspension)", muscle:"Core"},
  {id:"jackknife_sit_up", name:"Jackknife Sit Up", muscle:"Core"},
  {id:"jm_press_barbell", name:"JM Press (Barbell)", muscle:"Triceps"},
  {id:"jump_shrug", name:"Jump Shrug", muscle:"Full Body"},
  {id:"jump_squat", name:"Jump Squat", muscle:"Quadriceps"},
  {id:"jumping_jack", name:"Jumping Jack", muscle:"Cardio"},
  {id:"jumping_lunge", name:"Jumping Lunge", muscle:"Quadriceps", image:"exercise-images/jumping_lunge.png"},
  {id:"kettlebell_around_the_world", name:"Kettlebell Around the World", muscle:"Shoulders", image:"exercise-images/kettlebell_around_the_world.png"},
  {id:"kettlebell_clean", name:"Kettlebell Clean", muscle:"Full Body", image:"exercise-images/kettlebell_clean.png"},
  {id:"kettlebell_curl", name:"Kettlebell Curl", muscle:"Biceps", image:"exercise-images/kettlebell_curl.png"},
  {id:"kettlebell_high_pull", name:"Kettlebell High Pull", muscle:"Full Body", image:"exercise-images/kettlebell_high_pull.png"},
  {id:"kettlebell_shoulder_press", name:"Kettlebell Shoulder Press", muscle:"Shoulders", image:"exercise-images/kettlebell_shoulder_press.png"},
  {id:"kettlebell_snatch", name:"Kettlebell Snatch", muscle:"Full Body"},
  {id:"kipping_pull_up", name:"Kipping Pull Up", muscle:"Back"},
  {id:"knee_raise_parallel_bars", name:"Knee Raise Parallel Bars", muscle:"Core"},
  {id:"kneeling_pulldown_band", name:"Kneeling Pulldown (Band)", muscle:"Back"},
  {id:"kneeling_push_up", name:"Kneeling Push Up", muscle:"Chest"},
  {id:"l_sit_hold", name:"L-Sit Hold", muscle:"Core"},
  {id:"landmine_180", name:"Landmine 180", muscle:"Core"},
  {id:"landmine_row", name:"Landmine Row", muscle:"Back"},
  {id:"landmine_squat_and_press", name:"Landmine Squat and Press", muscle:"Full Body"},
  {id:"lat_pulldown_close_grip_cable", name:"Lat Pulldown - Close Grip (Cable)", muscle:"Back"},
  {id:"lat_pulldown_band", name:"Lat Pulldown (Band)", muscle:"Back"},
  {id:"lat_pulldown_machine", name:"Lat Pulldown (Machine)", muscle:"Back"},
  {id:"lateral_band_walks", name:"Lateral Band Walks", muscle:"Glutes"},
  {id:"lateral_box_jump", name:"Lateral Box Jump", muscle:"Legs"},
  {id:"lateral_leg_raises", name:"Lateral Leg Raises", muscle:"Glutes", image:"exercise-images/lateral_leg_raises.png"},
  {id:"lateral_lunge", name:"Lateral Lunge", muscle:"Quadriceps", image:"exercise-images/lateral_lunge.png"},
  {id:"lateral_raise_band", name:"Lateral Raise (Band)", muscle:"Shoulders", image:"exercise-images/lateral_raise_band.png"},
  {id:"lateral_raise_cable", name:"Lateral Raise (Cable)", muscle:"Shoulders", image:"exercise-images/lateral_raise_cable.png"},
  {id:"lateral_raise_machine", name:"Lateral Raise (Machine)", muscle:"Shoulders", image:"exercise-images/lateral_raise_machine.png"},
  {id:"lateral_squat", name:"Lateral Squat", muscle:"Quadriceps", image:"exercise-images/lateral_squat.png"},
  {id:"leg_extension_machine", name:"Leg Extension (Machine)", muscle:"Quadriceps", image:"exercise-images/leg_extension_machine.png"},
  {id:"leg_press_horizontal_machine", name:"Leg Press Horizontal (Machine)", muscle:"Quadriceps"},
  {id:"leg_raise_parallel_bars", name:"Leg Raise Parallel Bars", muscle:"Core"},
  {id:"low_cable_fly_crossovers", name:"Low Cable Fly Crossovers", muscle:"Chest"},
  {id:"low_row_suspension", name:"Low Row (Suspension)", muscle:"Back"},
  {id:"lunge_barbell", name:"Lunge (Barbell)", muscle:"Quadriceps"},
  {id:"lunge_dumbbell", name:"Lunge (Dumbbell)", muscle:"Quadriceps"},
  {id:"lying_knee_raise", name:"Lying Knee Raise", muscle:"Core"},
  {id:"lying_leg_raise", name:"Lying Leg Raise", muscle:"Core"},
  {id:"lying_neck_curls", name:"Lying Neck Curls", muscle:"Neck"},
  {id:"lying_neck_curls_weighted", name:"Lying Neck Curls (Weighted)", muscle:"Neck"},
  {id:"lying_neck_extension", name:"Lying Neck Extension", muscle:"Neck"},
  {id:"lying_neck_extension_weighted", name:"Lying Neck Extension (Weighted)", muscle:"Neck"},
  {id:"meadows_rows_barbell", name:"Meadows Rows (Barbell)", muscle:"Back", image:"exercise-images/meadows_rows_barbell.png"},
  {id:"muscle_up", name:"Muscle Up", muscle:"Back", image:"exercise-images/muscle_up.png"},
  {id:"negative_pull_up", name:"Negative Pull Up", muscle:"Back", image:"exercise-images/negative_pull_up.png"},
  {id:"nordic_hamstrings_curls", name:"Nordic Hamstrings Curls", muscle:"Hamstrings", image:"exercise-images/nordic_hamstrings_curls.png"},
  {id:"oblique_crunch", name:"Oblique Crunch", muscle:"Core", image:"exercise-images/oblique_crunch.png"},
  {id:"one_arm_push_up", name:"One Arm Push Up", muscle:"Chest", image:"exercise-images/one_arm_push_up.png"},
  {id:"overhead_curl_cable", name:"Overhead Curl (Cable)", muscle:"Biceps", image:"exercise-images/overhead_curl_cable.png"},
  {id:"overhead_dumbbell_lunge", name:"Overhead Dumbbell Lunge", muscle:"Quadriceps"},
  {id:"overhead_plate_raise", name:"Overhead Plate Raise", muscle:"Shoulders"},
  {id:"overhead_press_dumbbell", name:"Overhead Press (Dumbbell)", muscle:"Shoulders"},
  {id:"overhead_press_smith_machine", name:"Overhead Press (Smith Machine)", muscle:"Shoulders"},
  {id:"overhead_squat", name:"Overhead Squat", muscle:"Quadriceps"},
  {id:"overhead_triceps_extension_cable", name:"Overhead Triceps Extension (Cable)", muscle:"Triceps"},
  {id:"partial_glute_bridge_barbell", name:"Partial Glute Bridge (Barbell)", muscle:"Glutes"},
  {id:"pause_squat_barbell", name:"Pause Squat (Barbell)", muscle:"Quadriceps", image:"exercise-images/pause_squat_barbell.png"},
  {id:"pendlay_row_barbell", name:"Pendlay Row (Barbell)", muscle:"Back", image:"exercise-images/pendlay_row_barbell.png"},
  {id:"pendulum_squat_machine", name:"Pendulum Squat (Machine)", muscle:"Quadriceps", image:"exercise-images/pendulum_squat_machine.png"},
  {id:"pike_pushup", name:"Pike Pushup", muscle:"Shoulders", image:"exercise-images/pike_pushup.png"},
  {id:"pilates", name:"Pilates", muscle:"Core", image:"exercise-images/pilates.png"},
  {id:"pinwheel_curl_dumbbell", name:"Pinwheel Curl (Dumbbell)", muscle:"Biceps", image:"exercise-images/pinwheel_curl_dumbbell.png"},
  {id:"pistol_squat", name:"Pistol Squat", muscle:"Quadriceps", image:"exercise-images/pistol_squat.png"},
  {id:"plate_front_raise", name:"Plate Front Raise", muscle:"Shoulders"},
  {id:"plate_press", name:"Plate Press", muscle:"Chest"},
  {id:"plate_squeeze_svend_press", name:"Plate Squeeze (Svend Press)", muscle:"Chest"},
  {id:"power_clean", name:"Power Clean", muscle:"Full Body"},
  {id:"power_snatch", name:"Power Snatch", muscle:"Full Body"},
  {id:"preacher_curl_barbell", name:"Preacher Curl (Barbell)", muscle:"Biceps"},
  {id:"preacher_curl_dumbbell", name:"Preacher Curl (Dumbbell)", muscle:"Biceps"},
  {id:"preacher_curl_machine", name:"Preacher Curl (Machine)", muscle:"Biceps"},
  {id:"press_under", name:"Press Under", muscle:"Shoulders"},
  {id:"pull_up_assisted", name:"Pull Up (Assisted)", muscle:"Back"},
  {id:"pull_up_band", name:"Pull Up (Band)", muscle:"Back"},
  {id:"pull_up_weighted", name:"Pull Up (Weighted)", muscle:"Back"},
  {id:"pullover_dumbbell", name:"Pullover (Dumbbell)", muscle:"Chest"},
  {id:"pullover_machine", name:"Pullover (Machine)", muscle:"Back"},
  {id:"push_press", name:"Push Press", muscle:"Shoulders", image:"exercise-images/push_press.png"},
  {id:"push_up_close_grip", name:"Push Up - Close Grip", muscle:"Triceps", image:"exercise-images/push_up_close_grip.png"},
  {id:"push_up_weighted", name:"Push Up (Weighted)", muscle:"Chest", image:"exercise-images/push_up_weighted.png"},
  {id:"rack_pull", name:"Rack Pull", muscle:"Back", image:"exercise-images/rack_pull.png"},
  {id:"rear_delt_reverse_fly_cable", name:"Rear Delt Reverse Fly (Cable)", muscle:"Shoulders", image:"exercise-images/rear_delt_reverse_fly_cable.png"},
  {id:"rear_delt_reverse_fly_dumbbell", name:"Rear Delt Reverse Fly (Dumbbell)", muscle:"Shoulders", image:"exercise-images/rear_delt_reverse_fly_dumbbell.png"},
  {id:"rear_delt_reverse_fly_machine", name:"Rear Delt Reverse Fly (Machine)", muscle:"Shoulders"},
  {id:"rear_kick_machine", name:"Rear Kick (Machine)", muscle:"Glutes"},
  {id:"reverse_crunch", name:"Reverse Crunch", muscle:"Core"},
  {id:"reverse_curl_barbell", name:"Reverse Curl (Barbell)", muscle:"Biceps"},
  {id:"reverse_curl_cable", name:"Reverse Curl (Cable)", muscle:"Biceps"},
  {id:"reverse_curl_dumbbell", name:"Reverse Curl (Dumbbell)", muscle:"Biceps", image:"exercise-images/reverse_curl_dumbbell.png"},
  {id:"reverse_fly_single_arm_cable", name:"Reverse Fly Single Arm (Cable)", muscle:"Shoulders", image:"exercise-images/reverse_fly_single_arm_cable.png"},
  {id:"reverse_grip_concentration_curl", name:"Reverse Grip Concentration Curl", muscle:"Biceps", image:"exercise-images/reverse_grip_concentration_curl.png"},
  {id:"reverse_grip_lat_pulldown_cable", name:"Reverse Grip Lat Pulldown (Cable)", muscle:"Back", image:"exercise-images/reverse_grip_lat_pulldown_cable.png"},
  {id:"reverse_hyperextension", name:"Reverse Hyperextension", muscle:"Back", image:"exercise-images/reverse_hyperextension.png"},
  {id:"reverse_lunge", name:"Reverse Lunge", muscle:"Quadriceps", image:"exercise-images/reverse_lunge.png"},
  {id:"reverse_lunge_barbell", name:"Reverse Lunge (Barbell)", muscle:"Quadriceps", image:"exercise-images/reverse_lunge_barbell.png"},
  {id:"reverse_lunge_dumbbell", name:"Reverse Lunge (Dumbbell)", muscle:"Quadriceps", image:"exercise-images/reverse_lunge_dumbbell.png"},
  {id:"reverse_plank", name:"Reverse Plank", muscle:"Core"},
  {id:"ring_dips", name:"Ring Dips", muscle:"Triceps"},
  {id:"ring_pull_up", name:"Ring Pull Up", muscle:"Back"},
  {id:"ring_push_up", name:"Ring Push Up", muscle:"Chest"},
  {id:"romanian_deadlift_dumbbell", name:"Romanian Deadlift (Dumbbell)", muscle:"Hamstrings"},
  {id:"rope_cable_curl", name:"Rope Cable Curl", muscle:"Biceps"},
  {id:"rope_straight_arm_pulldown", name:"Rope Straight Arm Pulldown", muscle:"Back"},
  {id:"rowing_machine", name:"Rowing Machine", muscle:"Cardio"},
  {id:"running", name:"Running", muscle:"Cardio"},
  {id:"russian_twist_weighted", name:"Russian Twist (Weighted)", muscle:"Core", image:"exercise-images/russian_twist_weighted.png"},
  {id:"scapular_pull_ups", name:"Scapular Pull Ups", muscle:"Back", image:"exercise-images/scapular_pull_ups.png"},
  {id:"seated_cable_row_bar_wide_grip", name:"Seated Cable Row - Bar Wide Grip", muscle:"Back", image:"exercise-images/seated_cable_row_bar_wide_grip.png"},
  {id:"seated_cable_row_v_grip_cable", name:"Seated Cable Row - V Grip (Cable)", muscle:"Back", image:"exercise-images/seated_cable_row_v_grip_cable.png"},
  {id:"seated_calf_raise", name:"Seated Calf Raise", muscle:"Calves", image:"exercise-images/seated_calf_raise.png"},
  {id:"seated_chest_flys_cable", name:"Seated Chest Flys (Cable)", muscle:"Chest", image:"exercise-images/seated_chest_flys_cable.png"},
  {id:"seated_dip_machine", name:"Seated Dip Machine", muscle:"Triceps"},
  {id:"seated_incline_curl_dumbbell", name:"Seated Incline Curl (Dumbbell)", muscle:"Biceps"},
  {id:"seated_lateral_raise_dumbbell", name:"Seated Lateral Raise (Dumbbell)", muscle:"Shoulders"},
  {id:"seated_leg_curl_machine", name:"Seated Leg Curl (Machine)", muscle:"Hamstrings"},
  {id:"seated_overhead_press_barbell", name:"Seated Overhead Press (Barbell)", muscle:"Shoulders"},
  {id:"seated_overhead_press_dumbbell", name:"Seated Overhead Press (Dumbbell)", muscle:"Shoulders"},
  {id:"seated_palms_up_wrist_curl", name:"Seated Palms Up Wrist Curl", muscle:"Forearms"},
  {id:"seated_row_machine", name:"Seated Row (Machine)", muscle:"Back"},
  {id:"seated_shoulder_press_machine", name:"Seated Shoulder Press (Machine)", muscle:"Shoulders"},
  {id:"seated_triceps_press", name:"Seated Triceps Press", muscle:"Triceps"},
  {id:"seated_wrist_extension_barbell", name:"Seated Wrist Extension (Barbell)", muscle:"Forearms"},
  {id:"shoulder_press_dumbbell", name:"Shoulder Press (Dumbbell)", muscle:"Shoulders"},
  {id:"shoulder_press_machine_plates", name:"Shoulder Press (Machine Plates)", muscle:"Shoulders"},
  {id:"shoulder_taps", name:"Shoulder Taps", muscle:"Core"},
  {id:"shrug_barbell", name:"Shrug (Barbell)", muscle:"Upper Back"},
  {id:"shrug_cable", name:"Shrug (Cable)", muscle:"Upper Back"},
  {id:"shrug_dumbbell", name:"Shrug (Dumbbell)", muscle:"Upper Back"},
  {id:"shrug_machine", name:"Shrug (Machine)", muscle:"Upper Back"},
  {id:"side_bend", name:"Side Bend", muscle:"Core", image:"exercise-images/side_bend.png"},
  {id:"side_bend_dumbbell", name:"Side Bend (Dumbbell)", muscle:"Core", image:"exercise-images/side_bend_dumbbell.png"},
  {id:"single_arm_cable_crossover", name:"Single Arm Cable Crossover", muscle:"Chest", image:"exercise-images/single_arm_cable_crossover.png"},
  {id:"single_arm_cable_row", name:"Single Arm Cable Row", muscle:"Back", image:"exercise-images/single_arm_cable_row.png"},
  {id:"single_arm_curl_cable", name:"Single Arm Curl (Cable)", muscle:"Biceps", image:"exercise-images/single_arm_curl_cable.png"},
  {id:"single_arm_landmine_press_barbell", name:"Single Arm Landmine Press (Barbell)", muscle:"Shoulders", image:"exercise-images/single_arm_landmine_press_barbell.png"},
  {id:"single_arm_lat_pulldown", name:"Single Arm Lat Pulldown", muscle:"Back"},
  {id:"single_arm_lateral_raise_cable", name:"Single Arm Lateral Raise (Cable)", muscle:"Shoulders"},
  {id:"single_arm_tricep_extension_dumbbell", name:"Single Arm Tricep Extension (Dumbbell)", muscle:"Triceps"},
  {id:"single_leg_extensions", name:"Single Leg Extensions", muscle:"Quadriceps"},
  {id:"single_leg_glute_bridge", name:"Single Leg Glute Bridge", muscle:"Glutes"},
  {id:"single_leg_hip_thrust", name:"Single Leg Hip Thrust", muscle:"Glutes"},
  {id:"single_leg_hip_thrust_dumbbell", name:"Single Leg Hip Thrust (Dumbbell)", muscle:"Glutes"},
  {id:"single_leg_press_machine", name:"Single Leg Press (Machine)", muscle:"Quadriceps"},
  {id:"single_leg_romanian_deadlift_barbell", name:"Single Leg Romanian Deadlift (Barbell)", muscle:"Hamstrings"},
  {id:"single_leg_romanian_deadlift_dumbbell", name:"Single Leg Romanian Deadlift (Dumbbell)", muscle:"Hamstrings"},
  {id:"single_leg_standing_calf_raise", name:"Single Leg Standing Calf Raise", muscle:"Calves"},
  {id:"single_leg_standing_calf_raise_barbell", name:"Single Leg Standing Calf Raise (Barbell)", muscle:"Calves"},
  {id:"single_leg_standing_calf_raise_dumbbell", name:"Single Leg Standing Calf Raise (Dumbbell)", muscle:"Calves"},
  {id:"single_leg_standing_calf_raise_machine", name:"Single Leg Standing Calf Raise (Machine)", muscle:"Calves", image:"exercise-images/single_leg_standing_calf_raise_machine.png"},
  {id:"sissy_squat_weighted", name:"Sissy Squat (Weighted)", muscle:"Quadriceps", image:"exercise-images/sissy_squat_weighted.png"},
  {id:"sit_up", name:"Sit Up", muscle:"Core", image:"exercise-images/sit_up.png"},
  {id:"sit_up_weighted", name:"Sit Up (Weighted)", muscle:"Core", image:"exercise-images/sit_up_weighted.png"},
  {id:"skating", name:"Skating", muscle:"Cardio", image:"exercise-images/skating.png"},
  {id:"ski_erg", name:"Ski Erg", muscle:"Cardio", image:"exercise-images/ski_erg.png"},
  {id:"skiing", name:"Skiing", muscle:"Cardio", image:"exercise-images/skiing.png"},
  {id:"skullcrusher_barbell", name:"Skullcrusher (Barbell)", muscle:"Triceps", image:"exercise-images/skullcrusher_barbell.png"},
  {id:"skullcrusher_dumbbell", name:"Skullcrusher (Dumbbell)", muscle:"Triceps"},
  {id:"sled_pull", name:"Sled Pull", muscle:"Full Body"},
  {id:"sled_push", name:"Sled Push", muscle:"Full Body"},
  {id:"snatch", name:"Snatch", muscle:"Full Body"},
  {id:"snowboarding", name:"Snowboarding", muscle:"Cardio"},
  {id:"spider_curl_barbell", name:"Spider Curl (Barbell)", muscle:"Biceps"},
  {id:"spider_curl_dumbbell", name:"Spider Curl (Dumbbell)", muscle:"Biceps"},
  {id:"spiderman", name:"Spiderman", muscle:"Core"},
  {id:"spinning", name:"Spinning", muscle:"Cardio"},
  {id:"split_jerk", name:"Split Jerk", muscle:"Full Body"},
  {id:"split_squat_dumbbell", name:"Split Squat (Dumbbell)", muscle:"Quadriceps"},
  {id:"sprints", name:"Sprints", muscle:"Cardio"},
  {id:"squat_band", name:"Squat (Band)", muscle:"Quadriceps"},
  {id:"squat_bodyweight", name:"Squat (Bodyweight)", muscle:"Quadriceps"},
  {id:"squat_dumbbell", name:"Squat (Dumbbell)", muscle:"Quadriceps"},
  {id:"stair_machine_steps", name:"Stair Machine (Steps)", muscle:"Cardio"},
  {id:"standing_cable_glute_kickbacks", name:"Standing Cable Glute Kickbacks", muscle:"Glutes"},
  {id:"standing_calf_raise_barbell", name:"Standing Calf Raise (Barbell)", muscle:"Calves"},
  {id:"standing_calf_raise_dumbbell", name:"Standing Calf Raise (Dumbbell)", muscle:"Calves", image:"exercise-images/standing_calf_raise_dumbbell.png"},
  {id:"standing_calf_raise_machine", name:"Standing Calf Raise (Machine)", muscle:"Calves", image:"exercise-images/standing_calf_raise_machine.png"},
  {id:"standing_calf_raise_smith", name:"Standing Calf Raise (Smith)", muscle:"Calves", image:"exercise-images/standing_calf_raise_smith.png"},
  {id:"standing_leg_curls", name:"Standing Leg Curls", muscle:"Hamstrings", image:"exercise-images/standing_leg_curls.png"},
  {id:"standing_military_press_barbell", name:"Standing Military Press (Barbell)", muscle:"Shoulders", image:"exercise-images/standing_military_press_barbell.png"},
  {id:"step_up", name:"Step Up", muscle:"Quadriceps", image:"exercise-images/step_up.png"},
  {id:"sternum_pull_up_gironda", name:"Sternum Pull up (Gironda)", muscle:"Back", image:"exercise-images/sternum_pull_up_gironda.png"},
  {id:"straight_arm_lat_pulldown_cable", name:"Straight Arm Lat Pulldown (Cable)", muscle:"Back"},
  {id:"straight_leg_deadlift", name:"Straight Leg Deadlift", muscle:"Hamstrings"},
  {id:"stretching", name:"Stretching", muscle:"Full Body"},
  {id:"sumo_deadlift", name:"Sumo Deadlift", muscle:"Hamstrings"},
  {id:"sumo_squat", name:"Sumo Squat", muscle:"Quadriceps"},
  {id:"sumo_squat_barbell", name:"Sumo Squat (Barbell)", muscle:"Quadriceps"},
  {id:"sumo_squat_dumbbell", name:"Sumo Squat (Dumbbell)", muscle:"Quadriceps"},
  {id:"sumo_squat_kettlebell", name:"Sumo Squat (Kettlebell)", muscle:"Quadriceps"},
  {id:"superman", name:"Superman", muscle:"Back"},
  {id:"swimming", name:"Swimming", muscle:"Cardio"},
  {id:"t_bar_row", name:"T Bar Row", muscle:"Back"},
  {id:"thruster_barbell", name:"Thruster (Barbell)", muscle:"Full Body"},
  {id:"thruster_kettlebell", name:"Thruster (Kettlebell)", muscle:"Full Body"},
  {id:"toe_touch", name:"Toe Touch", muscle:"Core"},
  {id:"toes_to_bar", name:"Toes to Bar", muscle:"Core"},
  {id:"torso_rotation", name:"Torso Rotation", muscle:"Core"},
  {id:"treadmill", name:"Treadmill", muscle:"Cardio"},
  {id:"triceps_dip_assisted", name:"Triceps Dip (Assisted)", muscle:"Triceps"},
  {id:"triceps_dip_weighted", name:"Triceps Dip (Weighted)", muscle:"Triceps"},
  {id:"triceps_extension_barbell", name:"Triceps Extension (Barbell)", muscle:"Triceps"},
  {id:"triceps_extension_cable", name:"Triceps Extension (Cable)", muscle:"Triceps"},
  {id:"triceps_extension_dumbbell", name:"Triceps Extension (Dumbbell)", muscle:"Triceps"},
  {id:"triceps_extension_machine", name:"Triceps Extension (Machine)", muscle:"Triceps"},
  {id:"triceps_extension_suspension", name:"Triceps Extension (Suspension)", muscle:"Triceps"},
  {id:"triceps_kickback_cable", name:"Triceps Kickback (Cable)", muscle:"Triceps"},
  {id:"triceps_kickback_dumbbell", name:"Triceps Kickback (Dumbbell)", muscle:"Triceps"},
  {id:"triceps_pressdown", name:"Triceps Pressdown", muscle:"Triceps"},
  {id:"triceps_rope_pushdown", name:"Triceps Rope Pushdown", muscle:"Triceps"},
  {id:"upright_row_barbell", name:"Upright Row (Barbell)", muscle:"Shoulders"},
  {id:"upright_row_cable", name:"Upright Row (Cable)", muscle:"Shoulders"},
  {id:"upright_row_dumbbell", name:"Upright Row (Dumbbell)", muscle:"Shoulders"},
  {id:"vertical_traction_machine", name:"Vertical Traction (Machine)", muscle:"Back"},
  {id:"waiter_curl_dumbbell", name:"Waiter Curl (Dumbbell)", muscle:"Biceps"},
  {id:"walking", name:"Walking", muscle:"Cardio"},
  {id:"walking_lunge", name:"Walking Lunge", muscle:"Quadriceps", image:"exercise-images/walking_lunge.png"},
  {id:"walking_lunge_dumbbell", name:"Walking Lunge (Dumbbell)", muscle:"Quadriceps"},
  {id:"walking_lunge_sandbag", name:"Walking Lunge (Sandbag)", muscle:"Quadriceps"},
  {id:"wall_ball", name:"Wall Ball", muscle:"Full Body"},
  {id:"wall_sit", name:"Wall Sit", muscle:"Quadriceps"},
  {id:"wide_pull_up", name:"Wide Pull Up", muscle:"Back"},
  {id:"wide_elbow_triceps_press", name:"Wide-Elbow Triceps Press", muscle:"Triceps"},
  {id:"wrist_roller", name:"Wrist Roller", muscle:"Forearms"},
];
const GYM_BY_WEEKDAY = {1:"push", 2:"pull", 3:"legs", 4:"kettlebell", 5:"push", 6:"legs", 0:"pull"};

const PRAYERS = [
  {id:"fajr", label:"Fajr"},
  {id:"dhuhr", label:"Dhuhr"},
  {id:"asr", label:"Asr"},
  {id:"maghrib", label:"Maghrib"},
  {id:"isha", label:"Isha"},
];

const PRAYER_TIMES_KEYS = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const PRAYER_CALC_METHODS = [
  {id:"3", label:"Muslim World League"},
  {id:"2", label:"ISNA (Amérique du Nord)"},
  {id:"4", label:"Umm Al-Qura (Mecque)"},
  {id:"5", label:"Égypte"},
  {id:"1", label:"Karachi"},
];

const HADITH_PREFIX = "قَالَ رَسُولُ اللَّهِ (ﷺ): ";

const DAILY_WISDOM = [
  {type:"aya", arabic:"لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", text:"Allah ne charge personne au-delà de sa capacité.", source:"Sourate Al-Baqara, 2:286"},
  {type:"hadith", arabic:HADITH_PREFIX+"إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", text:"Les actions ne valent que par les intentions.", source:"Rapporté par Al-Bukhari et Muslim"},
  {type:"aya", arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", text:"Certes, avec la difficulté il y a une facilité.", source:"Sourate Ash-Sharh, 94:6"},
  {type:"hadith", arabic:HADITH_PREFIX+"تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ", text:"Le sourire à ton frère est une aumône.", source:"Rapporté par At-Tirmidhi"},
  {type:"aya", arabic:"وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", text:"Quiconque place sa confiance en Allah, Il lui suffit.", source:"Sourate At-Talaq, 65:3"},
  {type:"hadith", arabic:HADITH_PREFIX+"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", text:"Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.", source:"Rapporté par Al-Bukhari"},
  {type:"aya", arabic:"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", text:"C'est par le rappel d'Allah que les cœurs se tranquillisent.", source:"Sourate Ar-Ra'd, 13:28"},
  {type:"hadith", arabic:HADITH_PREFIX+"لَا يَشْكُرُ اللَّهَ مَنْ لَا يَشْكُرُ النَّاسَ", text:"Celui qui ne remercie pas les gens ne remercie pas Allah.", source:"Rapporté par At-Tirmidhi"},
  {type:"aya", arabic:"ادْعُونِي أَسْتَجِبْ لَكُمْ", text:"Invoquez-Moi, Je vous répondrai.", source:"Sourate Ghafir, 40:60"},
  {type:"hadith", arabic:HADITH_PREFIX+"الطُّهُورُ شَطْرُ الْإِيمَانِ", text:"La propreté est la moitié de la foi.", source:"Rapporté par Muslim"},
  {type:"aya", arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", text:"Allah est avec les patients.", source:"Sourate Al-Baqara, 2:153"},
  {type:"hadith", arabic:HADITH_PREFIX+"يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا", text:"Facilitez et ne compliquez pas, annoncez la bonne nouvelle et ne repoussez pas les gens.", source:"Rapporté par Al-Bukhari"},
  {type:"aya", arabic:"وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنفَعُ الْمُؤْمِنِينَ", text:"Rappelle, car le rappel profite aux croyants.", source:"Sourate Adh-Dhariyat, 51:55"},
  {type:"hadith", arabic:HADITH_PREFIX+"لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ", text:"Le fort n'est pas celui qui terrasse les autres, mais celui qui se maîtrise en cas de colère.", source:"Rapporté par Al-Bukhari et Muslim"},
  {type:"aya", arabic:"لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", text:"Ne perdez pas espoir de la miséricorde d'Allah.", source:"Sourate Az-Zumar, 39:53"},
  {type:"hadith", arabic:HADITH_PREFIX+"لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", text:"Aucun de vous n'est vraiment croyant tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.", source:"Rapporté par Al-Bukhari et Muslim"},
  {type:"aya", arabic:"إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ", text:"La prière préserve de la turpitude et du blâmable.", source:"Sourate Al-Ankabut, 29:45"},
  {type:"hadith", arabic:HADITH_PREFIX+"الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", text:"La bonne parole est une aumône.", source:"Rapporté par Al-Bukhari et Muslim"},
  {type:"aya", arabic:"وَمَا كَانَ رَبُّكَ نَسِيًّا", text:"Et ton Seigneur n'oublie jamais rien.", source:"Sourate Maryam, 19:64"},
  {type:"hadith", arabic:HADITH_PREFIX+"إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ", text:"Allah est doux et aime la douceur en toute chose.", source:"Rapporté par Muslim"},
];

const CULTURE_TOPICS = {
  economie: { label:"Économie", rank:"01", day:"Lun · Mer",
    tasks:[
      {id:"lecture", label:"Article du jour", meta:"15 min", sub:`<a href="https://www.lemonde.fr/economie/" target="_blank" rel="noopener">Le Monde — Économie</a>`},
      {id:"resume", label:"Résumer l'article", meta:"10 min", sub:"3 idées clés"},
      {id:"note", label:"Prendre une note", meta:"5 min", sub:"Ce que j'ai retenu"},
    ],
    resources:[
      {label:"Média", value:`<a href="https://www.lemonde.fr/economie/" target="_blank" rel="noopener">Le Monde — Économie</a>`},
      {label:"Podcast", value:`<a href="https://www.radiofrance.fr/franceculture/podcasts/entendez-vous-l-eco" target="_blank" rel="noopener">Entendez-vous l'éco ?</a> (France Culture)`},
      {label:"Livre", value:"L'Économie pour les Nuls — pour poser les bases"},
    ]},
  geopolitique: { label:"Géopolitique", rank:"02", day:"Mar · Jeu",
    tasks:[
      {id:"podcast", label:"Podcast", meta:"20-30 min", sub:`<a href="https://www.arte.tv/fr/videos/RC-014036/le-dessous-des-cartes/" target="_blank" rel="noopener">Le Dessous des Cartes</a>`},
      {id:"resume", label:"Résumer le podcast", meta:"10 min", sub:"3 idées clés"},
      {id:"article", label:"Lire un article complémentaire", meta:"15 min", sub:"Approfondir le sujet"},
      {id:"note", label:"Prendre une note", meta:"5 min", sub:"Ce que j'ai retenu"},
    ],
    resources:[
      {label:"Média", value:`<a href="https://www.courrierinternational.com/" target="_blank" rel="noopener">Courrier International</a> + <a href="https://www.jeuneafrique.com/" target="_blank" rel="noopener">Jeune Afrique</a>`},
      {label:"Podcast", value:`<a href="https://www.arte.tv/fr/videos/RC-014036/le-dessous-des-cartes/" target="_blank" rel="noopener">Le Dessous des Cartes</a> (Arte)`},
      {label:"Livre", value:"Atlas géopolitique — Pascal Boniface"},
    ]},
  militaire: { label:"Militaire / Stratégie", rank:"03", day:"Ven",
    tasks:[
      {id:"lecture", label:"Lecture de fond", meta:"15-20 min", sub:`<a href="https://www.areion24.news/" target="_blank" rel="noopener">Areion24 / DSI</a>`},
      {id:"resume", label:"Résumer l'article", meta:"10 min", sub:"3 idées clés"},
      {id:"note", label:"Prendre une note", meta:"5 min", sub:"Ce que j'ai retenu"},
    ],
    resources:[
      {label:"Média", value:`<a href="https://www.areion24.news/" target="_blank" rel="noopener">Areion24 / DSI</a>`},
      {label:"Podcast", value:`<a href="https://www.irsem.fr/le-collimateur.html" target="_blank" rel="noopener">Le Collimateur</a> (IRSEM)`},
      {label:"Livre", value:"Stratégie — Lawrence Freedman"},
    ]},
  tech: { label:"Technologie", rank:"04", day:"Weekend",
    tasks:[
      {id:"veille", label:"Veille tech", meta:"15-20 min", sub:`<a href="https://techcrunch.com/" target="_blank" rel="noopener">TechCrunch</a>`},
      {id:"resume", label:"Résumer ce que j'ai lu", meta:"10 min", sub:"3 idées clés"},
      {id:"note", label:"Prendre une note", meta:"5 min", sub:"Ton expérience terrain (n8n, API Claude) compte comme veille active"},
    ],
    resources:[
      {label:"Média", value:`<a href="https://techcrunch.com/" target="_blank" rel="noopener">TechCrunch</a>`},
      {label:"Podcast", value:"Underscore_ — tech francophone"},
      {label:"Note", value:"Ton expérience terrain (n8n, API Claude) compte comme veille active"},
    ]},
};

const TOPIC_BY_WEEKDAY = {1:"economie", 2:"geopolitique", 3:"economie", 4:"geopolitique", 5:"militaire", 6:"tech", 0:"geopolitique"};

const LECTURE_TASKS = [
  {id:"lire", label:"Lire 15-20 min", meta:"15 min"},
  {id:"idee", label:"Noter une idée importante"},
  {id:"citation", label:"Citation du jour"},
];

/* ---------------- Storage ---------------- */

function todayKey(d = new Date()){
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

function loadHistory(){
  try{ return JSON.parse(localStorage.getItem(HISTORY_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveHistory(h){
  try{ localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }
  catch(e){ console.error("Erreur de sauvegarde", e); }
}

function emptyDay(d = new Date()){
  return {
    sport:{
      cardioType:"marche", cardioDistance:0, cardioDuration:0, cardioDone:false,
      extras:{},
      gymType: defaultGymType(d.getDay()), gymDone:false,
      gymLog:{},
    },
    cultureTopic: TOPIC_BY_WEEKDAY[d.getDay()],
    cultureDone:{},
    lecturePages:0,
    lectureDone:{},
    wird:{fajr:false, dhuhr:false, asr:false, maghrib:false, isha:false, coranDone:false, coranValue:0, dhikrMorning:0, dhikrEvening:0, fasting:false},
    freeTasks:[],
  };
}

function loadConfig(){
  try{
    const c = JSON.parse(localStorage.getItem(CONFIG_KEY));
    if(c) return c;
  }catch(e){}
  return {
    books:[{id:"b1", title:"Prisoners of Geography", author:"Tim Marshall", totalPages:300, notes:[]}],
    currentBookId:"b1",
    notes:[],
    weeklyGoal:"Comprendre l'inflation et ses impacts",
    cultureNotes:[],
    gymTypes: DEFAULT_GYM_TYPES.map(t => ({...t})),
    sportExtras: DEFAULT_SPORT_EXTRAS.map(t => ({...t})),
    sportOnHome: {cardio:true, gym:true},
    userName:"",
    userAge:"",
    userWeight:"",
    userHeight:"",
    wirdTrackMode:"hizb",
    prayerCalcMethod:"3",
    prayerLat:null,
    prayerLon:null,
    prayerLocationLabel:"",
    cultureQuotes:[],
    flashcards:[],
    weightLog:[],
    progressPhotos:[],
  };
}
function defaultGymType(weekday){
  const preferred = GYM_BY_WEEKDAY[weekday];
  if(config.gymTypes && config.gymTypes.some(t => t.id === preferred)) return preferred;
  return (config.gymTypes && config.gymTypes[0]) ? config.gymTypes[0].id : "";
}
function saveConfig(c){
  try{ localStorage.setItem(CONFIG_KEY, JSON.stringify(c)); }
  catch(e){ console.error("Erreur de sauvegarde", e); }
}

let history = loadHistory();
let config = loadConfig();
if(!config.gymTypes) config.gymTypes = DEFAULT_GYM_TYPES.map(t => ({...t}));
if(!config.sportExtras) config.sportExtras = DEFAULT_SPORT_EXTRAS.map(t => ({...t}));
config.sportExtras.forEach(e => { if(e.onHome === undefined) e.onHome = true; });
if(!config.sportOnHome) config.sportOnHome = {cardio:true, gym:true};
if(config.userName === undefined) config.userName = "";
if(config.userAge === undefined) config.userAge = "";
if(config.userWeight === undefined) config.userWeight = "";
if(config.userHeight === undefined) config.userHeight = "";
if(!config.wirdTrackMode) config.wirdTrackMode = "hizb";
if(!config.weightUnit) config.weightUnit = "kg";
if(!config.prayerCalcMethod) config.prayerCalcMethod = "3";
if(config.prayerLat === undefined) config.prayerLat = null;
if(config.prayerLon === undefined) config.prayerLon = null;
if(config.prayerLocationLabel === undefined) config.prayerLocationLabel = "";
config.gymTypes.forEach(t => { if(!t.exercises) t.exercises = []; });
function ensureDayShape(day){
  if(!day.sport) day.sport = emptyDay().sport;
  if(!day.sport.extras){
    day.sport.extras = day.sport.mobilityDone !== undefined ? {mobilite: day.sport.mobilityDone} : {};
    delete day.sport.mobilityDone;
  }
  if(!day.sport.gymLog) day.sport.gymLog = {};
  if(!day.wird) day.wird = {fajr:false, dhuhr:false, asr:false, maghrib:false, isha:false, coranDone:false, coranValue:0, dhikrMorning:0, dhikrEvening:0, fasting:false};
  if(day.wird.dhikrMorning === undefined) day.wird.dhikrMorning = 0;
  if(day.wird.dhikrEvening === undefined) day.wird.dhikrEvening = 0;
  if(day.wird.fasting === undefined) day.wird.fasting = false;
  return day;
}

const KEY = todayKey();
if(!history[KEY]) history[KEY] = emptyDay();
let viewKey = KEY;
let today = ensureDayShape(history[KEY]);
config.books.forEach(b => { if(!b.notes) b.notes = []; });
if(!config.cultureNotes) config.cultureNotes = [];
if(!config.cultureQuotes) config.cultureQuotes = [];
if(!config.flashcards) config.flashcards = [];
if(!config.weightLog) config.weightLog = [];
if(!config.progressPhotos) config.progressPhotos = [];

function persist(){
  history[viewKey] = today;
  saveHistory(history);
}

function switchViewDay(key){
  if(!history[key]){
    const [y,m,d] = key.split("-").map(Number);
    history[key] = emptyDay(new Date(y, m-1, d));
  }
  viewKey = key;
  today = ensureDayShape(history[key]);
  goto("today");
}

let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();
const lectureExpanded = {idee:false, citation:false};
const bookNotesExpanded = {};
const cultureExpanded = {};

/* ---------------- Router ---------------- */

function goto(page){
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.dataset.page === page));
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  if(page === "today") renderToday();
  if(page === "sport") renderSportPage();
  if(page === "culture") renderCulturePage();
  if(page === "lecture") renderLecturePage();
  if(page === "wird") renderWirdPage();
  if(page === "stats") renderStatsPage();
  if(page === "notes") renderNotesPage();
  if(page === "profil") renderProfilePage();
}

document.getElementById("nav").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-page]");
  if(btn) goto(btn.dataset.page);
});
document.querySelectorAll("[data-goto]").forEach(b => {
  b.addEventListener("click", () => goto(b.dataset.goto));
});

/* ---------------- Helpers ---------------- */

function checkItem(task, done, onToggle){
  const row = document.createElement("label");
  row.className = "check-item" + (done ? " done" : "");
  row.innerHTML = `
    <input type="checkbox" ${done ? "checked" : ""}>
    <span class="txt"><span class="t">${task.label}</span>${task.sub ? `<span class="s">${task.sub}</span>` : ""}</span>
    ${task.meta ? `<span class="meta">${task.meta}</span>` : ""}
  `;
  row.querySelector("input").addEventListener("change", (e) => {
    row.classList.toggle("done", e.target.checked);
    onToggle(e.target.checked);
  });
  return row;
}

function sportExtrasOf(sportRec){
  if(!sportRec) return {};
  if(sportRec.extras) return sportRec.extras;
  if(sportRec.mobilityDone !== undefined) return {mobilite: sportRec.mobilityDone};
  return {};
}

function dayHasCategory(rec, cat){
  if(!rec) return false;
  if(cat === "sport") return !!(rec.sport && (rec.sport.cardioDone || rec.sport.gymDone || Object.values(sportExtrasOf(rec.sport)).some(Boolean)));
  if(cat === "culture") return Object.values(rec.cultureDone||{}).some(Boolean);
  if(cat === "lecture") return Object.values(rec.lectureDone||{}).some(Boolean) || (rec.lecturePages||0) > 0;
  if(cat === "wird") return !!(rec.wird && (PRAYERS.some(p => rec.wird[p.id]) || rec.wird.coranDone));
  return false;
}

function countLifetimeDays(cat){
  return Object.values(history).filter(rec => dayHasCategory(rec, cat)).length;
}

function countLifetimeFasting(){
  return Object.values(history).filter(rec => rec.wird && rec.wird.fasting).length;
}

/* ---------------- Gamification: streaks, score, badges, heatmap ---------------- */

function currentStreak(cat){
  const d = new Date();
  if(!dayHasCategory(history[todayKey(d)], cat)) d.setDate(d.getDate()-1);
  let streak = 0;
  while(dayHasCategory(history[todayKey(d)], cat)){
    streak++;
    d.setDate(d.getDate()-1);
  }
  return streak;
}

function renderStreaks(){
  [["streakSport","sport"],["streakCulture","culture"],["streakLecture","lecture"],["streakWird","wird"]].forEach(([id,cat]) => {
    const el = document.getElementById(id);
    if(el) el.textContent = `🔥 ${currentStreak(cat)}j`;
  });
}

function gradeForPct(pct){
  if(pct >= 90) return "A";
  if(pct >= 75) return "B";
  if(pct >= 50) return "C";
  if(pct >= 25) return "D";
  return "F";
}

const BADGES = [
  {id:"first_book", icon:"📚", label:"Premier livre terminé", check:() => config.books.some(b => b.finished)},
  {id:"sport_50", icon:"🏋️", label:"50 séances de gym", target:50, progress:() => Object.values(history).filter(r => r.sport && r.sport.gymDone).length},
  {id:"sport_100", icon:"💪", label:"100 séances de gym", target:100, progress:() => Object.values(history).filter(r => r.sport && r.sport.gymDone).length},
  {id:"wird_30", icon:"🕌", label:"30 jours de prières complètes", target:30, progress:() => Object.values(history).filter(r => r.wird && PRAYERS.every(p => r.wird[p.id])).length},
  {id:"culture_50", icon:"🧠", label:"50 jours de culture", target:50, progress:() => countLifetimeDays("culture")},
  {id:"lecture_20", icon:"📖", label:"20 jours de lecture", target:20, progress:() => countLifetimeDays("lecture")},
  {id:"streak_7", icon:"🔥", label:"7 jours de suite (une catégorie)", target:7, progress:() => Math.max(currentStreak("sport"), currentStreak("culture"), currentStreak("lecture"), currentStreak("wird"))},
  {id:"fasting_10", icon:"🌙", label:"10 jours de jeûne", target:10, progress:() => countLifetimeFasting()},
];

function badgeStatus(b){
  if(b.check) return {done: b.check(), current:null, target:null};
  const current = Math.min(b.progress(), b.target);
  return {done: current >= b.target, current, target: b.target};
}

function renderBadges(){
  const wrap = document.getElementById("badgesGrid");
  if(!wrap) return;
  wrap.innerHTML = "";
  BADGES.forEach(b => {
    const s = badgeStatus(b);
    const el = document.createElement("div");
    el.className = "badge-card" + (s.done ? " unlocked" : "");
    el.innerHTML = `
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-label">${b.label}</div>
      ${s.target !== null ? `<div class="badge-progress">${s.current}/${s.target}</div>` : `<div class="badge-progress">${s.done ? "Débloqué" : "À débloquer"}</div>`}
    `;
    wrap.appendChild(el);
  });
}

function renderHeatmap(){
  const wrap = document.getElementById("heatmapGrid");
  if(!wrap) return;
  wrap.innerHTML = "";
  const totalDays = 371;
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (totalDays - 1));
  start.setDate(start.getDate() - start.getDay());
  const cellCount = Math.ceil(((end - start) / 86400000 + 1) / 7) * 7;
  for(let i=0;i<cellCount;i++){
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const cell = document.createElement("div");
    if(d > end){
      cell.className = "heatmap-cell heatmap-empty";
    }else{
      const key = todayKey(d);
      const rec = history[key];
      const level = rec ? ["sport","culture","lecture","wird"].filter(c => dayHasCategory(rec, c)).length : 0;
      cell.className = "heatmap-cell heatmap-lv"+level;
      cell.title = `${key} : ${level}/4`;
    }
    wrap.appendChild(cell);
  }
}

function last7Dates(){
  const arr = [];
  for(let i=6;i>=0;i--){
    const d = new Date();
    d.setDate(d.getDate()-i);
    arr.push(todayKey(d));
  }
  return arr;
}

/* ---------------- Render: Today ---------------- */

function renderGreeting(){
  document.getElementById("greeting").textContent = config.userName ? `Bonjour ${config.userName} 👋` : "Bonjour 👋";
  const editBtn = document.getElementById("editNameBtn");
  editBtn.style.display = config.userName ? "none" : "";
  editBtn.textContent = "✏️ Ajouter mon prénom";
  const [y,m,d] = viewKey.split("-").map(Number);
  const viewDate = new Date(y, m-1, d);
  document.getElementById("todayDate").textContent = DAY_NAMES[viewDate.getDay()] + " " + viewDate.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});

  const banner = document.getElementById("viewingBanner");
  if(viewKey !== KEY){
    banner.style.display = "flex";
    banner.querySelector(".viewing-text").textContent = `Tu modifies l'historique du ${viewDate.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}`;
  }else{
    banner.style.display = "none";
  }
}
document.getElementById("editNameBtn").addEventListener("click", () => {
  const v = prompt("Ton prénom :", config.userName || "");
  if(v !== null){
    config.userName = v.trim();
    saveConfig(config);
    renderGreeting();
  }
});
document.getElementById("backToTodayBtn").addEventListener("click", () => switchViewDay(KEY));

function populateSelect(sel, options, value){
  sel.innerHTML = options.map(o => `<option value="${o.id}">${o.label}</option>`).join("");
  sel.value = value;
}

function renderSportChecklist(container){
  container.innerHTML = "";
  const s = today.sport;
  if(!s.extras) s.extras = {};
  const onHomeExtras = config.sportExtras.filter(e => e.onHome);
  let any = false;

  if(config.sportOnHome.cardio){
    any = true;
    const cardioWrap = document.createElement("div");
    cardioWrap.className = "sport-item" + (s.cardioDone ? " done" : "");
    const cardioLabel = document.createElement("label");
    cardioLabel.className = "check-item" + (s.cardioDone ? " done" : "");
    cardioLabel.innerHTML = `<input type="checkbox" ${s.cardioDone?"checked":""}><span class="txt"><span class="t">Marche / Footing matinal</span></span>`;
    cardioLabel.querySelector("input").addEventListener("change", (e) => {
      s.cardioDone = e.target.checked; persist(); renderSportEverywhere();
    });
    cardioWrap.appendChild(cardioLabel);

    const cardioDetail = document.createElement("div");
    cardioDetail.className = "sport-item-detail";
    const typeSel = document.createElement("select");
    typeSel.innerHTML = `<option value="marche">Marche</option><option value="footing">Footing</option>`;
    typeSel.value = s.cardioType;
    typeSel.addEventListener("change", (e) => { s.cardioType = e.target.value; persist(); });
    const distInput = document.createElement("input");
    distInput.type = "number"; distInput.min = "0"; distInput.step = "0.1"; distInput.value = s.cardioDistance;
    distInput.addEventListener("change", (e) => { s.cardioDistance = Math.max(0, parseFloat(e.target.value)||0); persist(); });
    const durInput = document.createElement("input");
    durInput.type = "number"; durInput.min = "0"; durInput.value = s.cardioDuration;
    durInput.addEventListener("change", (e) => { s.cardioDuration = Math.max(0, parseInt(e.target.value)||0); persist(); });
    cardioDetail.append(typeSel, distInput, document.createTextNode(" km"), durInput, document.createTextNode(" min"));
    cardioWrap.appendChild(cardioDetail);
    container.appendChild(cardioWrap);
  }

  onHomeExtras.forEach(extra => {
    any = true;
    const doneVal = !!s.extras[extra.id];
    const wrap = document.createElement("div");
    wrap.className = "sport-item" + (doneVal ? " done" : "");
    const label = document.createElement("label");
    label.className = "check-item" + (doneVal ? " done" : "");
    label.innerHTML = `<input type="checkbox" ${doneVal?"checked":""}><span class="txt"><span class="t">${extra.label}</span></span>`;
    label.querySelector("input").addEventListener("change", (e) => {
      s.extras[extra.id] = e.target.checked; persist(); renderSportEverywhere();
    });
    wrap.appendChild(label);
    container.appendChild(wrap);
  });

  if(config.sportOnHome.gym){
    any = true;
    const gymWrap = document.createElement("div");
    gymWrap.className = "sport-item" + (s.gymDone ? " done" : "");
    const gymLabel = document.createElement("label");
    gymLabel.className = "check-item" + (s.gymDone ? " done" : "");
    gymLabel.innerHTML = `<input type="checkbox" ${s.gymDone?"checked":""}><span class="txt"><span class="t">Séance gym</span></span>`;
    gymLabel.querySelector("input").addEventListener("change", (e) => {
      s.gymDone = e.target.checked; persist(); renderSportEverywhere();
    });
    gymWrap.appendChild(gymLabel);

    const gymDetail = document.createElement("div");
    gymDetail.className = "sport-item-detail";
    const gymSel = document.createElement("select");
    gymSel.innerHTML = config.gymTypes.map(t => `<option value="${t.id}">${t.label}</option>`).join("");
    gymSel.value = s.gymType;
    gymSel.addEventListener("change", (e) => { s.gymType = e.target.value; persist(); });
    gymDetail.appendChild(gymSel);
    gymWrap.appendChild(gymDetail);
    container.appendChild(gymWrap);
  }

  if(!any){
    container.innerHTML = `<p class="day-empty">Aucune routine ajoutée à l'accueil. Va dans <b>Sport</b> pour en ajouter.</p>`;
  }
}

function sportCounts(){
  const s = today.sport;
  const onHomeExtras = config.sportExtras.filter(e => e.onHome);
  const total = (config.sportOnHome.cardio?1:0) + (config.sportOnHome.gym?1:0) + onHomeExtras.length;
  const done = [
    config.sportOnHome.cardio && s.cardioDone,
    config.sportOnHome.gym && s.gymDone,
    ...onHomeExtras.map(e => s.extras && s.extras[e.id]),
  ].filter(Boolean).length;
  return {done, total};
}

function renderSportProgress(){
  const {done, total} = sportCounts();
  const bar = document.getElementById("sportProgBar");
  const txt = document.getElementById("sportProgTxt");
  const caption = document.getElementById("sportObjectiveCaption");
  if(total === 0){
    if(caption) caption.textContent = "Va dans Sport pour ajouter des routines à l'accueil";
    if(bar) bar.style.width = "0%";
    if(txt) txt.textContent = "Aucune routine";
    return;
  }
  if(caption) caption.textContent = `Objectif : ${total} case${total>1?"s":""} à cocher`;
  if(bar) bar.style.width = Math.round(done/total*100)+"%";
  if(txt) txt.textContent = `${done}/${total}`;
}

function renderSportEverywhere(){
  const cardContainer = document.getElementById("sportChecklist");
  if(cardContainer) renderSportChecklist(cardContainer);
  renderSportProgress();
  renderProgress();
  renderPills();
}

function renderPrayerRow(container){
  container.innerHTML = "";
  PRAYERS.forEach(p => {
    const done = !!today.wird[p.id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "prayer-pill" + (done ? " done" : "");
    btn.textContent = p.label;
    btn.addEventListener("click", () => {
      today.wird[p.id] = !today.wird[p.id];
      persist();
      renderWirdEverywhere();
    });
    container.appendChild(btn);
  });
}

function renderCoranItem(container){
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "sport-item" + (today.wird.coranDone ? " done" : "");
  const label = document.createElement("label");
  label.className = "check-item" + (today.wird.coranDone ? " done" : "");
  label.innerHTML = `<input type="checkbox" ${today.wird.coranDone?"checked":""}><span class="txt"><span class="t">Lecture du Coran</span></span>`;
  label.querySelector("input").addEventListener("change", (e) => {
    today.wird.coranDone = e.target.checked; persist(); renderWirdEverywhere();
  });
  wrap.appendChild(label);

  const detail = document.createElement("div");
  detail.className = "sport-item-detail";
  const input = document.createElement("input");
  input.type = "number"; input.min = "0";
  input.value = today.wird.coranValue || 0;
  input.addEventListener("change", () => {
    today.wird.coranValue = Math.max(0, parseInt(input.value)||0); persist();
  });
  const unitLabel = document.createTextNode(config.wirdTrackMode === "hizb" ? " Hizb" : " page");
  detail.append(input, unitLabel);
  wrap.appendChild(detail);
  container.appendChild(wrap);
}

function wirdDoneCount(){
  return PRAYERS.filter(p => today.wird[p.id]).length + (today.wird.coranDone ? 1 : 0);
}

function wirdCounts(){
  return {done: wirdDoneCount(), total: PRAYERS.length + 1};
}

function renderWirdProgress(){
  const {done, total} = wirdCounts();
  const bar = document.getElementById("wirdProgBar");
  const txt = document.getElementById("wirdProgTxt");
  const caption = document.getElementById("wirdObjectiveCaption");
  if(caption) caption.textContent = `Objectif : ${total} cases à cocher`;
  if(bar) bar.style.width = Math.round(done/total*100)+"%";
  if(txt) txt.textContent = `${done}/${total}`;
}

function renderWirdEverywhere(){
  const prayerRow = document.getElementById("prayerRow");
  if(prayerRow) renderPrayerRow(prayerRow);
  const coranChecklist = document.getElementById("coranChecklist");
  if(coranChecklist) renderCoranItem(coranChecklist);
  const prayerPageBody = document.getElementById("prayerPageBody");
  if(prayerPageBody) renderPrayerRow(prayerPageBody);
  const coranPageBody = document.getElementById("coranPageBody");
  if(coranPageBody) renderCoranItem(coranPageBody);
  renderWirdProgress();
  renderDailyWisdom();
  renderDhikrCounters();
  renderFastingToggle();
  renderProgress();
  renderPills();
}

function renderWirdPage(){
  renderWirdEverywhere();
  const modeSel = document.getElementById("wirdModeSelect");
  modeSel.value = config.wirdTrackMode;
  modeSel.onchange = () => {
    config.wirdTrackMode = modeSel.value;
    saveConfig(config);
    renderWirdEverywhere();
  };
  renderPrayerTimesBlock();
}

/* ---------------- Sagesse du jour (Aya / Hadith) ---------------- */

function dayOfYear(d){
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}

function todayWisdom(){
  return DAILY_WISDOM[dayOfYear(new Date()) % DAILY_WISDOM.length];
}

function renderDailyWisdom(){
  const w = todayWisdom();
  const badge = w.type === "aya" ? "📖 Aya du jour" : "🕋 Hadith du jour";
  [{ar:"wisdomHomeArabic", txt:"wisdomHomeText", src:"wisdomHomeSource", badge:"wisdomHomeBadge"},
   {ar:"wisdomPageArabic", txt:"wisdomPageText", src:"wisdomPageSource", badge:"wisdomPageBadge"}].forEach(ids => {
    const arEl = document.getElementById(ids.ar);
    const txtEl = document.getElementById(ids.txt);
    const srcEl = document.getElementById(ids.src);
    const badgeEl = document.getElementById(ids.badge);
    if(arEl) arEl.textContent = w.arabic || "";
    if(txtEl) txtEl.textContent = `« ${w.text} »`;
    if(srcEl) srcEl.textContent = w.source;
    if(badgeEl) badgeEl.textContent = badge;
  });
}

/* ---------------- Dhikr counters ---------------- */

function renderDhikrCounters(){
  const morningEl = document.getElementById("dhikrMorningCount");
  const eveningEl = document.getElementById("dhikrEveningCount");
  if(!morningEl || !eveningEl) return;
  morningEl.textContent = today.wird.dhikrMorning || 0;
  eveningEl.textContent = today.wird.dhikrEvening || 0;

  document.getElementById("dhikrMorningPlus").onclick = () => {
    today.wird.dhikrMorning = (today.wird.dhikrMorning || 0) + 1; persist(); renderDhikrCounters();
  };
  document.getElementById("dhikrMorningReset").onclick = () => {
    today.wird.dhikrMorning = 0; persist(); renderDhikrCounters();
  };
  document.getElementById("dhikrEveningPlus").onclick = () => {
    today.wird.dhikrEvening = (today.wird.dhikrEvening || 0) + 1; persist(); renderDhikrCounters();
  };
  document.getElementById("dhikrEveningReset").onclick = () => {
    today.wird.dhikrEvening = 0; persist(); renderDhikrCounters();
  };
}

/* ---------------- Suivi du jeûne ---------------- */

function renderFastingToggle(){
  const checkbox = document.getElementById("fastingCheckbox");
  if(!checkbox) return;
  checkbox.checked = !!today.wird.fasting;
  checkbox.onchange = (e) => {
    today.wird.fasting = e.target.checked; persist(); renderFastingToggle();
    const pill = document.getElementById("pillFasting");
    if(pill) pill.textContent = countLifetimeFasting();
  };
}

/* ---------------- Horaires de prière ---------------- */

function prayerDateStr(d){
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

function cleanPrayerTime(raw){
  return (raw || "").split(" ")[0];
}

async function fetchPrayerTimesRaw(dateStr, lat, lon, method){
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${method}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error("Erreur réseau");
  const data = await res.json();
  const t = data.data.timings;
  const out = {};
  PRAYER_TIMES_KEYS.forEach(k => { out[k] = cleanPrayerTime(t[k]); });
  return out;
}

async function getPrayerTimesForDate(dateStr, lat, lon, method){
  const cacheKey = `zdash:prayerTimes:${dateStr}:${lat}:${lon}:${method}`;
  try{
    const cached = JSON.parse(localStorage.getItem(cacheKey));
    if(cached) return cached;
  }catch(e){}
  const times = await fetchPrayerTimesRaw(dateStr, lat, lon, method);
  try{ localStorage.setItem(cacheKey, JSON.stringify(times)); }catch(e){}
  return times;
}

let prayerCountdownInterval = null;
let prayerTimesTodayCache = null;

function computeNextPrayer(times){
  const now = new Date();
  const todayStr = now.toDateString();
  for(const key of PRAYER_TIMES_KEYS){
    const [h,m] = times[key].split(":").map(Number);
    const t = new Date(todayStr);
    t.setHours(h, m, 0, 0);
    if(t > now) return {name:key, at:t};
  }
  const [h,m] = times.Fajr.split(":").map(Number);
  const t = new Date(todayStr);
  t.setHours(h, m, 0, 0);
  t.setDate(t.getDate()+1);
  return {name:"Fajr", at:t};
}

function formatCountdown(ms){
  const totalMin = Math.max(0, Math.round(ms/60000));
  const h = Math.floor(totalMin/60);
  const m = totalMin%60;
  return h > 0 ? `${h}h${String(m).padStart(2,"0")}` : `${m} min`;
}

function updateNextPrayerCountdownText(){
  if(!prayerTimesTodayCache) return;
  const next = computeNextPrayer(prayerTimesTodayCache);
  const label = `Prochaine prière : ${next.name} dans ${formatCountdown(next.at - new Date())}`;
  ["nextPrayerLineHome","nextPrayerLinePage"].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = label;
  });
}

function renderPrayerTimesGrid(){
  const grid = document.getElementById("prayerTimesGrid");
  if(!grid || !prayerTimesTodayCache) return;
  grid.innerHTML = "";
  PRAYER_TIMES_KEYS.forEach(key => {
    const cell = document.createElement("div");
    cell.className = "prayer-time-cell";
    cell.innerHTML = `<div class="ptc-name">${key}</div><div class="ptc-time">${prayerTimesTodayCache[key]}</div>`;
    grid.appendChild(cell);
  });
}

function setPrayerStatus(msg){
  const el = document.getElementById("prayerLocationStatus");
  if(el) el.textContent = msg;
}

async function loadAndRenderPrayerTimes(){
  if(config.prayerLat === null || config.prayerLon === null){
    setPrayerStatus("Active ta position pour afficher les horaires de prière.");
    return;
  }
  setPrayerStatus(config.prayerLocationLabel || "Position enregistrée");
  try{
    const dateStr = prayerDateStr(new Date());
    prayerTimesTodayCache = await getPrayerTimesForDate(dateStr, config.prayerLat, config.prayerLon, config.prayerCalcMethod);
    renderPrayerTimesGrid();
    updateNextPrayerCountdownText();
    if(prayerCountdownInterval) clearInterval(prayerCountdownInterval);
    prayerCountdownInterval = setInterval(updateNextPrayerCountdownText, 30000);
  }catch(e){
    setPrayerStatus("Impossible de récupérer les horaires (vérifie ta connexion).");
  }
}

function requestPrayerLocation(){
  if(!navigator.geolocation){
    setPrayerStatus("La géolocalisation n'est pas disponible sur cet appareil.");
    return;
  }
  setPrayerStatus("Localisation en cours…");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      config.prayerLat = Number(pos.coords.latitude.toFixed(3));
      config.prayerLon = Number(pos.coords.longitude.toFixed(3));
      config.prayerLocationLabel = `Position : ${config.prayerLat}, ${config.prayerLon}`;
      saveConfig(config);
      loadAndRenderPrayerTimes();
    },
    () => { setPrayerStatus("Position refusée — active la localisation dans les réglages du navigateur."); },
    {timeout:10000}
  );
}

function renderPrayerTimesBlock(){
  const btn = document.getElementById("prayerLocationBtn");
  if(btn) btn.onclick = requestPrayerLocation;
  const methodSel = document.getElementById("prayerMethodSelect");
  if(methodSel){
    if(!methodSel.dataset.filled){
      PRAYER_CALC_METHODS.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id; opt.textContent = m.label;
        methodSel.appendChild(opt);
      });
      methodSel.dataset.filled = "1";
    }
    methodSel.value = config.prayerCalcMethod;
    methodSel.onchange = () => {
      config.prayerCalcMethod = methodSel.value;
      saveConfig(config);
      loadAndRenderPrayerTimes();
    };
  }
  loadAndRenderPrayerTimes();
}

function buildCultureItem(task, kind){
  const topicId = today.cultureTopic;
  if(!config.cultureNotes) config.cultureNotes = [];
  const existingNote = config.cultureNotes.find(n => n.topicId===topicId && n.taskId===task.id && n.date===todayKey());
  const doneToday = !!today.cultureDone[task.id];
  const expanded = cultureExpanded[task.id];

  const wrap = document.createElement("div");
  wrap.className = "sport-item" + (doneToday ? " done" : "");

  const header = document.createElement("div");
  header.className = "check-item note-item-head" + (doneToday ? " done" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = doneToday;
  checkbox.addEventListener("change", (e) => {
    today.cultureDone[task.id] = e.target.checked;
    persist();
    renderCultureCard();
    renderProgress();
    renderPills();
  });

  const labelArea = document.createElement("div");
  labelArea.className = "txt";
  labelArea.style.cursor = "pointer";
  labelArea.innerHTML = `<span class="t">${task.label}</span>${existingNote ? `<span class="s">Enregistré aujourd'hui — clique pour modifier</span>` : (task.sub ? `<span class="s">${task.sub}</span>` : "")}`;
  labelArea.addEventListener("click", () => {
    cultureExpanded[task.id] = !cultureExpanded[task.id];
    renderCultureCard();
  });

  const chevron = document.createElement("span");
  chevron.className = "note-chevron";
  chevron.style.cursor = "pointer";
  chevron.textContent = expanded ? "▾" : "▸";
  chevron.addEventListener("click", () => {
    cultureExpanded[task.id] = !cultureExpanded[task.id];
    renderCultureCard();
  });

  header.append(checkbox, labelArea, chevron);
  wrap.appendChild(header);

  if(expanded){
    const body = document.createElement("div");
    body.className = "note-item-body";
    const input = document.createElement(kind === "title" ? "input" : "textarea");
    if(kind === "title"){
      input.type = "text";
      input.placeholder = "Titre de l'article / podcast…";
    }else{
      input.rows = 3;
      input.placeholder = kind === "resume" ? "Écris ton résumé…" : "Écris ta note…";
    }
    if(existingNote) input.value = existingNote.text;
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Enregistrer";
    saveBtn.className = "note-save-btn";
    saveBtn.addEventListener("click", () => {
      const text = input.value.trim();
      if(!text) return;
      if(existingNote){
        existingNote.text = text;
      }else{
        config.cultureNotes.unshift({id:"cnote_"+Date.now(), topicId, taskId:task.id, kind, text, date:todayKey()});
      }
      saveConfig(config);
      today.cultureDone[task.id] = true;
      persist();
      cultureExpanded[task.id] = false;
      renderCultureCard();
      renderProgress();
      renderPills();
    });
    body.append(input, saveBtn);
    wrap.appendChild(body);
  }

  return wrap;
}

function renderCultureCard(){
  const sel = document.getElementById("topicSelect");
  populateSelect(sel, Object.keys(CULTURE_TOPICS).map(id => ({id, label:CULTURE_TOPICS[id].label})), today.cultureTopic);
  sel.onchange = () => {
    today.cultureTopic = sel.value;
    Object.keys(cultureExpanded).forEach(k => delete cultureExpanded[k]);
    persist(); renderCultureCard(); renderProgress();
  };

  const topic = CULTURE_TOPICS[today.cultureTopic];
  const list = document.getElementById("cultureChecklist");
  list.innerHTML = "";
  topic.tasks.forEach((t, i) => {
    if(i === 0){
      list.appendChild(buildCultureItem(t, "title"));
    }else if(t.id === "resume"){
      list.appendChild(buildCultureItem(t, "resume"));
    }else if(t.id === "note"){
      list.appendChild(buildCultureItem(t, "note"));
    }else{
      list.appendChild(checkItem(t, !!today.cultureDone[t.id], (checked) => {
        today.cultureDone[t.id] = checked; persist(); renderCultureCard(); renderProgress(); renderPills();
      }));
    }
  });
  const {done, total} = cultureCounts();
  document.getElementById("cultureObjectiveCaption").textContent = `Objectif : ${total} tâche${total>1?"s":""} à compléter`;
  document.getElementById("cultureProgTxt").textContent = `${done}/${total}`;
  document.getElementById("cultureProgBar").style.width = Math.round(done/total*100)+"%";
}

function cultureCounts(){
  const topic = CULTURE_TOPICS[today.cultureTopic];
  const total = topic.tasks.length;
  const done = topic.tasks.filter(t => today.cultureDone[t.id]).length;
  return {done, total};
}

function currentBook(){
  return config.books.find(b => b.id === config.currentBookId) || config.books[0];
}

function buildNoteItem(type, label){
  const book = currentBook();
  const existingNote = (book && book.notes) ? book.notes.find(n => n.type===type && n.date===todayKey()) : null;
  const doneToday = !!today.lectureDone[type];
  const expanded = lectureExpanded[type];

  const wrap = document.createElement("div");
  wrap.className = "sport-item" + (doneToday ? " done" : "");

  const header = document.createElement("div");
  header.className = "check-item note-item-head" + (doneToday ? " done" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = doneToday;
  checkbox.addEventListener("change", (e) => {
    today.lectureDone[type] = e.target.checked;
    persist();
    renderLectureCard();
    renderProgress();
    renderPills();
  });

  const labelArea = document.createElement("div");
  labelArea.className = "txt";
  labelArea.style.cursor = "pointer";
  labelArea.innerHTML = `<span class="t">${label}</span>${existingNote ? `<span class="s">Enregistré aujourd'hui — clique pour modifier</span>` : ""}`;
  labelArea.addEventListener("click", () => {
    lectureExpanded[type] = !lectureExpanded[type];
    renderLectureCard();
  });

  const chevron = document.createElement("span");
  chevron.className = "note-chevron";
  chevron.style.cursor = "pointer";
  chevron.textContent = expanded ? "▾" : "▸";
  chevron.addEventListener("click", () => {
    lectureExpanded[type] = !lectureExpanded[type];
    renderLectureCard();
  });

  header.append(checkbox, labelArea, chevron);
  wrap.appendChild(header);

  if(expanded){
    const body = document.createElement("div");
    body.className = "note-item-body";
    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.placeholder = type==="idee" ? "Écris ton idée…" : "Écris la citation…";
    if(existingNote) textarea.value = existingNote.text;
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Enregistrer";
    saveBtn.className = "note-save-btn";
    saveBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      if(!text) return;
      if(!book){ alert("Ajoute d'abord un livre dans ta bibliothèque."); return; }
      if(!book.notes) book.notes = [];
      if(existingNote){
        existingNote.text = text;
      }else{
        book.notes.unshift({id:"note_"+Date.now(), type, text, date:todayKey()});
      }
      saveConfig(config);
      today.lectureDone[type] = true;
      persist();
      lectureExpanded[type] = false;
      renderLectureCard();
      renderProgress();
      renderPills();
    });
    body.append(textarea, saveBtn);
    wrap.appendChild(body);
  }

  return wrap;
}

function renderLectureCard(){
  document.getElementById("lectureObjectiveCaption").textContent = "Livre actuel";
  const sel = document.getElementById("bookSelect");
  populateSelect(sel, config.books.map(b => ({id:b.id, label:b.title})), config.currentBookId);
  sel.onchange = () => { config.currentBookId = sel.value; lectureExpanded.idee = false; lectureExpanded.citation = false; saveConfig(config); renderLectureCard(); };

  const list = document.getElementById("lectureChecklist");
  list.innerHTML = "";
  list.appendChild(checkItem(LECTURE_TASKS[0], !!today.lectureDone.lire, (checked) => {
    today.lectureDone.lire = checked; persist(); renderProgress(); renderPills();
  }));
  list.appendChild(buildNoteItem("idee", "Noter une idée importante"));
  list.appendChild(buildNoteItem("citation", "Citation du jour"));

  const pagesRow = document.createElement("div");
  pagesRow.className = "check-item";
  pagesRow.style.cursor = "default";
  const book = currentBook();
  pagesRow.innerHTML = `
    <span class="txt"><span class="t">Avancement</span><span class="s">${today.lecturePages} / ${book ? book.totalPages : 0} pages</span></span>
  `;
  const input = document.createElement("input");
  input.type = "number"; input.min = "0"; input.value = today.lecturePages; input.style.width = "60px";
  input.addEventListener("change", () => {
    today.lecturePages = Math.max(0, parseInt(input.value)||0); persist(); renderLectureCard(); renderProgress();
  });
  pagesRow.appendChild(input);
  list.appendChild(pagesRow);

  const {done, total} = lectureCounts();
  document.getElementById("lectureProgTxt").textContent = `${done}/${total}`;
  document.getElementById("lectureProgBar").style.width = Math.round(done/total*100)+"%";
}

function lectureCounts(){
  const total = LECTURE_TASKS.length;
  const done = LECTURE_TASKS.filter(t => today.lectureDone[t.id]).length;
  return {done, total};
}

function renderCalendar(){
  const first = new Date(calYear, calMonth, 1);
  const startDow = (first.getDay()+6)%7; // Monday-first
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const daysInPrev = new Date(calYear, calMonth, 0).getDate();
  document.getElementById("calTitle").textContent = first.toLocaleDateString("fr-FR",{month:"long", year:"numeric"});

  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";
  ["L","M","M","J","V","S","D"].forEach(d => {
    const el = document.createElement("div"); el.className = "dow"; el.textContent = d; grid.appendChild(el);
  });

  const todayStr = todayKey();
  const cells = [];
  for(let i=startDow-1;i>=0;i--) cells.push({n:daysInPrev-i, other:true});
  for(let n=1;n<=daysInMonth;n++) cells.push({n, other:false});
  let nextN = 1;
  while(cells.length % 7 !== 0) cells.push({n:nextN++, other:true});

  cells.forEach(c => {
    const el = document.createElement("div");
    el.className = "day" + (c.other ? " other" : "");
    el.textContent = c.n;
    if(!c.other){
      const key = calYear+"-"+String(calMonth+1).padStart(2,"0")+"-"+String(c.n).padStart(2,"0");
      if(key === todayStr) el.classList.add("today");
      if(key === viewKey && viewKey !== todayStr) el.classList.add("viewing");
      const rec = history[key];
      if(rec && (dayHasCategory(rec,"sport") || dayHasCategory(rec,"culture") || dayHasCategory(rec,"lecture"))) el.classList.add("has-data");
      el.classList.add("clickable");
      el.addEventListener("click", () => switchViewDay(key));
    }
    grid.appendChild(el);
  });
}
document.getElementById("calPrev").addEventListener("click", () => { calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); });
document.getElementById("calNext").addEventListener("click", () => { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); });

function weeklyCatCount(cat){
  return last7Dates().filter(k => dayHasCategory(history[k], cat)).length;
}

function renderStatsMini(){
  const wrap = document.getElementById("statsMini");
  wrap.innerHTML = "";
  [["Sport","sport"],["Culture","culture"],["Lecture","lecture"]].forEach(([label,cat]) => {
    const n = weeklyCatCount(cat);
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<div class="stat-label"><span>${label}</span><span class="n">${n} / 7</span></div><div class="bar"><div class="bar-fill" style="width:${n/7*100}%"></div></div>`;
    wrap.appendChild(row);
  });
}

function renderPills(){
  document.getElementById("pillSport").textContent = countLifetimeDays("sport");
  document.getElementById("pillCulture").textContent = countLifetimeDays("culture");
  document.getElementById("pillLecture").textContent = countLifetimeDays("lecture");
  document.getElementById("pillWird").textContent = countLifetimeDays("wird");
  const pillFasting = document.getElementById("pillFasting");
  if(pillFasting) pillFasting.textContent = countLifetimeFasting();
  renderStreaks();
  renderStatsMini();
  renderCalendar();
}

function renderProgress(){
  const s = sportCounts(), c = cultureCounts(), l = lectureCounts(), w = wirdCounts();
  const total = s.total + c.total + l.total + w.total;
  const done = s.done + c.done + l.done + w.done;
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById("progressPct").textContent = pct+"%";
  document.getElementById("progressBar").style.width = pct+"%";
  document.getElementById("progressSub").textContent = `${done} / ${total} tâches complétées`;
  const gradeEl = document.getElementById("progressGrade");
  if(gradeEl) gradeEl.textContent = gradeForPct(pct);
}

function renderWeeklyGoal(){
  document.getElementById("weeklyGoalText").textContent = config.weeklyGoal;
}
document.getElementById("weeklyGoalBtn").addEventListener("click", () => {
  const v = prompt("Objectif de la semaine :", config.weeklyGoal);
  if(v !== null && v.trim()){ config.weeklyGoal = v.trim(); saveConfig(config); renderWeeklyGoal(); }
});

document.getElementById("qaTask").addEventListener("click", () => {
  const v = prompt("Nouvelle tâche libre :");
  if(v && v.trim()){
    today.freeTasks.push({id:"free_"+Date.now(), label:v.trim(), done:false});
    persist();
    alert("Tâche ajoutée (visible dans la section Notes).");
    config.notes.unshift({id:"n_"+Date.now(), text:"Tâche libre : "+v.trim(), date:todayKey()});
    saveConfig(config);
  }
});
document.getElementById("qaNote").addEventListener("click", () => {
  const v = prompt("Nouvelle note :");
  if(v && v.trim()){
    config.notes.unshift({id:"n_"+Date.now(), text:v.trim(), date:todayKey()});
    saveConfig(config);
    goto("notes");
  }
});

function renderToday(){
  renderGreeting();
  renderSportChecklist(document.getElementById("sportChecklist"));
  renderSportProgress();
  renderCultureCard();
  renderLectureCard();
  renderWirdEverywhere();
  renderWeeklyGoal();
  renderProgress();
  renderPills();
}

/* ---------------- Sport: planification hebdo auto ---------------- */

const WEEKDAY_LABELS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];

function renderWeeklyPlan(){
  const wrap = document.getElementById("weeklyPlanGrid");
  if(!wrap) return;
  wrap.innerHTML = "";
  const todayWeekday = new Date().getDay();
  for(let i=0;i<7;i++){
    const gymId = GYM_BY_WEEKDAY[i];
    const gymType = config.gymTypes.find(t => t.id === gymId);
    const cell = document.createElement("div");
    cell.className = "plan-cell" + (i === todayWeekday ? " plan-today" : "");
    cell.innerHTML = `<div class="plan-day">${WEEKDAY_LABELS[i]}</div><div class="plan-type">${gymType ? gymType.label : "—"}</div>`;
    wrap.appendChild(cell);
  }
}

/* ---------------- Sport: timer de repos ---------------- */

let restTimerRemaining = 0;
let restTimerTotal = 0;
let restTimerInterval = null;

function restBeep(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }catch(e){}
  if(navigator.vibrate) navigator.vibrate([200,100,200]);
}

function updateRestTimerDisplay(){
  const el = document.getElementById("restTimerDisplay");
  if(!el) return;
  const m = Math.floor(Math.max(0,restTimerRemaining)/60);
  const s = Math.max(0,restTimerRemaining)%60;
  el.textContent = `${m}:${String(s).padStart(2,"0")}`;
  const bar = document.getElementById("restTimerBar");
  if(bar) bar.style.width = restTimerTotal ? Math.round((1 - restTimerRemaining/restTimerTotal)*100)+"%" : "0%";
}

function startRestTimer(seconds){
  clearInterval(restTimerInterval);
  restTimerRemaining = seconds;
  restTimerTotal = seconds;
  updateRestTimerDisplay();
  restTimerInterval = setInterval(() => {
    restTimerRemaining--;
    updateRestTimerDisplay();
    if(restTimerRemaining <= 0){
      clearInterval(restTimerInterval);
      restBeep();
    }
  }, 1000);
}
function pauseRestTimer(){ clearInterval(restTimerInterval); }
function resetRestTimer(){
  clearInterval(restTimerInterval);
  restTimerRemaining = 0; restTimerTotal = 0;
  updateRestTimerDisplay();
}
document.querySelectorAll("#restTimerPresets button[data-sec]").forEach(btn => {
  btn.addEventListener("click", () => startRestTimer(parseInt(btn.dataset.sec)));
});
document.getElementById("restTimerCustomBtn").addEventListener("click", () => {
  const v = parseInt(document.getElementById("restTimerCustomInput").value);
  if(v > 0) startRestTimer(v);
});
document.getElementById("restTimerPause").addEventListener("click", pauseRestTimer);
document.getElementById("restTimerReset").addEventListener("click", resetRestTimer);

/* ---------------- Sport: poids & IMC ---------------- */

function logWeightIfChanged(){
  if(!config.userWeight) return;
  const key = todayKey();
  const existing = config.weightLog.find(w => w.date === key);
  if(existing) existing.weight = config.userWeight;
  else config.weightLog.push({date:key, weight:config.userWeight});
  config.weightLog.sort((a,b) => a.date.localeCompare(b.date));
  saveConfig(config);
}

function imcCategory(imc){
  if(imc < 18.5) return "Insuffisance pondérale";
  if(imc < 25) return "Corpulence normale";
  if(imc < 30) return "Surpoids";
  return "Obésité";
}

function renderWeightImc(){
  const wrap = document.getElementById("weightImcBlock");
  if(!wrap) return;
  const weight = parseFloat(config.userWeight);
  const heightCm = parseFloat(config.userHeight);
  const imcEl = document.getElementById("imcValue");
  const imcCatEl = document.getElementById("imcCategory");
  if(weight && heightCm){
    const h = heightCm/100;
    const imc = weight / (h*h);
    imcEl.textContent = imc.toFixed(1);
    imcCatEl.textContent = imcCategory(imc);
  }else{
    imcEl.textContent = "—";
    imcCatEl.textContent = "Renseigne poids et taille dans Infos personnelles";
  }
  renderWeightChart();
}

function svgLineChart(container, points, unit){
  if(points.length < 2){
    container.innerHTML = `<p class="empty">Pas encore assez de données pour un graphique.</p>`;
    return;
  }
  const w = 600, h = 140, pad = 24;
  const values = points.map(p => p.value);
  const min = Math.min(...values), max = Math.max(...values);
  const range = (max - min) || 1;
  const stepX = (w - pad*2) / (points.length - 1);
  const coords = points.map((p,i) => ({
    x: pad + i*stepX,
    y: h - pad - ((p.value - min)/range) * (h - pad*2),
  }));
  const line = coords.map(c => `${c.x},${c.y}`).join(" ");
  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" class="weight-chart">
      <polyline class="weight-line" points="${line}"/>
      ${coords.map((c,i) => `<circle class="weight-dot" cx="${c.x}" cy="${c.y}" r="2.5"><title>${points[i].label} : ${points[i].value}${unit||""}</title></circle>`).join("")}
    </svg>
    <div class="chart-range"><span>${min}${unit||""}</span><span>${max}${unit||""}</span></div>
  `;
}

function renderWeightChart(){
  const wrap = document.getElementById("weightChartSvg");
  if(!wrap) return;
  const log = config.weightLog.slice(-30);
  svgLineChart(wrap, log.map(l => ({label:l.date, value:l.weight})), "kg");
}

/* ---------------- Sport: historique des charges ---------------- */

function loggedExerciseIds(){
  const ids = new Set();
  Object.values(history).forEach(rec => {
    if(!rec.sport || !rec.sport.gymLog) return;
    Object.values(rec.sport.gymLog).forEach(routineLog => {
      Object.keys(routineLog).forEach(exId => {
        if(routineLog[exId] && routineLog[exId].length) ids.add(exId);
      });
    });
  });
  return [...ids];
}

function exerciseSessionHistory(exId){
  const sessions = [];
  Object.keys(history).sort().forEach(dateKey => {
    const rec = history[dateKey];
    if(!rec.sport || !rec.sport.gymLog) return;
    let maxWeight = 0, found = false;
    Object.values(rec.sport.gymLog).forEach(routineLog => {
      const sets = routineLog[exId];
      if(sets && sets.length){
        found = true;
        sets.forEach(s => { maxWeight = Math.max(maxWeight, s.weight || 0); });
      }
    });
    if(found) sessions.push({date:dateKey, maxWeight});
  });
  return sessions;
}

let exerciseHistorySelectedId = null;

function renderExerciseHistoryUI(){
  const sel = document.getElementById("exerciseHistorySelect");
  const wrap = document.getElementById("exerciseHistoryChart");
  if(!sel || !wrap) return;
  const ids = loggedExerciseIds();
  if(!ids.length){
    sel.innerHTML = "";
    wrap.innerHTML = `<p class="empty">Ajoute des séries à un exercice pour voir sa progression ici.</p>`;
    return;
  }
  if(!exerciseHistorySelectedId || !ids.includes(exerciseHistorySelectedId)) exerciseHistorySelectedId = ids[0];
  sel.innerHTML = ids.map(id => {
    const ex = EXERCISE_LIBRARY.find(e => e.id === id);
    return `<option value="${id}" ${id===exerciseHistorySelectedId?"selected":""}>${ex ? ex.name : id}</option>`;
  }).join("");
  sel.onchange = () => { exerciseHistorySelectedId = sel.value; renderExerciseHistoryChart(); };
  renderExerciseHistoryChart();
}

function renderExerciseHistoryChart(){
  const wrap = document.getElementById("exerciseHistoryChart");
  const sessions = exerciseSessionHistory(exerciseHistorySelectedId).slice(-20);
  svgLineChart(wrap, sessions.map(s => ({label:s.date, value:s.maxWeight})), config.weightUnit);
}

/* ---------------- Sport: photos de progression ---------------- */

let progressPhotoCompareSelection = [];

async function renderProgressPhotos(){
  const grid = document.getElementById("progressPhotosGrid");
  if(!grid) return;
  grid.innerHTML = "";
  if(!config.progressPhotos.length){
    grid.innerHTML = `<p class="empty">Aucune photo de progression pour le moment.</p>`;
    renderPhotoCompare();
    return;
  }
  for(const meta of config.progressPhotos.slice().reverse()){
    const blob = await getPhoto(meta.id);
    if(!blob) continue;
    const url = URL.createObjectURL(blob);
    const cell = document.createElement("div");
    cell.className = "photo-cell" + (progressPhotoCompareSelection.includes(meta.id) ? " selected" : "");
    cell.innerHTML = `<img src="${url}" alt=""><div class="photo-date">${meta.date}</div>`;
    const del = document.createElement("button");
    del.type = "button"; del.className = "photo-del"; del.title = "Supprimer"; del.textContent = "✕";
    del.addEventListener("click", async (e) => {
      e.stopPropagation();
      await deletePhoto(meta.id);
      config.progressPhotos = config.progressPhotos.filter(p => p.id !== meta.id);
      progressPhotoCompareSelection = progressPhotoCompareSelection.filter(id => id !== meta.id);
      saveConfig(config);
      renderProgressPhotos();
    });
    cell.appendChild(del);
    cell.querySelector("img").addEventListener("click", () => {
      const idx = progressPhotoCompareSelection.indexOf(meta.id);
      if(idx >= 0) progressPhotoCompareSelection.splice(idx,1);
      else{
        if(progressPhotoCompareSelection.length >= 2) progressPhotoCompareSelection.shift();
        progressPhotoCompareSelection.push(meta.id);
      }
      renderProgressPhotos();
    });
    grid.appendChild(cell);
  }
  renderPhotoCompare();
}

async function renderPhotoCompare(){
  const wrap = document.getElementById("photoCompareWrap");
  if(!wrap) return;
  if(progressPhotoCompareSelection.length !== 2){
    wrap.innerHTML = "";
    return;
  }
  const [id1, id2] = progressPhotoCompareSelection;
  const [b1, b2] = await Promise.all([getPhoto(id1), getPhoto(id2)]);
  const m1 = config.progressPhotos.find(p => p.id === id1);
  const m2 = config.progressPhotos.find(p => p.id === id2);
  if(!b1 || !b2 || !m1 || !m2) return;
  wrap.innerHTML = `
    <div class="photo-compare">
      <div><img src="${URL.createObjectURL(b1)}"><div class="photo-date">${m1.date}</div></div>
      <div><img src="${URL.createObjectURL(b2)}"><div class="photo-date">${m2.date}</div></div>
    </div>
  `;
}

document.getElementById("progressPhotoInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const id = "photo_"+Date.now();
  await savePhoto(id, file);
  config.progressPhotos.push({id, date:todayKey()});
  saveConfig(config);
  e.target.value = "";
  renderProgressPhotos();
});

/* ---------------- Render: Sport page ---------------- */

function homeToggleBtn(isOn, onClick){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "home-toggle" + (isOn ? " on" : "");
  btn.textContent = isOn ? "✓ Sur l'accueil" : "+ Accueil";
  btn.title = isOn ? "Retirer de l'accueil" : "Ajouter à l'accueil";
  btn.addEventListener("click", onClick);
  return btn;
}

function renderSportPage(){
  renderSportCatalog();
  renderExtrasManager();
  renderGymManager();
  renderWeeklyPlan();
  renderWeightImc();
  renderExerciseHistoryUI();
  renderProgressPhotos();
}

function renderSportCatalog(){
  const wrap = document.getElementById("sportPageBody");
  if(!wrap) return;
  wrap.innerHTML = "";

  const cardioRow = document.createElement("div");
  cardioRow.className = "manage-row";
  cardioRow.innerHTML = `<span class="manage-label">Marche / Footing matinal</span>`;
  cardioRow.appendChild(homeToggleBtn(config.sportOnHome.cardio, () => {
    config.sportOnHome.cardio = !config.sportOnHome.cardio;
    saveConfig(config);
    renderSportCatalog();
    renderSportEverywhere();
  }));
  wrap.appendChild(cardioRow);

  const gymRow = document.createElement("div");
  gymRow.className = "manage-row";
  gymRow.innerHTML = `<span class="manage-label">Séance gym</span>`;
  gymRow.appendChild(homeToggleBtn(config.sportOnHome.gym, () => {
    config.sportOnHome.gym = !config.sportOnHome.gym;
    saveConfig(config);
    renderSportCatalog();
    renderSportEverywhere();
  }));
  wrap.appendChild(gymRow);
}

function renderExtrasManager(){
  const wrap = document.getElementById("extrasManager");
  if(!wrap) return;
  wrap.innerHTML = "";
  config.sportExtras.forEach(extra => {
    const row = document.createElement("div");
    row.className = "manage-row";
    row.innerHTML = `<span class="manage-label">${extra.label}</span>`;
    row.appendChild(homeToggleBtn(!!extra.onHome, () => {
      extra.onHome = !extra.onHome;
      saveConfig(config);
      renderExtrasManager();
      renderSportEverywhere();
    }));
    const editBtn = document.createElement("button");
    editBtn.type = "button"; editBtn.textContent = "✏️"; editBtn.title = "Renommer";
    editBtn.addEventListener("click", () => {
      const v = prompt("Nom de la routine :", extra.label);
      if(v && v.trim()){ extra.label = v.trim(); saveConfig(config); renderExtrasManager(); renderSportEverywhere(); }
    });
    const delBtn = document.createElement("button");
    delBtn.type = "button"; delBtn.textContent = "✕"; delBtn.title = "Supprimer";
    delBtn.addEventListener("click", () => {
      config.sportExtras = config.sportExtras.filter(x => x.id !== extra.id);
      saveConfig(config);
      delete today.sport.extras[extra.id];
      persist();
      renderExtrasManager(); renderSportEverywhere();
    });
    row.append(editBtn, delBtn);
    wrap.appendChild(row);
  });
  const addBtn = document.createElement("button");
  addBtn.type = "button"; addBtn.className = "add-btn"; addBtn.textContent = "+ Ajouter une routine";
  addBtn.addEventListener("click", () => {
    const v = prompt("Nom de la nouvelle routine :");
    if(v && v.trim()){
      config.sportExtras.push({id:"extra_"+Date.now(), label:v.trim(), onHome:false});
      saveConfig(config);
      renderExtrasManager(); renderSportEverywhere();
    }
  });
  wrap.appendChild(addBtn);
}

const gymRoutineExpanded = {};

function routineLogFor(routineId){
  if(!today.sport.gymLog[routineId]) today.sport.gymLog[routineId] = {};
  return today.sport.gymLog[routineId];
}

function renderGymManager(){
  const wrap = document.getElementById("gymManager");
  if(!wrap) return;
  wrap.innerHTML = "";
  config.gymTypes.forEach(t => {
    const expanded = !!gymRoutineExpanded[t.id];

    const card = document.createElement("div");
    card.className = "gym-routine-card";

    const head = document.createElement("div");
    head.className = "manage-row gym-routine-head";
    const label = document.createElement("span");
    label.className = "manage-label";
    label.style.cursor = "pointer";
    label.textContent = `${t.label}${t.exercises.length ? ` (${t.exercises.length} exo${t.exercises.length>1?"s":""})` : ""}`;
    label.addEventListener("click", () => {
      gymRoutineExpanded[t.id] = !gymRoutineExpanded[t.id];
      renderGymManager();
    });
    head.appendChild(label);

    const editBtn = document.createElement("button");
    editBtn.type = "button"; editBtn.textContent = "✏️"; editBtn.title = "Renommer";
    editBtn.addEventListener("click", () => {
      const v = prompt("Nom de la routine :", t.label);
      if(v && v.trim()){ t.label = v.trim(); saveConfig(config); renderGymManager(); renderSportEverywhere(); }
    });
    const delBtn = document.createElement("button");
    delBtn.type = "button"; delBtn.textContent = "✕"; delBtn.title = "Supprimer";
    delBtn.addEventListener("click", () => {
      config.gymTypes = config.gymTypes.filter(x => x.id !== t.id);
      saveConfig(config);
      if(today.sport.gymType === t.id){
        today.sport.gymType = config.gymTypes[0] ? config.gymTypes[0].id : "";
        persist();
      }
      renderGymManager(); renderSportEverywhere();
    });
    const chevron = document.createElement("span");
    chevron.className = "note-chevron";
    chevron.style.cursor = "pointer";
    chevron.textContent = expanded ? "▾" : "▸";
    chevron.addEventListener("click", () => {
      gymRoutineExpanded[t.id] = !gymRoutineExpanded[t.id];
      renderGymManager();
    });
    head.append(editBtn, delBtn, chevron);
    card.appendChild(head);

    if(expanded){
      const body = document.createElement("div");
      body.className = "gym-routine-body";
      const routineLog = routineLogFor(t.id);

      if(!t.exercises.length){
        body.innerHTML = `<p class="day-empty">Aucun exercice dans cette routine.</p>`;
      }else{
        t.exercises.forEach(exId => {
          const ex = EXERCISE_LIBRARY.find(e => e.id === exId);
          if(!ex) return;
          if(!routineLog[exId]) routineLog[exId] = [];
          const sets = routineLog[exId];

          const exCard = document.createElement("div");
          exCard.className = "exercise-log-card";
          const exHead = document.createElement("div");
          exHead.className = "exercise-log-head";
          exHead.innerHTML = `<span class="exercise-log-name">${ex.name}</span>`;
          const rmExBtn = document.createElement("button");
          rmExBtn.type = "button"; rmExBtn.textContent = "✕"; rmExBtn.title = "Retirer de la routine";
          rmExBtn.addEventListener("click", () => {
            t.exercises = t.exercises.filter(id => id !== exId);
            saveConfig(config);
            renderGymManager();
          });
          exHead.appendChild(rmExBtn);
          exCard.appendChild(exHead);

          const setsWrap = document.createElement("div");
          setsWrap.className = "exercise-log-sets";
          sets.forEach((set, i) => {
            const setRow = document.createElement("div");
            setRow.className = "exercise-set-row";
            setRow.innerHTML = `<span class="set-n">Série ${i+1}</span>`;
            const repsInput = document.createElement("input");
            repsInput.type = "number"; repsInput.min = "0"; repsInput.placeholder = "reps"; repsInput.value = set.reps || "";
            repsInput.addEventListener("change", () => { set.reps = Math.max(0, parseInt(repsInput.value)||0); persist(); });
            const weightInput = document.createElement("input");
            weightInput.type = "number"; weightInput.min = "0"; weightInput.step = "0.5"; weightInput.placeholder = config.weightUnit; weightInput.value = set.weight || "";
            weightInput.addEventListener("change", () => { set.weight = Math.max(0, parseFloat(weightInput.value)||0); persist(); });
            const delSetBtn = document.createElement("button");
            delSetBtn.type = "button"; delSetBtn.textContent = "✕"; delSetBtn.title = "Supprimer la série";
            delSetBtn.addEventListener("click", () => {
              sets.splice(i, 1);
              persist();
              renderGymManager();
            });
            setRow.append(repsInput, weightInput, delSetBtn);
            setsWrap.appendChild(setRow);
          });
          exCard.appendChild(setsWrap);

          const addSetBtn = document.createElement("button");
          addSetBtn.type = "button"; addSetBtn.className = "add-btn"; addSetBtn.textContent = "+ Ajouter une série";
          addSetBtn.addEventListener("click", () => {
            sets.push({reps:0, weight:0});
            persist();
            renderGymManager();
          });
          exCard.appendChild(addSetBtn);

          body.appendChild(exCard);
        });
      }

      const addExBtn = document.createElement("button");
      addExBtn.type = "button"; addExBtn.className = "add-btn"; addExBtn.textContent = "+ Ajouter un exercice";
      addExBtn.addEventListener("click", () => openExercisePicker(t.id));
      body.appendChild(addExBtn);

      card.appendChild(body);
    }

    wrap.appendChild(card);
  });
  const addBtn = document.createElement("button");
  addBtn.type = "button"; addBtn.className = "add-btn"; addBtn.textContent = "+ Ajouter une routine";
  addBtn.addEventListener("click", () => {
    const v = prompt("Nom de la nouvelle routine de gym :");
    if(v && v.trim()){
      config.gymTypes.push({id:"gym_"+Date.now(), label:v.trim(), exercises:[]});
      saveConfig(config);
      renderGymManager(); renderSportEverywhere();
    }
  });
  wrap.appendChild(addBtn);

  const unitSel = document.getElementById("weightUnitSelect");
  if(unitSel && unitSel.dataset.wired !== "1"){
    unitSel.dataset.wired = "1";
    unitSel.value = config.weightUnit;
    unitSel.addEventListener("change", () => {
      config.weightUnit = unitSel.value;
      saveConfig(config);
      renderGymManager();
    });
  }
  if(unitSel) unitSel.value = config.weightUnit;
}

let exercisePickerTargetRoutineId = null;
function openExercisePicker(routineId){
  exercisePickerTargetRoutineId = routineId;
  document.getElementById("exerciseSearchInput").value = "";
  renderExercisePickerList("");
  document.getElementById("exercisePickerOverlay").classList.add("open");
  document.getElementById("exerciseSearchInput").focus();
}
function closeExercisePicker(){
  document.getElementById("exercisePickerOverlay").classList.remove("open");
  exercisePickerTargetRoutineId = null;
}
document.getElementById("exercisePickerClose").addEventListener("click", closeExercisePicker);
document.getElementById("exercisePickerOverlay").addEventListener("click", (e) => {
  if(e.target.id === "exercisePickerOverlay") closeExercisePicker();
});
document.getElementById("exerciseSearchInput").addEventListener("input", (e) => {
  renderExercisePickerList(e.target.value);
});

const exerciseVideoExpanded = {};
let exercisePickerQuery = "";

function renderExercisePickerList(query){
  if(query !== undefined) exercisePickerQuery = query;
  const wrap = document.getElementById("exercisePickerList");
  wrap.innerHTML = "";
  const q = exercisePickerQuery.trim().toLowerCase();
  const matches = EXERCISE_LIBRARY.filter(ex => !q || ex.name.toLowerCase().includes(q) || ex.muscle.toLowerCase().includes(q));
  if(!matches.length){
    wrap.innerHTML = `<p class="day-empty">Aucun exercice trouvé.</p>`;
    return;
  }
  matches.forEach(ex => {
    const rowWrap = document.createElement("div");
    rowWrap.className = "exercise-row-wrap";

    const row = document.createElement("div");
    row.className = "exercise-row";
    const photoSrc = ex.image || (ex.video ? `https://img.youtube.com/vi/${ex.video}/mqdefault.jpg` : null);
    const thumb = document.createElement(photoSrc ? "img" : "span");
    thumb.className = "exercise-row-thumb" + (photoSrc ? "" : " exercise-row-thumb-placeholder");
    if(photoSrc){
      thumb.src = photoSrc;
      thumb.alt = "";
      thumb.loading = "lazy";
    }else{
      thumb.textContent = MUSCLE_ICONS[ex.muscle] || "🏋️";
    }
    const info = document.createElement("div");
    info.className = "exercise-row-info";
    info.innerHTML = `<div class="exercise-row-name">${ex.name}</div><div class="exercise-row-muscle">${ex.muscle}</div>`;
    info.addEventListener("click", () => {
      const routine = config.gymTypes.find(t => t.id === exercisePickerTargetRoutineId);
      if(!routine) return;
      if(!routine.exercises.includes(ex.id)){
        routine.exercises.push(ex.id);
        saveConfig(config);
      }
      closeExercisePicker();
      renderGymManager();
    });
    const videoBtn = document.createElement("button");
    videoBtn.type = "button";
    videoBtn.className = "exercise-video-btn";
    videoBtn.textContent = exerciseVideoExpanded[ex.id] ? "✕" : "▶";
    videoBtn.title = "Voir une démo vidéo";
    videoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      exerciseVideoExpanded[ex.id] = !exerciseVideoExpanded[ex.id];
      renderExercisePickerList();
    });
    row.append(thumb, info, videoBtn);
    rowWrap.appendChild(row);

    if(exerciseVideoExpanded[ex.id]){
      const panel = document.createElement("div");
      panel.className = "exercise-video-panel";
      const src = ex.video
        ? `https://www.youtube.com/embed/${ex.video}?rel=0`
        : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(ex.name + " exercise short tutorial")}`;
      panel.innerHTML = `<iframe src="${src}" title="Démo : ${ex.name}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      rowWrap.appendChild(panel);
    }

    wrap.appendChild(rowWrap);
  });
}

/* ---------------- Render: Culture page ---------------- */

function renderCulturePage(){
  const wrap = document.getElementById("pillars");
  wrap.innerHTML = "";
  Object.values(CULTURE_TOPICS).forEach(p => {
    const el = document.createElement("div");
    el.className = "pillar";
    el.innerHTML = `
      <button class="pillar-head" aria-expanded="false">
        <span class="rank">${p.rank}</span>
        <span class="pillar-title">${p.label}</span>
        <span class="pillar-day">${p.day}</span>
        <span class="pillar-chevron">›</span>
      </button>
      <div class="pillar-inner">
        <dl class="pillar-content">
          ${p.resources.map(r => `<div class="resource"><dt>${r.label}</dt><dd>${r.value}</dd></div>`).join("")}
        </dl>
      </div>
    `;
    const head = el.querySelector(".pillar-head");
    const inner = el.querySelector(".pillar-inner");
    head.addEventListener("click", () => {
      const isOpen = el.classList.toggle("open");
      head.setAttribute("aria-expanded", String(isOpen));
      inner.style.maxHeight = isOpen ? inner.scrollHeight+"px" : "0px";
    });
    wrap.appendChild(el);
  });
  renderCultureHistory();
  renderCultureQuotes();
  renderFlashcardsList();
}

/* ---------------- Culture: historique des contenus ---------------- */

function renderCultureHistory(){
  const wrap = document.getElementById("cultureHistoryList");
  if(!wrap) return;
  wrap.innerHTML = "";
  const titleNotes = config.cultureNotes.filter(n => n.kind === "title").sort((a,b) => b.date.localeCompare(a.date));
  if(!titleNotes.length){ wrap.innerHTML = `<p class="empty">Aucun contenu enregistré pour le moment.</p>`; return; }
  titleNotes.forEach(n => {
    const topic = CULTURE_TOPICS[n.topicId];
    const el = document.createElement("div");
    el.className = "history-row";
    el.innerHTML = `
      <div class="history-main">
        <div class="history-title">${n.text}</div>
        <div class="history-meta">${n.date} · ${topic ? topic.label : ""}</div>
      </div>
      <div class="history-stars"></div>
    `;
    const starsWrap = el.querySelector(".history-stars");
    for(let i=1;i<=5;i++){
      const star = document.createElement("span");
      star.className = "star" + (i <= (n.rating||0) ? " filled" : "");
      star.textContent = "★";
      star.addEventListener("click", () => {
        n.rating = (n.rating === i) ? 0 : i;
        saveConfig(config);
        renderCultureHistory();
      });
      starsWrap.appendChild(star);
    }
    wrap.appendChild(el);
  });
}

/* ---------------- Culture: carnet de citations ---------------- */

function renderCultureQuotes(){
  const wrap = document.getElementById("cultureQuotesList");
  if(!wrap) return;
  wrap.innerHTML = "";
  if(!config.cultureQuotes.length){ wrap.innerHTML = `<p class="empty">Aucune citation enregistrée.</p>`; return; }
  config.cultureQuotes.slice().reverse().forEach(q => {
    const topic = CULTURE_TOPICS[q.topicId];
    const el = document.createElement("div");
    el.className = "quote-row";
    el.innerHTML = `
      <div class="quote-text">« ${q.text} »</div>
      <div class="quote-meta">${q.date}${topic ? " · "+topic.label : ""}</div>
    `;
    const del = document.createElement("button");
    del.type = "button"; del.className = "quote-del"; del.title = "Supprimer"; del.textContent = "✕";
    del.addEventListener("click", () => {
      config.cultureQuotes = config.cultureQuotes.filter(x => x.id !== q.id);
      saveConfig(config);
      renderCultureQuotes();
    });
    el.appendChild(del);
    wrap.appendChild(el);
  });
}

/* ---------------- Culture: flashcards / révision espacée ---------------- */

const LEITNER_INTERVALS = {1:1, 2:3, 3:7, 4:16, 5:35};

function addDaysToKey(dateKeyStr, n){
  const [y,m,d] = dateKeyStr.split("-").map(Number);
  const dt = new Date(y, m-1, d);
  dt.setDate(dt.getDate()+n);
  return todayKey(dt);
}

function dueFlashcards(){
  const key = todayKey();
  return config.flashcards.filter(c => c.nextReview <= key);
}

let flashcardReviewQueue = [];
let flashcardReviewIndex = 0;
let flashcardShowBack = false;

function startFlashcardReview(){
  flashcardReviewQueue = dueFlashcards();
  flashcardReviewIndex = 0;
  flashcardShowBack = false;
  renderFlashcardReview();
}

function renderFlashcardReview(){
  const panel = document.getElementById("flashcardReviewPanel");
  if(!panel) return;
  if(!flashcardReviewQueue.length || flashcardReviewIndex >= flashcardReviewQueue.length){
    panel.innerHTML = flashcardReviewQueue.length
      ? `<p class="empty">Révision terminée 🎉</p>`
      : `<p class="empty">Aucune carte à réviser aujourd'hui.</p>`;
    return;
  }
  const card = flashcardReviewQueue[flashcardReviewIndex];
  panel.innerHTML = `
    <div class="flashcard">
      <div class="flashcard-progress">${flashcardReviewIndex+1} / ${flashcardReviewQueue.length}</div>
      <div class="flashcard-face">${flashcardShowBack ? card.back : card.front}</div>
      ${flashcardShowBack ? "" : `<button type="button" id="flashcardRevealBtn">Afficher la réponse</button>`}
      ${flashcardShowBack ? `<div class="flashcard-grades">
        <button type="button" data-grade="hard">Difficile</button>
        <button type="button" data-grade="medium">Moyen</button>
        <button type="button" data-grade="easy">Facile</button>
      </div>` : ""}
    </div>
  `;
  if(!flashcardShowBack){
    document.getElementById("flashcardRevealBtn").onclick = () => { flashcardShowBack = true; renderFlashcardReview(); };
  }else{
    panel.querySelectorAll("[data-grade]").forEach(btn => {
      btn.onclick = () => {
        const grade = btn.dataset.grade;
        if(grade === "hard") card.box = 1;
        else if(grade === "easy") card.box = Math.min(5, card.box+1);
        card.nextReview = addDaysToKey(todayKey(), LEITNER_INTERVALS[card.box]);
        saveConfig(config);
        flashcardReviewIndex++;
        flashcardShowBack = false;
        renderFlashcardReview();
        renderFlashcardsList();
      };
    });
  }
}

function renderFlashcardsList(){
  const wrap = document.getElementById("flashcardsList");
  if(!wrap) return;
  wrap.innerHTML = "";
  if(!config.flashcards.length){ wrap.innerHTML = `<p class="empty">Aucune flashcard pour le moment.</p>`; }
  config.flashcards.forEach(c => {
    const topic = CULTURE_TOPICS[c.topicId];
    const isDue = c.nextReview <= todayKey();
    const el = document.createElement("div");
    el.className = "flashcard-row" + (isDue ? " due" : "");
    el.innerHTML = `
      <div class="fc-content">
        <div class="fc-front">${c.front}</div>
        <div class="fc-meta">${topic ? topic.label : ""} · ${isDue ? "à réviser" : "prochaine révision : "+c.nextReview}</div>
      </div>
    `;
    const del = document.createElement("button");
    del.type = "button"; del.className = "fc-del"; del.title = "Supprimer"; del.textContent = "✕";
    del.addEventListener("click", () => {
      config.flashcards = config.flashcards.filter(x => x.id !== c.id);
      saveConfig(config);
      renderFlashcardsList();
    });
    el.appendChild(del);
    wrap.appendChild(el);
  });
  const btn = document.getElementById("flashcardReviewBtn");
  if(btn) btn.textContent = `▶ Réviser (${dueFlashcards().length})`;
}

document.getElementById("flashcardAddBtn").addEventListener("click", () => {
  const frontInput = document.getElementById("flashcardFrontInput");
  const backInput = document.getElementById("flashcardBackInput");
  const front = frontInput.value.trim();
  const back = backInput.value.trim();
  if(!front || !back) return;
  config.flashcards.push({id:"fc_"+Date.now(), front, back, topicId:today.cultureTopic, box:1, nextReview:todayKey()});
  saveConfig(config);
  frontInput.value = ""; backInput.value = "";
  renderFlashcardsList();
});
document.getElementById("flashcardReviewBtn").addEventListener("click", startFlashcardReview);
document.getElementById("cultureQuoteAddBtn").addEventListener("click", () => {
  const input = document.getElementById("cultureQuoteInput");
  const text = input.value.trim();
  if(!text) return;
  config.cultureQuotes.push({id:"cq_"+Date.now(), text, topicId:today.cultureTopic, date:todayKey()});
  saveConfig(config);
  input.value = "";
  renderCultureQuotes();
});

/* ---------------- Render: Lecture page ---------------- */

function renderLecturePage(){
  const wrap = document.getElementById("booksList");
  wrap.innerHTML = "";
  if(!config.books.length){ wrap.innerHTML = `<p class="empty">Aucun livre pour le moment.</p>`; return; }
  config.books.forEach(b => {
    const isCurrent = b.id === config.currentBookId;
    const notes = b.notes || [];
    const expanded = !!bookNotesExpanded[b.id];

    const el = document.createElement("div");
    el.className = "book-card" + (isCurrent ? " current" : "");

    const top = document.createElement("div");
    top.className = "book-card-top";
    top.innerHTML = `
      <div class="b-info">
        <div class="b-title">${b.title}${isCurrent ? " · en cours" : ""}${b.finished ? " · ✓ terminé" : ""}</div>
        <div class="b-author">${b.author || ""} ${b.totalPages ? "— "+b.totalPages+" pages" : ""}</div>
      </div>
    `;
    if(!isCurrent){
      const btn = document.createElement("button");
      btn.textContent = "Lire maintenant";
      btn.addEventListener("click", () => { config.currentBookId = b.id; saveConfig(config); renderLecturePage(); });
      top.appendChild(btn);
    }
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Modifier";
    editBtn.addEventListener("click", () => {
      const title = prompt("Titre du livre :", b.title);
      if(!title || !title.trim()) return;
      const author = prompt("Auteur (optionnel) :", b.author || "");
      const pages = parseInt(prompt("Nombre de pages total :", b.totalPages || 0)) || 0;
      b.title = title.trim();
      b.author = (author || "").trim();
      b.totalPages = pages;
      saveConfig(config);
      renderLecturePage();
    });
    top.appendChild(editBtn);
    const finishBtn = document.createElement("button");
    finishBtn.textContent = b.finished ? "✓ Terminé" : "Marquer terminé";
    finishBtn.addEventListener("click", () => {
      b.finished = !b.finished;
      b.finishedDate = b.finished ? todayKey() : null;
      saveConfig(config);
      renderLecturePage();
      renderBadges();
    });
    top.appendChild(finishBtn);
    if(b.hasPdf){
      const readBtn = document.createElement("button");
      readBtn.textContent = "📖 Lire le PDF";
      readBtn.addEventListener("click", () => openPdfReader(b));
      top.appendChild(readBtn);
      const rmPdfBtn = document.createElement("button");
      rmPdfBtn.textContent = "🗑️ PDF";
      rmPdfBtn.title = "Supprimer le PDF";
      rmPdfBtn.addEventListener("click", async () => {
        await deletePdf(b.id);
        b.hasPdf = false;
        saveConfig(config);
        renderLecturePage();
      });
      top.appendChild(rmPdfBtn);
    }else{
      const uploadBtn = document.createElement("button");
      uploadBtn.textContent = "📄 Ajouter le PDF";
      uploadBtn.addEventListener("click", () => {
        pdfUploadTargetId = b.id;
        document.getElementById("pdfFileInput").click();
      });
      top.appendChild(uploadBtn);
    }
    const del = document.createElement("button");
    del.textContent = "Supprimer";
    del.addEventListener("click", () => {
      config.books = config.books.filter(x => x.id !== b.id);
      if(config.currentBookId === b.id) config.currentBookId = config.books[0] ? config.books[0].id : null;
      saveConfig(config);
      deletePdf(b.id);
      renderLecturePage();
    });
    top.appendChild(del);
    el.appendChild(top);

    const toggle = document.createElement("button");
    toggle.className = "book-notes-toggle";
    toggle.textContent = `${expanded ? "▾" : "▸"} ${notes.length} note${notes.length !== 1 ? "s" : ""}`;
    toggle.addEventListener("click", () => {
      bookNotesExpanded[b.id] = !bookNotesExpanded[b.id];
      renderLecturePage();
    });
    el.appendChild(toggle);

    if(expanded){
      if(!notes.length){
        const empty = document.createElement("p");
        empty.className = "book-notes-empty";
        empty.textContent = "Aucune note pour ce livre pour le moment.";
        el.appendChild(empty);
      }else{
        const list = document.createElement("div");
        list.className = "book-notes-list";
        notes.forEach(n => {
          const row = document.createElement("div");
          row.className = "book-note";
          row.innerHTML = `
            <span class="bn-icon">${n.type === "citation" ? "❝" : "💡"}</span>
            <span class="bn-body"><span class="bn-text"></span><span class="bn-date">${n.date}</span></span>
            <button class="bn-del" title="Supprimer">✕</button>
          `;
          row.querySelector(".bn-text").textContent = n.text;
          row.querySelector(".bn-del").addEventListener("click", () => {
            b.notes = b.notes.filter(x => x.id !== n.id);
            saveConfig(config);
            renderLecturePage();
          });
          list.appendChild(row);
        });
        el.appendChild(list);
      }
    }

    wrap.appendChild(el);
  });
}
document.getElementById("addBookBtn").addEventListener("click", () => {
  const title = prompt("Titre du livre :");
  if(!title || !title.trim()) return;
  const author = prompt("Auteur (optionnel) :") || "";
  const pages = parseInt(prompt("Nombre de pages total :","300")) || 0;
  const id = "b_"+Date.now();
  config.books.push({id, title:title.trim(), author:author.trim(), totalPages:pages});
  config.currentBookId = id;
  saveConfig(config);
  renderLecturePage();
});

let pdfUploadTargetId = null;
document.getElementById("pdfFileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if(!file || !pdfUploadTargetId) return;
  if(file.type !== "application/pdf"){ alert("Merci de choisir un fichier PDF."); return; }
  const book = config.books.find(b => b.id === pdfUploadTargetId);
  if(!book) return;
  await savePdf(book.id, file);
  book.hasPdf = true;
  saveConfig(config);
  pdfUploadTargetId = null;
  renderLecturePage();
});

async function openPdfReader(book){
  const blob = await getPdf(book.id);
  if(!blob){ alert("Aucun PDF trouvé pour ce livre."); return; }
  const url = URL.createObjectURL(blob);
  document.getElementById("pdfReaderTitle").textContent = book.title;
  document.getElementById("pdfFrame").src = url + "#view=FitH";
  goto("pdfreader");
}
document.getElementById("pdfReaderBack").addEventListener("click", () => {
  document.getElementById("pdfFrame").src = "";
  goto("lecture");
});
document.getElementById("pdfFullscreenBtn").addEventListener("click", () => {
  const frame = document.getElementById("pdfFrame");
  if(frame.requestFullscreen) frame.requestFullscreen();
});

/* ---------------- Render: Stats page ---------------- */

function renderStatsPage(){
  const wrap = document.getElementById("statsPageBody");
  wrap.innerHTML = "";

  const weekBlock = document.createElement("div");
  weekBlock.className = "routine-block";
  weekBlock.innerHTML = `<h3>Cette semaine</h3>`;
  [["Sport","sport"],["Culture","culture"],["Lecture","lecture"]].forEach(([label,cat]) => {
    const n = weeklyCatCount(cat);
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<div class="stat-label"><span>${label}</span><span class="n">${n} / 7 jours</span></div><div class="bar"><div class="bar-fill" style="width:${n/7*100}%"></div></div>`;
    weekBlock.appendChild(row);
  });
  wrap.appendChild(weekBlock);

  const lifeBlock = document.createElement("div");
  lifeBlock.className = "routine-block";
  lifeBlock.innerHTML = `<h3>Depuis le début</h3>`;
  const totalDays = Object.keys(history).length;
  [["🔥 Sport","sport"],["🧠 Culture","culture"],["📖 Lecture","lecture"]].forEach(([label,cat]) => {
    const n = countLifetimeDays(cat);
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<div class="stat-label"><span>${label}</span><span class="n">${n} jours</span></div>`;
    lifeBlock.appendChild(row);
  });
  const p = document.createElement("p");
  p.className = "card-sub"; p.style.marginTop = "8px";
  p.innerHTML = `<span class="caption">${totalDays} jour${totalDays>1?"s":""} suivi${totalDays>1?"s":""} au total</span>`;
  lifeBlock.appendChild(p);
  wrap.appendChild(lifeBlock);

  const heatBlock = document.createElement("div");
  heatBlock.className = "routine-block";
  heatBlock.innerHTML = `<h3>Heatmap d'activité</h3><div class="heatmap-grid" id="heatmapGrid"></div>`;
  wrap.appendChild(heatBlock);
  renderHeatmap();

  const badgeBlock = document.createElement("div");
  badgeBlock.className = "routine-block";
  badgeBlock.innerHTML = `<h3>Badges</h3><div class="badges-grid" id="badgesGrid"></div>`;
  wrap.appendChild(badgeBlock);
  renderBadges();
}

/* ---------------- Render: Notes page ---------------- */

function renderNotesPage(){
  const wrap = document.getElementById("notesList");
  wrap.innerHTML = "";
  if(!config.notes.length){ wrap.innerHTML = `<p class="empty">Aucune note pour le moment.</p>`; return; }
  config.notes.forEach(n => {
    const el = document.createElement("div");
    el.className = "note-card";
    el.innerHTML = `<div><span class="n-text"></span><span class="n-date">${n.date}</span></div><button title="Supprimer">✕</button>`;
    el.querySelector(".n-text").textContent = n.text;
    el.querySelector("button").addEventListener("click", () => {
      config.notes = config.notes.filter(x => x.id !== n.id);
      saveConfig(config); renderNotesPage();
    });
    wrap.appendChild(el);
  });
}
document.getElementById("addNoteBtn").addEventListener("click", () => {
  const v = prompt("Nouvelle note :");
  if(v && v.trim()){
    config.notes.unshift({id:"n_"+Date.now(), text:v.trim(), date:todayKey()});
    saveConfig(config);
    renderNotesPage();
  }
});

/* ---------------- Render: Infos personnelles ---------------- */

function renderProfilePage(){
  document.getElementById("profileName").value = config.userName || "";
  document.getElementById("profileAge").value = config.userAge || "";
  document.getElementById("profileWeight").value = config.userWeight || "";
  document.getElementById("profileHeight").value = config.userHeight || "";
}
document.getElementById("profileName").addEventListener("change", (e) => {
  config.userName = e.target.value.trim();
  saveConfig(config);
  renderGreeting();
});
document.getElementById("profileAge").addEventListener("change", (e) => {
  config.userAge = e.target.value ? Math.max(0, parseInt(e.target.value)||0) : "";
  saveConfig(config);
});
document.getElementById("profileWeight").addEventListener("change", (e) => {
  config.userWeight = e.target.value ? Math.max(0, parseFloat(e.target.value)||0) : "";
  saveConfig(config);
  logWeightIfChanged();
  renderWeightImc();
});
document.getElementById("profileHeight").addEventListener("change", (e) => {
  config.userHeight = e.target.value ? Math.max(0, parseInt(e.target.value)||0) : "";
  saveConfig(config);
  renderWeightImc();
});

/* ---------------- Theme ---------------- */

function initTheme(){
  const btn = document.getElementById("themeToggle");
  let theme = "light";
  try{
    const stored = localStorage.getItem(THEME_KEY);
    if(stored) theme = JSON.parse(stored);
  }catch(e){}
  applyTheme(theme);
  btn.addEventListener("click", () => {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    try{ localStorage.setItem(THEME_KEY, JSON.stringify(next)); }
    catch(e){ console.error("Erreur de sauvegarde du thème", e); }
  });
}
function applyTheme(theme){
  document.body.classList.toggle("dark", theme === "dark");
  document.getElementById("themeToggle").title = theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre";
}

/* ---------------- Init ---------------- */

renderToday();
initTheme();
loadAndRenderPrayerTimes();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(e => console.error("Échec d'enregistrement du service worker", e));
  });
}
