import { gzipSync } from "node:zlib";
import { buildCleanRoomReviewTemplate } from "./clean-room-review-template.mjs";

const assessmentId=process.argv[2];
if(!assessmentId)throw new Error("assessment id required");
const template=buildCleanRoomReviewTemplate(assessmentId);
const payload=gzipSync(Buffer.from(JSON.stringify(template))).toString("base64");
console.log(`BLIND_REVIEW_GZIP_BASE64:${assessmentId}:${payload}`);
