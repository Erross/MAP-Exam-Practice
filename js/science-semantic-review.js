// Source-controlled semantic review ledger for browser-effective Science banks.
// Expectation summaries are transcribed from Missouri Learning Standards / DESE item-spec materials.
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

export const MIDDLE_SCHOOL_SCIENCE_EXPECTATIONS=Object.freeze({
  "6-8.PS1.A.1":"Develop models to describe the atomic composition of simple molecules and extended structures.",
  "6-8.PS1.A.2":"Analyze and interpret data on properties of substances before and after they interact to determine whether a chemical reaction occurred.",
  "6-8.PS1.B.1":"Develop and use a model to describe how the total number of atoms remains the same during a chemical reaction and thus mass is conserved.",
  "6-8.PS2.A.1":"Apply physics principles to design a solution that minimizes the force of an object during a collision and develop an evaluation of the solution.",
  "6-8.PS2.A.2":"Plan and conduct an investigation to provide evidence that change in an object's motion depends on the sum of forces on the object and the object's mass.",
  "6-8.PS2.B.1":"Analyze diagrams and collect data to determine factors that affect the strength of electric and magnetic forces.",
  "6-8.PS3.A.3":"Apply scientific principles to design, construct, and test a device that either minimizes or maximizes thermal-energy transfer.",
  "6-8.PS3.A.4":"Plan and conduct an investigation to determine relationships among energy transferred, type of matter, mass, and change in sample temperature.",
  "6-8.LS1.B.2":"Construct a scientific explanation based on evidence for how environmental and genetic factors influence growth of organisms.",
  "6-8.LS2.A.1":"Analyze and interpret data to provide evidence for effects of resource availability on individual organisms and populations in an ecosystem.",
  "6-8.LS2.A.2":"Construct an explanation that predicts patterns of interactions among and between biotic and abiotic factors in a given ecosystem.",
  "6-8.LS2.B.1":"Develop a model to describe cycling of matter and flow of energy among living and nonliving parts of an ecosystem.",
  "6-8.LS2.C.1":"Construct an argument supported by empirical evidence explaining how changes to physical or biological ecosystem components affect populations.",
  "6-8.ESS1.B.1":"Analyze and interpret data to determine scale properties of objects in the solar system.",
  "6-8.ESS2.A.2":"Construct an explanation based on evidence for how geoscience processes have changed Earth's surface at varying time and spatial scales.",
  "6-8.ESS3.C.1":"Analyze data to define the relationship for how increases in human population and per-capita consumption of natural resources impact Earth's systems.",
  "6-8.ESS3.C.2":"Apply scientific principles to design a method for monitoring and minimizing a human impact on the environment."
});

// Historical audit ledger of high-confidence Grade 5 metadata corrections. The corrected
// values now live directly in data/grade-5 source banks; this mapping remains as a regression
// record and is no longer applied at runtime.
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

// Empty ledgers are regression signals, not release approvals. Both Science grades still
// require genuinely independent clean-room review of the consolidated browser-effective banks.
export const G5_SEMANTIC_REVIEW_PENDING=Object.freeze({});
export const G8_SEMANTIC_REVIEW_PENDING=Object.freeze({});
