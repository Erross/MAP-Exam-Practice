import { BANK_G8_SCIENCE as SOURCE_BANK_G8_SCIENCE } from "./science.js";

const G8S_003_REPAIR={
  prompt:"Which two changes would improve the evidence used to evaluate the insulation designs? Select two.",
  options:[
    "Repeat each condition several times",
    "Measure each container's temperature at several equal time intervals during the 20 minutes",
    "Use a different water volume in every container",
    "Place each container in a different room"
  ],
  scoring:{answers:[
    "Repeat each condition several times",
    "Measure each container's temperature at several equal time intervals during the 20 minutes"
  ]},
  rationale:"Replication improves reliability, and repeated measurements at the same time intervals provide more evidence about cooling while keeping wrap material as the design variable."
};

export const BANK_G8_SCIENCE=SOURCE_BANK_G8_SCIENCE.map(item=>
  item.id==="g8s-003" ? {...item,...G8S_003_REPAIR} : item
);
