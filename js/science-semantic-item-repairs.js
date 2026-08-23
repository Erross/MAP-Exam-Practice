// Browser-effective prompt-level repairs for items whose original synthetic prompt
// did not actually measure the Missouri expectation named in its metadata.
// These are development repairs and must be consolidated into source bank files before release.

const plantMaterialA={id:"g5s-sem-plant-material-a",title:"Where Plant Material Comes From",text:"Students grow a seedling in a pot that begins with 500 g of dry soil. The plant begins with a dry mass of 4 g. For six weeks the plant receives light, open air, and measured water. At the end, the plant's dry mass is 18 g and the dry soil mass is 497 g."};
const pondMatter={id:"g5s-sem-pond-matter",title:"Matter in a Pond Food Web",text:"In a pond, algae use carbon dioxide, water, and light to grow. Zooplankton eat algae, small fish eat zooplankton, and larger fish eat small fish. Decomposers break down wastes and dead organisms, returning matter to the water and surrounding environment."};
const motionPattern={id:"g5s-sem-motion-pattern",title:"Predicting a Cart's Motion",text:"A toy cart moves along the same low-friction track under the same test conditions. Its position from the start line is 20 cm after 1 second, 40 cm after 2 seconds, and 60 cm after 3 seconds. Repeated trials show nearly the same pattern."};
const plantMaterialB={id:"g5s-sem-plant-material-b",title:"Plant and Soil Mass Evidence",text:"A class grows identical seedlings in pots. In a representative pot, the plant's dry mass increases from 5 g to 20 g. The dry soil mass decreases from 600 g to 596 g. The plant receives water and remains exposed to air and light throughout the investigation."};

export const G5_ITEM_REPAIRS=Object.freeze({
  "g5s-003":{
    stimulus:plantMaterialA,
    prompt:"Which evidence most strongly supports the claim that the plant's added material did not come chiefly from the soil?",
    options:["The plant gained 14 g of dry mass while the dry soil lost only 3 g.","The plant was grown for six weeks.","The pot contained soil at the beginning of the investigation.","The students measured the plant at the end of the investigation."],
    scoring:{answer:"The plant gained 14 g of dry mass while the dry soil lost only 3 g."},
    rationale:"The plant gained much more dry mass than the soil lost, so soil alone cannot account for most of the plant's added material; air and water are major material sources."
  },
  "g5s-004":{
    stimulus:plantMaterialA,
    prompt:"Which argument is best supported by the mass evidence?",
    options:["Because the plant gained far more mass than the soil lost while receiving water and air, much of its new material came from air and water rather than chiefly from soil.","Because the soil lost 3 g, all 14 g of new plant material must have come from soil alone.","The evidence proves that plants can grow without water or air.","The evidence shows that light itself became all of the plant's new matter."],
    scoring:{answer:"Because the plant gained far more mass than the soil lost while receiving water and air, much of its new material came from air and water rather than chiefly from soil."},
    rationale:"The comparison supports the Grade 5 claim that plants obtain the materials needed for growth chiefly from air and water."
  },
  "g5s-008":{
    prompt:"Students compare two liquids before and after mixing them. Match each observation with its role in deciding whether new substances formed.",
    pairs:[{key:"A",label:"Each liquid remains clear and at the same temperature while kept separate."},{key:"B",label:"A solid appears only after the liquids are mixed."},{key:"C",label:"The mixture changes temperature after mixing."}],
    choices:["comparison evidence before interaction","evidence of a new material after interaction","additional evidence that the interaction produced a change"],
    scoring:{matches:{A:"comparison evidence before interaction",B:"evidence of a new material after interaction",C:"additional evidence that the interaction produced a change"}},
    rationale:"Comparing properties before and after mixing helps determine whether combining substances produced new substances."
  },
  "g5s-011":{
    prompt:"A meadow model shows grass using matter from air and water, grasshoppers eating grass, birds eating grasshoppers, and decomposers breaking down wastes and dead organisms. Which statement best describes movement of matter in this system?",
    options:["Matter can move from the environment into grass, then into animals, and later return to the environment through wastes and decomposition.","Matter moves from grass to animals but disappears permanently when an organism dies.","Birds obtain all of their matter directly from sunlight without eating other organisms.","Decomposers create new matter from nothing and add it to the meadow."],
    scoring:{answer:"Matter can move from the environment into grass, then into animals, and later return to the environment through wastes and decomposition."},
    rationale:"The model traces matter among the environment, producers, consumers, and decomposers."
  },
  "g5s-015":{
    stimulus:pondMatter,
    prompt:"Which path correctly traces matter through part of the pond model?",
    options:["carbon dioxide and water → algae → zooplankton → small fish","sunlight → rock → small fish → algae","large fish → sunlight → water → zooplankton","water → sunlight → decomposers → carbon dioxide"],
    scoring:{answer:"carbon dioxide and water → algae → zooplankton → small fish"},
    rationale:"Algae incorporate matter from the environment, and that matter can then move through feeding relationships to consumers."
  },
  "g5s-016":{
    stimulus:pondMatter,
    prompt:"What role do decomposers play in the movement of matter shown by the pond model?",
    options:["They break down wastes and dead organisms so matter can return to the environment and be used again.","They permanently remove all matter from the pond.","They turn sunlight directly into fish without using matter from the environment.","They prevent matter from moving between organisms."],
    scoring:{answer:"They break down wastes and dead organisms so matter can return to the environment and be used again."},
    rationale:"Decomposition returns matter from organisms to nonliving parts of the ecosystem, supporting continued cycling."
  },
  "g5s-027":{
    stimulus:motionPattern,
    prompt:"If the repeated motion pattern continues under the same conditions, which position is the best prediction for the cart after 4 seconds?",
    options:["about 80 cm from the start","about 20 cm from the start","about 45 cm from the start","about 200 cm from the start"],
    scoring:{answer:"about 80 cm from the start"},
    rationale:"The measured pattern increases by about 20 cm each second, so the next predicted position is about 80 cm."
  },
  "g5s-028":{
    stimulus:motionPattern,
    prompt:"Based on the repeated motion pattern, predict the cart's position in centimeters after 5 seconds if the same conditions continue.",
    scoring:{answer:100,tolerance:0},
    rationale:"The cart's position increases by about 20 cm each second, giving a predicted position of 100 cm after 5 seconds."
  },
  "g5s-033":{
    stimulus:plantMaterialB,
    prompt:"Which measurement comparison is most useful as evidence about where the plant's added material came from?",
    options:["The plant gained 15 g of dry mass while the dry soil lost only 4 g.","The pot was used in a classroom.","The seedlings were identical at the start.","The class recorded the data in a table."],
    scoring:{answer:"The plant gained 15 g of dry mass while the dry soil lost only 4 g."},
    rationale:"The plant's mass gain is much larger than the soil's mass loss, which helps rule out soil as the chief source of added plant material."
  },
  "g5s-034":{
    stimulus:plantMaterialB,
    prompt:"Which conclusion is best supported by the evidence and the fact that the plant received water and air?",
    options:["The soil cannot account for most of the plant's added material, supporting the claim that plants obtain growth materials chiefly from air and water.","All 15 g of added plant mass came from the 4 g of soil that disappeared.","Plants make matter from sunlight alone and do not use water or air.","The plant's dry mass increase proves that soil mass must have increased by the same amount."],
    scoring:{answer:"The soil cannot account for most of the plant's added material, supporting the claim that plants obtain growth materials chiefly from air and water."},
    rationale:"The measured plant gain greatly exceeds soil loss, while water and air were available as material sources."
  },
  "g5s-035":{
    stimulus:plantMaterialB,
    prompt:"Enter the two mass changes, in grams: plant dry-mass gain first, then dry-soil mass loss.",
    fields:["plant mass gained","soil mass lost"],
    scoring:{answer:[15,4]},
    rationale:"Plant dry mass increased by 20-5=15 g; dry soil mass decreased by 600-596=4 g."
  },
  "g5s-036":{
    stimulus:plantMaterialB,
    prompt:"Which two observations support an argument that the plant's growth material came chiefly from air and water rather than soil? Select two.",
    options:["The plant gained 15 g while the soil lost only 4 g.","The plant received water and was exposed to air during growth.","The pot was kept in the classroom.","The soil began with a mass greater than the plant's mass."],
    scoring:{answers:["The plant gained 15 g while the soil lost only 4 g.","The plant received water and was exposed to air during growth."]},
    rationale:"The mass comparison shows soil cannot supply most of the added material, while water and air are documented material inputs."
  }
});

export const G5_ITEM_REPAIR_IDS=Object.freeze(Object.keys(G5_ITEM_REPAIRS));

export function applyG5ScienceItemRepairs(items){
  return items.map(item=>{
    const repair=G5_ITEM_REPAIRS[item.id];
    if(!repair)return item;
    return {...item,...repair,semanticPromptReview:"repaired-from-source-audit"};
  });
}
