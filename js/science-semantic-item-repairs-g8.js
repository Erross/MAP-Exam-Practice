// Browser-effective Grade 8 Science repairs for 6-8.ESS2.A.2.
// The expectation requires evidence-based explanation of geoscience surface change
// across varying time and spatial scales, not merely identification of erosion.

const streamScale={id:"g8s-sem-stream-scale",title:"Stream-Bank Model Across Scales",text:"Students run ten equal simulated rain events over 50 cm model streambanks tilted at the same angle. Bare soil loses 120 g, sparse grass loses 72 g, and dense grass loses 28 g of sediment. Each model sequence represents a short period of erosion at one small bank section. In real watersheds, flowing water acts along streambanks that extend hundreds of meters to many kilometers, and repeated floods over years can move sediment and reshape channels."};
const coastScale={id:"g8s-sem-coast-scale",title:"Coastal Erosion Across Scales",text:"Students run twenty equal model waves against 40 cm shoreline sections. Bare sand loses 145 g, scattered-root sand loses 86 g, and dense-root sand loses 39 g. The laboratory model represents a small shoreline during a short wave sequence. On real coasts, waves and storms act across beaches and bluffs from meters to kilometers wide, and repeated events over years to centuries can produce much larger shoreline changes."};
const riverScale={id:"g8s-sem-river-scale",title:"Riverbank Change Across Scales",text:"Researchers compare three 10 m riverbank sections during one season of similar flow. Bare Section A loses 180 kg of sediment, partly vegetated Section B loses 105 kg, and densely vegetated Section C loses 48 kg. A season is a short interval compared with the decades over which river channels develop. Similar erosion and sediment transport can occur along many kilometers of a river, so repeated local changes can accumulate into larger channel changes."};
const crSedimentScale={id:"g8s-sem-cr-sediment-scale",title:"From One Riverbank to a Changing Channel",text:"Three similar 10 m riverbank sections experience comparable flow during one season. A bare bank loses 210 kg of sediment, a partly vegetated bank loses 122 kg, and a densely vegetated bank loses 55 kg. Historical maps also show that over 25 years the river channel has shifted tens of meters in some reaches where erosion and deposition repeatedly occur. The mapped river reach is several kilometers long."};

export const G8_ITEM_REPAIRS=Object.freeze({
  "g8s-007":{
    stimulus:streamScale,
    prompt:"Which explanation best connects the model evidence to Earth-surface change at different scales?",
    options:[
      "Flowing water moves less sediment from the vegetated model banks, and repeated erosion can reshape much larger real streambanks over longer times.",
      "The model proves every real streambank loses exactly 120 g of sediment during every flood regardless of bank size or vegetation.",
      "Because the model is only 50 cm long, erosion in the model cannot represent a process that also acts on larger natural streambanks.",
      "The sediment moved only during a short model sequence, so flowing water cannot produce accumulated surface changes over many years."
    ],
    scoring:{answer:"Flowing water moves less sediment from the vegetated model banks, and repeated erosion can reshape much larger real streambanks over longer times."},
    rationale:"The model supplies short-term, small-scale evidence for erosion; the same geoscience process can accumulate across larger areas and longer times."
  },
  "g8s-008":{
    stimulus:streamScale,
    prompt:"The bare bank loses 92 g more sediment than the dense-grass bank in one ten-event model sequence. If that same difference occurred in 10 comparable sequences, how many grams would the accumulated difference be?",
    scoring:{answer:920,tolerance:0},
    rationale:"92 × 10 = 920 g. The calculation illustrates how a short-term measured difference can accumulate across repeated events."
  },
  "g8s-009":{
    stimulus:streamScale,
    prompt:"Why can a small model of sediment movement provide evidence about larger landscape change without claiming the model and real river are identical?",
    options:[
      "It represents the same erosion and transport processes that can repeat over longer times and across larger streambank areas.",
      "It proves that a 50 cm tray and a kilometer-long river must lose the same mass of sediment during every event.",
      "It shows that erosion occurs only in laboratory models and cannot operate along natural rivers or across long time periods.",
      "It demonstrates that spatial scale and elapsed time never affect how much surface change can accumulate in a watershed."
    ],
    scoring:{answer:"It represents the same erosion and transport processes that can repeat over longer times and across larger streambank areas."},
    rationale:"A model can represent the relevant process while scale and duration determine the amount and extent of accumulated change."
  },
  "g8s-div-a013":{
    stimulus:coastScale,
    prompt:"Which statement best uses the model evidence to explain coastal change across spatial and time scales?",
    options:[
      "Dense roots reduce sediment loss in the small model, while repeated waves and storms can accumulate erosion across much larger shorelines over years.",
      "The 40 cm model proves that every kilometer of real coastline must lose exactly the same number of grams during every storm.",
      "Because the test uses only twenty waves, its erosion process cannot represent any surface-changing process that acts over longer periods.",
      "The model shows that shoreline change happens only at laboratory scale and does not accumulate across wider coastal areas."
    ],
    scoring:{answer:"Dense roots reduce sediment loss in the small model, while repeated waves and storms can accumulate erosion across much larger shorelines over years."},
    rationale:"The measured small-scale pattern is evidence about a process that can operate repeatedly over broader coastal areas and longer times."
  },
  "g8s-div-a014":{
    stimulus:coastScale,
    prompt:"Bare sand loses 106 g more than dense-root sand during one twenty-wave sequence. If that same difference occurred across 10 comparable sequences, what accumulated difference would the model predict in grams?",
    scoring:{answer:1060,tolerance:0},
    rationale:"106 × 10 = 1,060 g, illustrating accumulation of a measured erosion difference over repeated short-term events."
  },
  "g8s-div-a015":{
    stimulus:coastScale,
    prompt:"Which explanation appropriately connects the laboratory shoreline to geoscience change on a real coast?",
    options:[
      "Wave-driven sediment movement seen in the model can repeat across larger shoreline areas and over many storms, producing accumulated coastal change.",
      "A laboratory shoreline and a natural coast are identical in size, so each must lose the same sediment mass during every wave sequence.",
      "Because the model lasts only twenty waves, it shows that coastal erosion cannot operate over years, decades, or larger spatial scales.",
      "The model indicates that vegetation changes wave energy into new matter, which is the main reason real coastlines change position over time."
    ],
    scoring:{answer:"Wave-driven sediment movement seen in the model can repeat across larger shoreline areas and over many storms, producing accumulated coastal change."},
    rationale:"The explanation uses the modeled erosion process while recognizing that natural shoreline change accumulates across greater time and spatial scales."
  },
  "g8s-div-b013":{
    stimulus:riverScale,
    prompt:"Which statement best explains how the one-season measurements can inform understanding of river change over larger scales?",
    options:[
      "The measured erosion differs with vegetation locally, and repeated local sediment movement can accumulate along kilometers of river over decades.",
      "One season of measurements proves every riverbank everywhere will lose exactly the same sediment mass during every future season.",
      "Because each measured section is only 10 m long, the erosion process cannot contribute to changes in a kilometer-scale river channel.",
      "The seasonal data show that erosion stops after one year, so longer time scales cannot produce additional river-surface change."
    ],
    scoring:{answer:"The measured erosion differs with vegetation locally, and repeated local sediment movement can accumulate along kilometers of river over decades."},
    rationale:"Short-term local measurements can provide evidence for a process whose repeated effects accumulate over larger reaches and longer periods."
  },
  "g8s-div-b014":{
    stimulus:riverScale,
    prompt:"Section A loses 132 kg more sediment than Section C in one season. If that same difference occurred for 10 comparable seasons, what accumulated difference would be predicted in kilograms?",
    scoring:{answer:1320,tolerance:0},
    rationale:"132 × 10 = 1,320 kg, illustrating how a seasonal local difference can accumulate over a longer time interval."
  },
  "g8s-div-b015":{
    stimulus:riverScale,
    prompt:"Which explanation best connects sediment movement in the measured bank sections with long-term river-channel change?",
    options:[
      "Flowing water erodes and transports sediment locally, and repeated changes across many sections can reshape a river channel over longer time periods.",
      "The seasonal measurements prove a whole river loses exactly the same sediment mass as one 10 m section during every year.",
      "Local sediment movement cannot affect a larger river because processes measured at one spatial scale never operate at another scale.",
      "The river channel can change only during the measured season and cannot continue changing as erosion and deposition repeat over decades."
    ],
    scoring:{answer:"Flowing water erodes and transports sediment locally, and repeated changes across many sections can reshape a river channel over longer time periods."},
    rationale:"The explanation links the measured process to accumulated changes across both greater spatial extent and longer duration."
  },
  "g8s-cr-005":{
    stimulus:crSedimentScale,
    prompt:"Use the seasonal sediment measurements and the 25-year map evidence to explain how erosion and sediment transport can change Earth's surface at different time and spatial scales. Include how vegetation relates to the short-term measurements and how repeated local changes can contribute to the kilometer-scale channel shift.",
    scoring:{mode:"manual",rubric:{maxPoints:2,criteria:["Uses relevant seasonal evidence (210 kg, 122 kg, and/or 55 kg) to explain local erosion/sediment transport and the relationship between greater vegetation and lower measured sediment loss.","Connects repeated local erosion/deposition over years to the mapped multi-kilometer, 25-year channel change, explicitly addressing both time and spatial scale."]}},
    rationale:"A strong response connects short-term local measurements with the same geoscience processes accumulating across a larger river reach over decades."
  }
});

export const G8_ITEM_REPAIR_IDS=Object.freeze(Object.keys(G8_ITEM_REPAIRS));

export function applyG8ScienceItemRepairs(items){
  return items.map(item=>{
    const repair=G8_ITEM_REPAIRS[item.id];
    if(!repair)return item;
    return {...item,...repair,semanticPromptReview:"repaired-scale-depth-from-source-audit"};
  });
}
