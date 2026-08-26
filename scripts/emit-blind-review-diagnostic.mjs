import { buildCleanRoomReviewTemplate } from "./clean-room-review-template.mjs";

const assessmentId=process.argv[2];
const start=Math.max(1,Number(process.argv[3]||1));
const requestedEnd=Number(process.argv[4]||start+19);
if(!assessmentId)throw new Error("assessment id required");
const template=buildCleanRoomReviewTemplate(assessmentId);
const end=Math.min(template.items.length,requestedEnd);
const items=template.items.slice(start-1,end).map(item=>{
  const {review,...blindItem}=item;
  return blindItem;
});
console.log(`BLIND_REVIEW_CHUNK:${JSON.stringify({assessmentId,browserEffectiveFingerprint:template.browserEffectiveFingerprint,start,end,itemCount:template.itemCount,items})}`);
