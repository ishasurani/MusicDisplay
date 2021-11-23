"use strict";
const log = console.log;

class MusicDisplay {
    constructor() {
        this.staves = [];
        this.click = [];
    }

    makeStaff(x, y, length, clicked) {
        const s = new Staff(x, y, length);
        this.staves.push(s);
        if (clicked){
            this.click.push(s);
            const canvas = document.getElementById('canvas1');
            canvas.addEventListener('click', this.checkNoteClicked.bind(null, this))
        }
        return s;
    }

    checkNoteClicked(md, e){
        const canvas = document.getElementById('canvas1');
        const context = canvas.getContext('2d');
        const r = canvas.getBoundingClientRect();
        const pos = {
            x: e.clientX - r.left,
            y: e.clientY - r.top
        };

        md.click.forEach(staff => 
            staff.notes.forEach(
                function(note){
                    if ((pos.x >= note.pos[0] && pos.x <= note.pos[0] + 40) && (pos.y >= note.pos[1] - 40 && pos.y <= note.pos[1])){
                        context.font = '20px Arial';
                        if (note.fs == "sharp"){
                            context.fillText(note.note + "#", note.pos[0], staff.y - 40);
                        } 
                        else if (note.fs == "flat"){
                            context.fillText(note.note + "b", note.pos[0], staff.y - 40);
                        }
                        else{
                            context.fillText(note.note, note.pos[0], staff.y - 40);
                        }
                    }
                }
            )
        )        
    }
}

class Staff {
	constructor(x, y, length) {
		this.x = x
		this.y = y
        this.length = length
        this.currPosition = 0
        this.clef = "";
        this.notes = [];
	}

	addNote(fs, note, length) {
		const newNote = new Note(this.clef, fs, note, length);
        newNote.draw(this.x, this.y, this.currPosition);
        this.currPosition += 1;
        this.notes.push(newNote);
	}

    addTimeSignature(clef, top, bottom){
        this.clef = clef;
        const ts = new TimeSignature(clef, top, bottom);
        ts.draw(this.x, this.y);
    }

    draw(){
        const canvas = document.getElementById('canvas1'); 
        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.strokeStyle = 'black';
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.length, this.y);
        context.moveTo(this.x, this.y + 20);
        context.lineTo(this.x + this.length, this.y + 20);
        context.moveTo(this.x, this.y + 40);
        context.lineTo(this.x + this.length, this.y + 40);
        context.moveTo(this.x, this.y + 60);
        context.lineTo(this.x + this.length, this.y + 60);
        context.moveTo(this.x, this.y + 80);
        context.lineTo(this.x + this.length, this.y + 80);
        context.stroke();
        context.closePath();
    }

}

class Note{
    constructor(clef, fs, note, length){
        this.clef = clef;
        this.fs = fs;
        this.note = note;
        this.length = length;
        this.pos = 0;
    }

    draw(x, y, position){
        const canvas = document.getElementById('canvas1');
        const context = canvas.getContext('2d');
        context.font = '40px Arial';
        const where = findNotePosition(this.clef, this.note, position);
        if (this.fs == "sharp"){
            const sharp = "\u266F";
            context.fillText(sharp, x + where[0], y + where[1]);
            if (this.length == "quarter"){
                const note = "\uD834\uDD5F";
                context.font = '75px Arial';
                context.fillText(note, x + where[0] + 20, y + where[1]);
            } 
            else if (this.length == "half"){
                const note = "\uD834\uDD5E";
                context.font = '75px Arial';
                context.fillText(note, x + where[0] + 20, y + where[1]);
            }
            else if (this.length == "whole"){
                const note = "\uD834\uDD5D";
                context.font = '75px Arial';
                context.fillText(note, x + where[0] + 20, y + where[1]);
            }
        }
        else if (this.fs == "flat"){
            const flat = "\u266D";
            context.fillText(flat, x + where[0], y + where[1]);
            if (this.length == "quarter"){
                context.font = '75px Arial';
                const note = "\uD834\uDD5F";
                context.fillText(note, x + where[0] + 20, y + where[1]);
            } 
            else if (this.length == "half"){
                context.font = '75px Arial';
                const note = "\uD834\uDD5E";
                context.fillText(note, x + where[0] + 20, y + where[1]);
            }
            else if (this.length == "whole"){
                context.font = '75px Arial';
                const note = "\uD834\uDD5D";
                context.fillText(note, x + where[0] + 20, y + where[1]);
            }                          
        }
        else {
            if (this.length == "quarter"){
                context.font = '75px Arial';
                const note = "\uD834\uDD5F";
                context.fillText(note, x + where[0] + 20, y + where[1]);
            } 
            else if (this.length == "half"){
                context.font = '75px Arial';
                const note = "\uD834\uDD5E";
                context.fillText(note, x + where[0] + 20, y + where[1]);
            }
            else if (this.length == "whole"){
                context.font = '75px Arial';
                const note = "\uD834\uDD5D";
                context.fillText(note, x + where[0] + 20, y + where[1]);
            }                         
        }
        this.pos = [x + where[0] + 20, y + where[1]];
    }
}

function findNotePosition(clef, note, position){
    position = 130 + position*60;
    if (clef == "treble"){
        if (note == "D4"){
            return [position, 98];
        }
        else if (note == "E4"){
            return [position, 88];
        }
        else if (note == "F4"){
            return [position, 78];
        }
        else if (note == "G4"){
            return [position, 68];
            
        }
        else if (note == "A4"){
            return [position, 58];
            
        }
        else if (note == "B4"){
            return [position, 48];
            
        }
        else if (note == "C5"){
            return [position, 38];
            
        }
        else if (note == "D5"){
            return [position, 28];
            
        }
        else if (note == "E5"){
            return [position, 18];
            
        }
        else if (note == "F5"){
            return [position, 8];
            
        }
        else if (note == "G5"){
            return [position, -2];
            
        }
    }
    if (clef == "bass"){
        if (note == "F2"){
            return [position, 98];
        }
        else if (note == "G2"){
            return [position, 88];
        }
        else if (note == "A2"){
            return [position, 78];
        }
        else if (note == "B2"){
            return [position, 68];
            
        }
        else if (note == "C3"){
            return [position, 58];
            
        }
        else if (note == "D3"){
            return [position, 48];
            
        }
        else if (note == "E3"){
            return [position, 38];
            
        }
        else if (note == "F3"){
            return [position, 28];
            
        }
        else if (note == "G3"){
            return [position, 18];
            
        }
        else if (note == "A3"){
            return [position, 8];
            
        }
        else if (note == "B3"){
            return [position, -2];
            
        }
    }
}

class TimeSignature{
    constructor(clef, top, bottom){
        this.clef = clef;
        this.top = top;
        this.bottom = bottom;
    }

    draw(x, y){
        const canvas = document.getElementById('canvas1');
        const context = canvas.getContext('2d');
        context.font = '120px Arial';
        if (this.clef == "treble"){
            const clef = "\uD834\uDD1E";
            context.fillText(clef, x + 5, y + 80);
        }
        else if (this.clef == "bass"){
            context.font = '100px Arial';
            const clef = "\uD834\uDD22";
            context.fillText(clef, x + 5, y + 80);
        }
        else if (this.clef == "c"){
            const clef = "\uD834\uDD21";
            context.fillText(clef, x + 5, y + 80);
        }
        context.font = 'bold 54px serif';
        context.fillText(this.top, x + 80, y + 38);
        context.fillText(this.bottom, x + 80, y + 78);
    }
}
