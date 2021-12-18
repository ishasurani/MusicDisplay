"use strict";

function openTab(e, exampleNum) {
  
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    const tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.getElementById(exampleNum).style.display = "block";
    e.currentTarget.className += " active";
}
document.getElementById("default").click();

const md = new MusicDisplay('div1');
const s = md.makeStaff("treble", 600, 150, 740, "both", true, true);
s.addKeySignature(["B4b", "E5b"]);
s.addTimeSignature("4", "4");
s.addNote("", "B3", "quarter");
s.addNote("", "C4", "quarter");
s.addNote("", "D4", "quarter");
s.addNote("", "E4", "quarter");
s.addBarLine();
s.addNote("", "F4", "quarter");
s.addNote("", "G4", "quarter");
s.addNote("", "A4", "quarter");
s.addNote("", "B4", "quarter");
s.addBarLine();
s.addRest("whole");
s.addDoubleBarLine();
s.draw()

const md2 = new MusicDisplay('div2');
const s2 = md2.makeStaff("treble", 570, 150, 885, "hover", true, true);
s2.addKeySignature(["C5#", "F5#"]);
s2.addTimeSignature("2", "4");
s2.addNote("", "D5", "quarter");
s2.addNote("", "D5", "quarter");
s2.addBarLine();
s2.addNote("", "A5", "quarter");
s2.addNote("", "A5", "quarter");
s2.addBarLine();
s2.addNote("", "B5", "quarter");
s2.addNote("", "B5", "quarter");
s2.addBarLine();
s2.addNote("", "A5", "half");
s2.addBarLine();
s2.addNote("", "G5", "quarter");
s2.addNote("", "G5", "quarter");
s2.addBarLine();
s2.addNote("", "F5", "quarter");
s2.addNote("", "F5", "quarter");
s2.addBarLine();
s2.draw()
const md3 = new MusicDisplay('div2');
const s3 = md3.makeStaff("treble", 570, 420, 440, "hover", true, true);
s3.addKeySignature(["C5#", "F5#"]);
s3.addTimeSignature("2", "4");
s3.addNote("", "E5", "quarter");
s3.addNote("", "E5", "quarter");
s3.addBarLine();
s3.addNote("", "D5", "half");
s3.addBarLine();
s3.addRest("half");
s3.addDoubleBarLine();
s3.draw();

const md4 = new MusicDisplay('div3');
const s4 = md4.makeStaff("bass", 600, 180, 580, "click", false, false);
s4.addTimeSignature("4", "4");
s4.addNote("flat", "B3", "whole");
s4.addBarLine();
s4.addNote("flat", "E3", "half");
s4.addNote("flat", "A3", "quarter");
s4.addRest("quarter");
s4.addBarLine();
s4.addNote("", "G3", "half");
s4.addRest("half");
s4.addBarLine();
s4.addNote("", "C3", "whole");
s4.addDoubleBarLine();
s4.draw();


// s.addKeySignature(["B4b", "E5b"]);
// s.addTimeSignature("3", "4");
// s.addNote("", "A3", "whole");
// s.addNote("sharp", "C4", "quarter");
// s.addNote("sharp", "D4", "half");
// s.addBarLine();
// s.addNote("", "G4", "quarter");
// s.addNote("flat", "A4", "half");
// s.addRest("whole");
// s.addBarLine();
// s.addNote("sharp", "F5", "whole");
// s.addNote("", "G5", "half");
// s.addRest("half");
// s.addNote("", "A5", "quarter");
// s.addNote("", "C6", "whole");
// s.addNote("flat", "D6", "whole");
// s.draw();

// const s2 = md2.makeStaff("bass", 550, 200, 800, "", true, true);
// s2.addKeySignature(["C3#", "F3#"]);
// s2.addTimeSignature("4", "4");
// s2.addNote("", "F2", "whole");
// s2.addNote("", "G2", "quarter");
// s2.addNote("", "A2", "whole");
// s2.addRest("quarter");
// s2.addNote("", "B2", "half");
// s2.addNote("", "C3", "whole");
// s2.addNote("", "D3", "quarter");
// s2.addNote("", "E3", "whole");
// s2.addNote("", "F3", "whole");
// s2.addNote("", "G3", "quarter");
// s2.addNote("", "A3", "whole");
// s2.draw();