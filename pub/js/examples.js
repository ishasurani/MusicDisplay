"use strict";
const md = new MusicDisplay();
const s = md.makeStaff("treble", 100, 100, 1200, "both", true);
s.addKeySignature(["B4b", "E5b"]);
s.addTimeSignature("3", "4");
s.addNote("", "A3", "whole");
s.addNote("sharp", "C4", "quarter");
s.addNote("sharp", "D4", "half");
s.addRest("quarter");
s.addBarLine();
s.addNote("", "F4", "whole");
s.addNote("sharp", "C4", "whole");
s.addBarLine();
s.addNote("", "G4", "quarter");
s.addNote("flat", "A4", "half");
s.addBarLine();
s.addNote("", "D5", "whole");
s.addRest("whole");
s.addBarLine();
s.addNote("sharp", "F5", "whole");
s.addNote("", "G5", "half");
s.addRest("half");
s.addNote("", "A5", "quarter");
s.addNote("", "C6", "whole");
s.addNote("flat", "D6", "whole");
s.draw();

const md2 = new MusicDisplay();
const s2 = md2.makeStaff("bass", 50, 400, 800, "hover", true);
s2.addKeySignature(["C3#", "F3#"]);
s2.addTimeSignature("4", "4");
s2.addNote("", "F2", "whole");
s2.addNote("", "G2", "quarter");
s2.addNote("", "A2", "whole");
s2.addNote("", "B2", "half");
s2.addNote("", "C3", "whole");
s2.addNote("", "D3", "quarter");
s2.addNote("", "E3", "whole");
s2.addNote("", "F3", "whole");
s2.addNote("", "G3", "quarter");
s2.addNote("", "A3", "whole");
s2.draw();

const md3 = new MusicDisplay();
const s3 = md3.makeStaff("treble", 400, 700, 500, "click", false);
s3.addTimeSignature("2", "4");
s3.addNote("flat", "B4", "whole");
s3.addNote("flat", "E5", "quarter");
s3.addNote("", "G4", "whole");
s3.addNote("flat", "A4", "quarter");
s3.addNote("", "C5", "whole");
s3.draw();
