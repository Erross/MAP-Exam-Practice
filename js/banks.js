import { BANK_G3_MATH } from "../data/grade-3/math.js";
import { BANK_G3_ELA } from "../data/grade-3/ela.js";
import { BANK_G4_MATH } from "../data/grade-4/math.js";
import { BANK_G4_ELA } from "../data/grade-4/ela.js";
import { BANK_G4_ELA_EXPANSION } from "../data/grade-4/ela-expansion.js";
import { BANK_G5_MATH } from "../data/grade-5/math.js";
import { BANK_G5_ELA } from "../data/grade-5/ela.js";
import { BANK_G5_SCIENCE } from "../data/grade-5/science.js";
import { BANK_G5_SCIENCE_EXPANSION } from "../data/grade-5/science-expansion.js";
import { BANK_G6_MATH } from "../data/grade-6/math.js";
import { BANK_G6_ELA } from "../data/grade-6/ela.js";
import { BANK_G7_MATH } from "../data/grade-7/math.js";
import { BANK_G7_ELA } from "../data/grade-7/ela.js";
import { BANK_G8_MATH } from "../data/grade-8/math.js";
import { BANK_G8_ELA } from "../data/grade-8/ela.js";
import { BANK_G8_SCIENCE } from "../data/grade-8/science.js";
import { BANK_G8_SCIENCE_EXPANSION } from "../data/grade-8/science-expansion.js";

export const BANKS=Object.freeze({
  "g3-math":BANK_G3_MATH,"g3-ela":BANK_G3_ELA,
  "g4-math":BANK_G4_MATH,"g4-ela":[...BANK_G4_ELA,...BANK_G4_ELA_EXPANSION],
  "g5-math":BANK_G5_MATH,"g5-ela":BANK_G5_ELA,"g5-science":[...BANK_G5_SCIENCE,...BANK_G5_SCIENCE_EXPANSION],
  "g6-math":BANK_G6_MATH,"g6-ela":BANK_G6_ELA,
  "g7-math":BANK_G7_MATH,"g7-ela":BANK_G7_ELA,
  "g8-math":BANK_G8_MATH,"g8-ela":BANK_G8_ELA,"g8-science":[...BANK_G8_SCIENCE,...BANK_G8_SCIENCE_EXPANSION]
});
export const getBank=id=>BANKS[id]||[];
