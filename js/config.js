export const PROGRAM = Object.freeze({
  id: "mo-map-grade-level",
  family: "map",
  program: "grade-level",
  jurisdiction: "Missouri",
  name: "Missouri MAP Grade-Level Practice",
  administrationBasis: "2025-2026",
  officialSourcesVerified: "2026-08-22",
  timingPolicy: "guideline",
  unofficial: true,
  deferredCapabilities: ["listening-audio", "human-scored-writing", "human-scored-constructed-response"]
});

const S = (id, label, guidelineMinutes, calculatorAllowed, options = {}) => Object.freeze({
  id, label, guidelineMinutes, timingPolicy: "guideline", calculatorAllowed,
  ...options
});

const elaSessions = {
  3: [S(1,"Session 1",[40,105],false),S(2,"Session 2",[25,55],false),S(3,"Session 3 — Listening",[15,35],false,{deferred:["listening-audio"]})],
  4: [S(1,"Session 1 — Passage + Writing",[100,130],false,{deferred:["human-scored-writing"]}),S(2,"Session 2",[40,90],false),S(3,"Session 3",[15,40],false),S(4,"Session 4 — Listening",[15,35],false,{deferred:["listening-audio"]})],
  5: [S(1,"Session 1",[45,95],false),S(2,"Session 2",[25,50],false),S(3,"Session 3 — Listening",[15,35],false,{deferred:["listening-audio"]})],
  6: [S(1,"Session 1",[40,95],false),S(2,"Session 2",[20,40],false),S(3,"Session 3 — Listening",[15,30],false,{deferred:["listening-audio"]})],
  7: [S(1,"Session 1",[40,80],false),S(2,"Session 2",[20,40],false),S(3,"Session 3 — Listening",[15,25],false,{deferred:["listening-audio"]})],
  8: [S(1,"Session 1 — Passage + Writing",[100,130],false,{deferred:["human-scored-writing"]}),S(2,"Session 2",[35,75],false),S(3,"Session 3",[15,30],false),S(4,"Session 4 — Listening",[15,25],false,{deferred:["listening-audio"]})]
};

const mathGuides = {3:[[30,55],[30,55],[15,30]],4:[[30,55],[30,55],[15,30]],5:[[35,60],[35,60],[15,30]],6:[[30,55],[30,55],[30,40]],7:[[30,55],[30,55],[30,40]],8:[[30,55],[30,55],[30,40]]};
const mathSessions = grade => mathGuides[grade].map((range,index)=>S(index+1,index===2?"Session 3 — Performance Event":`Session ${index+1}`,grade>=6,{performanceEvent:index===2,deferred:index===2?["human-scored-written-pe-parts"]:[]}));
const scienceSessions = grade => [S(1,"Session 1",grade===5?[60,80]:[55,75],true,{deferred:["human-scored-constructed-response"]}),S(2,"Session 2",grade===5?[60,80]:[55,75],true,{deferred:["human-scored-constructed-response"]})];

const assessments = {};
for (let grade=3; grade<=8; grade++) {
  assessments[`g${grade}-ela`] = Object.freeze({id:`g${grade}-ela`,grade,subject:"ela",label:`Grade ${grade} ELA`,points:grade===7?52:56,status:"draft",sessions:elaSessions[grade],fullSimulationAvailable:false});
  assessments[`g${grade}-math`] = Object.freeze({id:`g${grade}-math`,grade,subject:"math",label:`Grade ${grade} Mathematics`,points:grade<=5?48:54,status:"draft",sessions:mathSessions(grade),fullSimulationAvailable:false});
  if (grade===5 || grade===8) assessments[`g${grade}-science`] = Object.freeze({id:`g${grade}-science`,grade,subject:"science",label:`Grade ${grade} Science`,points:60,status:"draft",sessions:scienceSessions(grade),fullSimulationAvailable:false});
}

export const ASSESSMENTS = Object.freeze(assessments);
export const assessmentList = () => Object.values(ASSESSMENTS);
export const getAssessment = id => ASSESSMENTS[id] || null;

export const SUPPORTED_ITEM_TYPES = Object.freeze([
  "multiple_choice","multi_select","ebsr","dropdown","matching","drag_drop","hot_text","numeric_input","number_line","coordinate_point","coordinate_line","line_plot","bar_graph","clock_input","angle_input"
]);

export function sessionHasDeferredContent(session){ return Boolean(session?.deferred?.length); }
export function assessmentDeferredComponents(assessment){ return [...new Set(assessment.sessions.flatMap(s=>s.deferred||[]))]; }
