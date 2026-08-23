// Source-controlled semantic review ledger for browser-effective Science banks.
// The exact expectation text is transcribed from Missouri Learning Standards / DESE item-spec materials.
// This layer exists so a syntactically valid but semantically wrong expectation code cannot quietly ship.

export const ELEMENTARY_SCIENCE_EXPECTATIONS=Object.freeze({
  "3.PS.1.A.1":"Predict and investigate that water can change from liquid to solid and back, or liquid to gas and back, with temperature changes.",
  "3.PS.2.B.1":"Plan and conduct investigations to determine cause-and-effect relationships of electric or magnetic interactions between two objects not in contact.",
  "4.ESS.2.A.1":"Plan and conduct scientific investigations or simulations to provide evidence of how natural processes such as weathering and erosion shape Earth's surfaces.",
  "4.PS.2.A.1":"Make observations and/or measurements of an object's motion to provide evidence that a pattern can be used to predict future motion.",
  "4.PS.2.B.2":"Predict how changes in either the amount of force applied to an object or the mass of the object affect the motion (speed and direction) of the object.",
  "4.PS.3.B.1":"Provide evidence to construct an explanation of an energy transformation, including temperature change, light, sound, motion, or magnetic effects.",
  "5.PS.1.A.2":"Measure and graph quantities to provide evidence that total weight of matter is conserved when heating, cooling, or mixing substances.",
  "5.PS.1.B.1":"Plan and conduct investigations to separate components of a mixture/solution by physical properties such as sorting, filtration, magnets, or screening.",
  "5.PS.1.B.2":"Conduct an investigation to determine whether combining two or more substances results in new substances.",
  "5.PS.4.A.1":"Develop a model to describe that objects can be seen only when light is reflected off them or when they produce their own light.",
  "5.LS.1.C.1":"Support an argument that plants get the materials they need for growth chiefly from air and water.",
  "5.LS.2.B.1":"Develop a model to describe the movement of matter among plants, animals, decomposers, and the environment.",
  "5.ESS.1.B.2":"Represent data in graphical displays to reveal patterns of daily changes in shadows, day and night, and seasonal appearance of some stars.",
  "5.ESS.2.A.1":"Develop a model using an example to describe ways the geosphere, biosphere, hydrosphere, and/or atmosphere interact.",
  "5.ESS.3.C.1":"Obtain and combine information about ways individual communities use science ideas to protect Earth's resources and environment."
});

// High-confidence corrections found by comparing the actual prompt/stimulus semantics
// against the expectation text above. These do not make the bank release-ready; they
// only correct browser-effective metadata while the full clean-room review remains open.
export const G5_STANDARD_CORRECTIONS=Object.freeze({
  "g5s-005":"4.ESS.2.A.1",
  "g5s-009":"4.PS.3.B.1",
  "g5s-010":"4.PS.2.B.2",
  "g5s-017":"4.ESS.2.A.1",
  "g5s-018":"4.ESS.2.A.1",
  "g5s-019":"3.PS.1.A.1",
  "g5s-020":"3.PS.1.A.1",
  "g5s-025":"4.ESS.2.A.1",
  "g5s-026":"4.ESS.2.A.1",
  "g5s-cap-001":"4.PS.3.B.1",
  "g5s-cap-002":"4.PS.3.B.1",
  "g5s-cap-003":"4.PS.3.B.1",
  "g5s-cap-004":"3.PS.2.B.1",
  "g5s-cap-005":"3.PS.2.B.1",
  "g5s-cap-006":"3.PS.2.B.1",
  "g5s-div-a001":"4.PS.3.B.1",
  "g5s-div-a002":"4.PS.3.B.1",
  "g5s-div-a003":"4.PS.3.B.1",
  "g5s-div-a006":"4.PS.2.B.2",
  "g5s-div-a013":"4.ESS.2.A.1",
  "g5s-div-a014":"4.ESS.2.A.1",
  "g5s-div-a018":"4.ESS.2.A.1",
  "g5s-div-b005":"4.PS.2.B.2",
  "g5s-div-b006":"4.PS.3.B.1",
  "g5s-div-b013":"4.ESS.2.A.1",
  "g5s-div-b014":"4.ESS.2.A.1",
  "g5s-div-b015":"4.ESS.2.A.1",
  "g5s-cr-002":"4.PS.2.B.2",
  "g5s-cr-005":"4.ESS.2.A.1"
});

// These are intentionally NOT auto-corrected yet. They need prompt-level revision or
// a more specific item-spec judgment; keeping them listed makes the remaining semantic
// debt explicit and testable rather than hiding it behind a valid-looking code.
export const G5_SEMANTIC_REVIEW_PENDING=Object.freeze({
  "g5s-003":"5.LS.1.C.1 item focuses on light-duration experimental design rather than the expectation's air/water-material argument.",
  "g5s-004":"5.LS.1.C.1 conclusion is a light-dose growth pattern, not chiefly an air/water-material argument.",
  "g5s-008":"5.PS.1.B.2 is about whether combining substances forms new substances; this item instead matches generic physical properties.",
  "g5s-011":"5.LS.2.B.1 should foreground movement of matter through an ecosystem; current item is a population/food-availability inference.",
  "g5s-015":"5.LS.2.B.1 current item asks food availability rather than movement of matter among plants/animals/decomposers/environment.",
  "g5s-016":"5.LS.2.B.1 current item asks a population prediction rather than constructing/interpreting a matter-flow model.",
  "g5s-027":"4.PS.2.A.1 requires a repeatable motion pattern usable to predict future motion; ramp starting-height relationship needs prompt-level review.",
  "g5s-028":"4.PS.2.A.1 numeric difference does not itself establish or use a repeatable motion pattern for prediction.",
  "g5s-033":"5.LS.1.C.1 water-growth investigation does not yet ask the air/water-material argument required by the expectation.",
  "g5s-034":"5.LS.1.C.1 current conclusion is dose-response rather than the expectation's material-source argument.",
  "g5s-035":"5.LS.1.C.1 graph entry captures growth data but not the expectation's air/water-material claim.",
  "g5s-036":"5.LS.1.C.1 experimental-design item does not directly assess the expectation's material-source argument.",
  "g5s-div-a005":"5.PS.1.B.2 is new-substance investigation; this item instead matches generic properties including magnetism.",
  "g5s-div-a007":"5.LS.1.C.1 current item is variable identification, not the plant-material-source argument.",
  "g5s-div-a008":"5.LS.1.C.1 numeric growth difference is not direct evidence of chiefly air/water material sources.",
  "g5s-div-a009":"5.LS.1.C.1 current conclusion is water-dose performance, not the expectation's material-source argument.",
  "g5s-div-b004":"5.PS.1.B.2 is new-substance investigation; this item instead identifies magnetic behavior.",
  "g5s-div-b007":"5.LS.2.B.1 current item is a population count, not movement of matter.",
  "g5s-div-b008":"5.LS.2.B.1 numeric population difference is not movement of matter.",
  "g5s-div-b009":"5.LS.1.C.1 replication item does not directly assess plant material sources.",
  "g5s-div-b010":"5.LS.2.B.1 food-chain roles are related but need explicit matter-flow semantics.",
  "g5s-div-b011":"5.LS.1.C.1 control-variable item does not directly assess plant material sources.",
  "g5s-div-b012":"5.LS.2.B.1 current population/food prediction needs explicit matter-flow semantics.",
  "g5s-cap-007":"5.LS.2.B.1 variable identification is not movement of matter.",
  "g5s-cap-008":"5.LS.2.B.1 numeric population difference is not movement of matter.",
  "g5s-cap-009":"5.LS.2.B.1 population conclusion does not directly assess matter movement.",
  "g5s-cap-010":"5.LS.1.C.1 follow-up-design item does not directly assess plant material sources.",
  "g5s-cr-003":"5.LS.2.B.1 response predicts populations/grass rather than explicitly tracing matter movement.",
  "g5s-cr-004":"5.LS.1.C.1 response analyzes light-duration growth rather than chiefly air/water material sources."
});

export function applyG5ScienceSemanticReview(items){
  return items.map(item=>{
    const corrected=G5_STANDARD_CORRECTIONS[item.id];
    if(!corrected)return item;
    return {...item,standard:corrected,semanticStandardReview:"corrected-from-source-audit"};
  });
}
