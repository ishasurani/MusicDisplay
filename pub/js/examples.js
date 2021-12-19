"use strict";

function tab(e, exampleNum) {
  
    const content = document.getElementsByClassName("content");
    for (var i = 0; i < content.length; i++) {
      content[i].style.display = "none";
    }
  
    const tabs = document.getElementsByClassName("tabs");
    for (i = 0; i < tabs.length; i++) {
      tabs[i].className = tabs[i].className.replace(" active", "");
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
const s4 = md4.makeStaff("bass", 600, 150, 580, "", false, true);
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
s4.addMusicQuiz('div3', 600, 350);

const md5 = new MusicDisplay('div4');
const s5 = md5.makeStaff("treble", 600, 160, 690, "click", true, false);
s5.addKeySignature(["B4b", "E5b"]);
s5.addTimeSignature("4", "4");
s5.addNote("", "B4", "whole");
s5.addBarLine();
s5.addNote("", "B5", "half");
s5.addNote("", "G5", "quarter");
s5.addRest("", "E5", "quarter");
s5.addBarLine();
s5.addRest("whole");
s5.addBarLine();
s5.addNote("", "C6", "whole");
s5.addBarLine();
s5.addNote("", "F5", "half");
s5.addNote("", "E5", "half");
s5.addDoubleBarLine();
s5.draw();
s5.addMusicQuiz('div4', 600, 450);