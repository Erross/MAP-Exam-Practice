// Browser-effective wording repairs for Grade 5 Science items whose semantic rewrite
// made the correct option uniquely and conspicuously longer than the distractors.
// The 25% tell gate stays unchanged; these edits preserve the assessed expectation.

export const G5_TELL_REPAIRS=Object.freeze({
  "g5s-003":{
    options:[
      "The plant gained 14 g of dry mass while the dry soil lost only 3 g.",
      "The plant was grown for six weeks even though growth time alone does not identify the source of the added matter.",
      "The pot contained soil at the beginning of the investigation but that fact does not compare material gains and losses.",
      "The students measured the plant at the end but did not use that fact alone to identify where added material came from."
    ],
    scoring:{answer:"The plant gained 14 g of dry mass while the dry soil lost only 3 g."}
  },
  "g5s-004":{
    options:[
      "The plant gained much more mass than the soil lost, so air and water supplied much of the added material.",
      "The soil lost some mass during growth, so soil alone must have supplied every gram of material added to the plant.",
      "The plant gained mass during the study, proving that plants can grow without taking in any material from air or water.",
      "The plant received light during growth, so the light itself must have become all of the plant's new matter."
    ],
    scoring:{answer:"The plant gained much more mass than the soil lost, so air and water supplied much of the added material."}
  },
  "g5s-011":{
    options:[
      "Matter can move from air and water into grass, through animals, and back through decomposition.",
      "Matter moves from grass into animals but is permanently lost from the ecosystem whenever an organism dies.",
      "Birds obtain all of the matter in their bodies directly from sunlight without eating plants or other organisms.",
      "Decomposers create brand-new matter from nothing and add it to the meadow whenever they break down dead material."
    ],
    scoring:{answer:"Matter can move from air and water into grass, through animals, and back through decomposition."}
  },
  "g5s-015":{
    options:[
      "water → algae → zooplankton → small fish",
      "sunlight → algae → zooplankton → small fish",
      "large fish → sunlight → water → zooplankton",
      "water → sunlight → decomposers → carbon dioxide"
    ],
    scoring:{answer:"water → algae → zooplankton → small fish"}
  },
  "g5s-016":{
    options:[
      "They return matter from wastes and dead organisms to the environment.",
      "They keep matter locked inside dead organisms so it cannot return to the environment for later use.",
      "They turn sunlight directly into fish tissue without using matter from water, air, or other organisms.",
      "They prevent matter from moving between living organisms and the nonliving parts of the pond ecosystem."
    ],
    scoring:{answer:"They return matter from wastes and dead organisms to the environment."}
  },
  "g5s-033":{
    options:[
      "The plant gained 15 g while the soil lost only 4 g.",
      "The plant was watered every day while its pot remained in the same classroom location throughout the study.",
      "The seedlings were identical at the start, which helps comparison but does not identify the source of added matter.",
      "The class recorded the measurements in a table, which organizes evidence but does not by itself identify material sources."
    ],
    scoring:{answer:"The plant gained 15 g while the soil lost only 4 g."}
  },
  "g5s-034":{
    options:[
      "Soil loss was too small to explain the plant's mass gain, supporting air and water as major material sources.",
      "Because soil mass decreased during the study, soil alone must have supplied all of the plant's additional dry mass.",
      "Because the plant received light during the study, sunlight alone must have become all of its additional dry matter.",
      "Because the plant's dry mass increased, the dry soil must also have increased by exactly the same amount."
    ],
    scoring:{answer:"Soil loss was too small to explain the plant's mass gain, supporting air and water as major material sources."}
  },
  "g5s-cap-010":{
    options:[
      "Repeat the study while measuring plant and soil dry mass and the water added.",
      "Repeat the study but record only leaf color and plant height, without measuring any changes in soil or plant mass.",
      "Change the plant type, soil amount, water amount, and light conditions at the same time in every repeated trial.",
      "Repeat the study without measuring plant mass, soil mass, or water so the material-source claim cannot be compared."
    ],
    scoring:{answer:"Repeat the study while measuring plant and soil dry mass and the water added."}
  },
  "g5s-div-a007":{
    options:[
      "The plant gained 13 g while the soil lost only 2 g.",
      "The plant was kept in the same pot for several weeks while students collected measurements at the end of the study.",
      "The pot began with 450 g of dry soil, which describes the starting amount but not the source of the added plant matter.",
      "Students used the same scale for measurements, which improves consistency but does not identify where the new matter came from."
    ],
    scoring:{answer:"The plant gained 13 g while the soil lost only 2 g."}
  },
  "g5s-div-a009":{
    options:[
      "The soil loss was too small to explain the plant's mass gain, supporting air and water as major sources.",
      "Because the soil lost some mass during growth, the soil must have supplied every gram of new plant material.",
      "Because the plant received light, the light alone must have changed directly into all of the plant's new matter.",
      "Because the plant gained dry mass, the evidence shows that water and air could not have supplied material for growth."
    ],
    scoring:{answer:"The soil loss was too small to explain the plant's mass gain, supporting air and water as major sources."}
  },
  "g5s-div-b004":{
    options:[
      "A new solid forms after the liquids are mixed.",
      "The liquids are measured carefully before they are mixed together.",
      "The cup is clear before mixing and remains the same shape afterward.",
      "Both liquids are stored at room temperature before the investigation begins."
    ],
    scoring:{answer:"A new solid forms after the liquids are mixed."}
  },
  "g5s-div-b007":{
    options:[
      "The tracer moves from plant leaves into caterpillars that ate them.",
      "The tracer remains only in the original leaves even after the caterpillars have eaten those leaves.",
      "Birds are observed flying above the study site without any tracer measurements being made in the birds.",
      "The plants receive sunlight during the day while the tracer remains unmeasured in every consumer."
    ],
    scoring:{answer:"The tracer moves from plant leaves into caterpillars that ate them."}
  },
  "g5s-div-b009":{
    options:[
      "Repeat the study and compare plant gain with soil loss again.",
      "Repeat the study but measure only plant height and leaf color without measuring changes in plant or soil mass.",
      "Change the plant species, soil amount, water amount, and container size together before comparing the new results.",
      "Repeat the study and record only the pot color while leaving plant and soil mass unmeasured."
    ],
    scoring:{answer:"Repeat the study and compare plant gain with soil loss again."}
  },
  "g5s-div-b011":{
    options:[
      "Plant gain exceeded soil loss, so soil was not the chief source of added material.",
      "Because the soil lost some mass, soil alone must have supplied all of the plant's added material during growth.",
      "Because the plant received light, the light alone must have become all of the new dry matter in the plant.",
      "Because the plant gained mass, the evidence shows that air and water supplied no material during the investigation."
    ],
    scoring:{answer:"Plant gain exceeded soil loss, so soil was not the chief source of added material."}
  },
  "g5s-div-b012":{
    options:[
      "Tracer in decomposers shows matter from organisms entering a pathway back toward the environment.",
      "Tracer in decomposers shows that decomposers destroy the matter from organisms so it cannot return to the environment.",
      "Tracer in decomposers proves that sunlight itself is matter that animals and decomposers can eat directly.",
      "Tracer in decomposers shows that matter moves only from predators to plants and never toward nonliving parts of the ecosystem."
    ],
    scoring:{answer:"Tracer in decomposers shows matter from organisms entering a pathway back toward the environment."}
  }
});

export const G5_TELL_REPAIR_IDS=Object.freeze(Object.keys(G5_TELL_REPAIRS));

export function applyG5ScienceTellRepairs(items){
  return items.map(item=>{
    const repair=G5_TELL_REPAIRS[item.id];
    if(!repair)return item;
    return {...item,...repair,answerTellReview:"balanced-after-semantic-repair"};
  });
}
