import { BANK_G3_MATH } from "../data/grade-3/math.js";
import { BANK_G3_MATH_EXPANSION } from "../data/grade-3/math-expansion.js";
import { BANK_G3_ELA } from "../data/grade-3/ela.js";
import { BANK_G3_ELA_EXPANSION } from "../data/grade-3/ela-expansion.js";
import { BANK_G4_MATH } from "../data/grade-4/math.js";
import { BANK_G4_MATH_EXPANSION } from "../data/grade-4/math-expansion.js";
import { BANK_G4_MATH_PE_EXPANSION } from "../data/grade-4/math-pe-expansion.js";
import { BANK_G4_ELA } from "../data/grade-4/ela.js";
import { BANK_G4_ELA_EXPANSION } from "../data/grade-4/ela-expansion.js";
import { BANK_G4_ELA_EXPANSION_2 } from "../data/grade-4/ela-expansion-2.js";
import { BANK_G5_MATH } from "../data/grade-5/math.js";
import { BANK_G5_MATH_EXPANSION } from "../data/grade-5/math-expansion.js";
import { BANK_G5_ELA } from "../data/grade-5/ela.js";
import { BANK_G5_ELA_EXPANSION } from "../data/grade-5/ela-expansion.js";
import { BANK_G5_ELA_EXPANSION_2 } from "../data/grade-5/ela-expansion-2.js";
import { BANK_G5_SCIENCE } from "../data/grade-5/science.js";
import { BANK_G5_SCIENCE_EXPANSION } from "../data/grade-5/science-expansion.js";
import { BANK_G5_SCIENCE_EXPANSION_2 } from "../data/grade-5/science-expansion-2.js";
import { BANK_G6_MATH } from "../data/grade-6/math.js";
import { BANK_G6_MATH_EXPANSION } from "../data/grade-6/math-expansion.js";
import { BANK_G6_MATH_PE_EXPANSION } from "../data/grade-6/math-pe-expansion.js";
import { BANK_G6_ELA } from "../data/grade-6/ela.js";
import { BANK_G6_ELA_EXPANSION } from "../data/grade-6/ela-expansion.js";
import { BANK_G7_MATH } from "../data/grade-7/math.js";
import { BANK_G7_MATH_EXPANSION } from "../data/grade-7/math-expansion.js";
import { BANK_G7_MATH_PE_EXPANSION } from "../data/grade-7/math-pe-expansion.js";
import { BANK_G7_ELA } from "../data/grade-7/ela.js";
import { BANK_G7_ELA_EXPANSION } from "../data/grade-7/ela-expansion.js";
import { BANK_G8_MATH } from "../data/grade-8/math.js";
import { BANK_G8_MATH_EXPANSION } from "../data/grade-8/math-expansion.js";
import { BANK_G8_MATH_PE_EXPANSION } from "../data/grade-8/math-pe-expansion.js";
import { BANK_G8_ELA } from "../data/grade-8/ela.js";
import { BANK_G8_ELA_EXPANSION } from "../data/grade-8/ela-expansion.js";
import { BANK_G8_ELA_EXPANSION_2 } from "../data/grade-8/ela-expansion-2.js";
import { BANK_G8_SCIENCE } from "../data/grade-8/science.js";
import { BANK_G8_SCIENCE_EXPANSION } from "../data/grade-8/science-expansion.js";
import { BANK_G8_SCIENCE_EXPANSION_2 } from "../data/grade-8/science-expansion-2.js";

export const BANKS=Object.freeze({
  "g3-math":[...BANK_G3_MATH,...BANK_G3_MATH_EXPANSION],"g3-ela":[...BANK_G3_ELA,...BANK_G3_ELA_EXPANSION],
  "g4-math":[...BANK_G4_MATH,...BANK_G4_MATH_EXPANSION,...BANK_G4_MATH_PE_EXPANSION],"g4-ela":[...BANK_G4_ELA,...BANK_G4_ELA_EXPANSION,...BANK_G4_ELA_EXPANSION_2],
  "g5-math":[...BANK_G5_MATH,...BANK_G5_MATH_EXPANSION],"g5-ela":[...BANK_G5_ELA,...BANK_G5_ELA_EXPANSION,...BANK_G5_ELA_EXPANSION_2],"g5-science":[...BANK_G5_SCIENCE,...BANK_G5_SCIENCE_EXPANSION,...BANK_G5_SCIENCE_EXPANSION_2],
  "g6-math":[...BANK_G6_MATH,...BANK_G6_MATH_EXPANSION,...BANK_G6_MATH_PE_EXPANSION],"g6-ela":[...BANK_G6_ELA,...BANK_G6_ELA_EXPANSION],
  "g7-math":[...BANK_G7_MATH,...BANK_G7_MATH_EXPANSION,...BANK_G7_MATH_PE_EXPANSION],"g7-ela":[...BANK_G7_ELA,...BANK_G7_ELA_EXPANSION],
  "g8-math":[...BANK_G8_MATH,...BANK_G8_MATH_EXPANSION,...BANK_G8_MATH_PE_EXPANSION],"g8-ela":[...BANK_G8_ELA,...BANK_G8_ELA_EXPANSION,...BANK_G8_ELA_EXPANSION_2],"g8-science":[...BANK_G8_SCIENCE,...BANK_G8_SCIENCE_EXPANSION,...BANK_G8_SCIENCE_EXPANSION_2]
});
export const getBank=id=>BANKS[id]||[];
