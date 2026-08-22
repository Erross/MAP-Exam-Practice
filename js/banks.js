import { BANK_G8_MATH } from "../data/grade-8/math.js";
import { BANK_G8_ELA } from "../data/grade-8/ela.js";
import { BANK_G8_SCIENCE } from "../data/grade-8/science.js";

export const BANKS=Object.freeze({"g8-math":BANK_G8_MATH,"g8-ela":BANK_G8_ELA,"g8-science":BANK_G8_SCIENCE});
export const getBank=id=>BANKS[id]||[];
