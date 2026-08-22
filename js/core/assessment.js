import { getAssessment, assessmentDeferredComponents } from "../config.js";

export function preflightModel(id){
  const assessment=getAssessment(id); if(!assessment) throw new Error(`Unknown assessment ${id}`);
  return {
    assessment,
    untimed:true,
    timingMessage:"MAP Grade-Level sessions are untimed. The displayed ranges are DESE planning guidelines, not countdown limits.",
    deferred:assessmentDeferredComponents(assessment),
    completeOperationalSimulation:assessment.fullSimulationAvailable===true
  };
}
