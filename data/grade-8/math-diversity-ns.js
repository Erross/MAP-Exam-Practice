const base={grade:8,subject:"math",provenance:"original-synthetic",alignmentStatus:"development-needs-clean-room",strand:"Number Sense",sessionEligibility:[1,2]};
export const BANK_G8_MATH_DIVERSITY_NS=[
{...base,id:"g8m-div-n001",standard:"8.NS.A.1.a",dok:1,itemType:"multiple_choice",points:1,prompt:"Which number is irrational?",options:["√11","0.45","-7/8","3.125"],scoring:{answer:"√11"},rationale:"11 is not a perfect square, so √11 is irrational."},
{...base,id:"g8m-div-n002",standard:"8.NS.A.1.a",dok:2,itemType:"multiple_choice",points:1,prompt:"Which number is rational?",options:["√49","√5","π","√13"],scoring:{answer:"√49"},rationale:"√49=7, an integer and therefore a rational number."},
{...base,id:"g8m-div-n003",standard:"8.NS.A.2",dok:2,itemType:"numeric_input",points:1,prompt:"Approximate √27 to the nearest tenth.",scoring:{answer:5.2,tolerance:0.05},rationale:"√27≈5.196, which rounds to 5.2."},
{...base,id:"g8m-div-n004",standard:"8.NS.A.2",dok:2,itemType:"numeric_input",points:1,prompt:"Approximate √82 to the nearest tenth.",scoring:{answer:9.1,tolerance:0.05},rationale:"√82≈9.055, which rounds to 9.1."},
{...base,id:"g8m-div-n005",standard:"8.NS.A.2",dok:2,itemType:"multiple_choice",points:1,prompt:"Between which two consecutive integers does √70 lie?",options:["8 and 9","7 and 8","9 and 10","6 and 7"],scoring:{answer:"8 and 9"},rationale:"64<70<81, so 8<√70<9."},
{...base,id:"g8m-div-n006",standard:"8.NS.A.2",dok:3,itemType:"multiple_choice",points:1,prompt:"Which value is closest to √40?",options:["6.3","5.4","7.1","8.2"],scoring:{answer:"6.3"},rationale:"√40≈6.325, so 6.3 is closest."}
];
