"use strict";
const log = console.log;

class MusicDisplay {
    constructor() {
        this.staves = [];
        this.click = [];
        this.hover = [];
    }

    makeStaff(clef, x, y, length, method) {
        const s = new Staff(clef, x, y, length);
        this.staves.push(s);
        if (method == "click"){
            if (this.click.length == 0){
                const canvas = document.getElementById('canvas1');
                canvas.addEventListener('click', this.checkNoteClicked.bind(null, this));
            }
            this.click.push(s);
        }
        else if (method == "hover") {
            if (this.hover.length == 0){
                const canvas = document.getElementById('canvas1');
                canvas.addEventListener("mousemove", this.checkHovered.bind(null, this));
            }
            this.hover.push(s);
        }
        else if (method == "both"){
            if (this.click.length == 0){
                const canvas = document.getElementById('canvas1');
                canvas.addEventListener('click', this.checkNoteClicked.bind(null, this));
            }
            if (this.hover.length == 0){
                const canvas = document.getElementById('canvas1');
                canvas.addEventListener("mousemove", this.checkHovered.bind(null, this));
            }
            this.click.push(s);
            this.hover.push(s);
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
                    if ((pos.x >= note.pos[0] && pos.x <= note.pos[0] + 40) && (pos.y >= note.pos[1] - 40 && pos.y <= note.pos[1]) && (!note.clicked)){
                        context.font = '20px Arial';
                        context.fillStyle = 'black';
                        if (note.fs == "sharp"){
                            context.fillText(note.note + "#", note.pos[0], staff.y - 65);
                        } 
                        else if (note.fs == "flat"){
                            context.fillText(note.note + "b", note.pos[0], staff.y - 65);
                        }
                        else{
                            context.fillText(note.note, note.pos[0], staff.y - 65);
                        }
                        note.clicked = true;
                        playNote(note.note);
                    }
                    else if ((pos.x >= note.pos[0] && pos.x <= note.pos[0] + 40) && (pos.y >= note.pos[1] - 40 && pos.y <= note.pos[1]) && note.clicked){
                        context.fillStyle = 'white';
                        context.fillRect(note.pos[0], staff.y - 82, 40, 20);
                        note.clicked = false;
                    }
                }
            )
        )
    }

    checkHovered(md, e){        
        const canvas = document.getElementById('canvas1');
        const context = canvas.getContext('2d');
        const r = canvas.getBoundingClientRect();
        const pos = {
            x: e.clientX - r.left,
            y: e.clientY - r.top
        };

        md.hover.forEach(staff => 
            staff.notes.forEach(
                function(note){
                    if (!note.clicked && (pos.x >= note.pos[0] && pos.x <= note.pos[0] + 40) && (pos.y >= note.pos[1] - 40 && pos.y <= note.pos[1]) && (!note.displayed)){
                        context.font = '20px Arial';
                        context.fillStyle = 'black';
                        if (note.fs == "sharp"){
                            context.fillText(note.note + "#", note.pos[0], staff.y - 65);
                        } 
                        else if (note.fs == "flat"){
                            context.fillText(note.note + "b", note.pos[0], staff.y - 65);
                        }
                        else{
                            context.fillText(note.note, note.pos[0], staff.y - 65);
                        }
                        note.displayed = true;
                    }
                    if (!note.clicked && (!(pos.x >= note.pos[0] && pos.x <= note.pos[0] + 40) || !(pos.y >= note.pos[1] - 40 && pos.y <= note.pos[1]))){
                        context.fillStyle = 'white';
                        context.fillRect(note.pos[0], staff.y - 82, 40, 20);
                        note.displayed = false;
                    }
                }
            )
        )
    }
}

class Staff {
	constructor(clef, x, y, length) {
		this.x = x
		this.y = y
        this.length = length
        this.currPosition = 10;
        this.clef = clef;
        this.notes = [];
	}

	addNote(fs, note, length) {
		const newNote = new Note(this.clef, fs, note, length);
        newNote.draw(this.x, this.y, this.currPosition);
        this.currPosition += 60;
        this.notes.push(newNote);
	}

    addTimeSignature(top, bottom){
        const ts = new TimeSignature(this.clef, top, bottom, this.currPosition);
        ts.draw(this.x, this.y);
        this.currPosition += 120;
    }

    addKeySignature(notes) { // a list of notes like: [E4b, C3#, B3b]
        const ks = new KeySignature(this.clef, notes);
        ks.draw(this.x, this.y);
        this.currPosition += 20*(notes.length);
    }

    addBarLine(){
        const canvas = document.getElementById('canvas1'); 
        const context = canvas.getContext('2d');
        this.currPosition += 10;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(this.x + this.currPosition, this.y);
        context.lineTo(this.x + this.currPosition, this.y + 80);
        context.stroke();
        context.closePath();
    }

    addRest(length){
        const canvas = document.getElementById('canvas1'); 
        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        this.currPosition += 20;
        if (length == "whole"){
            context.fillRect(this.x + this.currPosition, this.y + 40, 20, 10);
        }
        else if (length == "half"){
            context.fillRect(this.x + this.currPosition, this.y + 40, 20, -10);
        }
        else if (length = "quarter"){
            context.font = '75px Arial';
            // const rest = "\uD834\uDD3D";
            context.lineWidth = 4;
            context.beginPath();
            context.moveTo(this.x + this.currPosition + 2, this.y + 72);
            context.quadraticCurveTo(this.x + this.currPosition - 12, this.y + 53, this.x + this.currPosition + 10, this.y + 58);
            context.quadraticCurveTo(this.x + this.currPosition - 10, this.y + 37, this.x + this.currPosition + 5, this.y + 33);
            context.quadraticCurveTo( this.x + this.currPosition + 13, this.y + 30, this.x + this.currPosition, this.y + 15);
            // context.fillText(rest, this.x + this.currPosition - 40, this.y + 70);
            context.stroke();
            context.closePath();
        }
        this.currPosition += 30;
    }

    draw(){
        const canvas = document.getElementById('canvas1'); 
        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.strokeStyle = 'black';
        context.lineWidth = 2;
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
        context.font = '120px Arial';
        if (this.clef == "treble"){
            const clef = "\uD834\uDD1E";
            context.fillText(clef, this.x + 5, this.y + 80);
        }
        else if (this.clef == "bass"){
            context.font = '100px Arial';
            const clef = "\uD834\uDD22";
            context.fillText(clef, this.x + 5, this.y + 80);
        }
    }

}

class Note{
    constructor(clef, fs, note, length){
        this.clef = clef;
        this.fs = fs;
        this.note = note;
        this.length = length;
        this.pos = 0;
        this.displayed = false;
        this.clicked = false;
    }

    draw(x, y, position){
        const canvas = document.getElementById('canvas1');
        const context = canvas.getContext('2d');
        context.font = '35px Arial';
        context.fillStyle = 'black';
        const where = findNotePosition(this.clef, this.note, position);
        if (this.fs == "sharp"){
            context.font = '35px Arial';
            const sharp = "\u266F";
            context.fillText(sharp, x + where[0] + 5, y + where[1]);
            if (this.length == "quarter"){
                // const note = "\uD834\uDD5F";
                // context.font = '75px Arial';
                // context.fillText(note, x + where[0] + 20, y + where[1]);
                context.beginPath();
                if (where[1] > 40) {
                    context.moveTo(x + where[0] + 44, y + where[1] - 5);
                    context.lineTo(x + where[0] + 44, y + where[1] - 45);
                } else{
                    context.moveTo(x + where[0] + 26, y + where[1] - 5);
                    context.lineTo(x + where[0] + 26, y + where[1] + 35);

                }
                context.stroke();
                context.moveTo(x + where[0] + 35, y + where[1] - 14);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1] - 15, x + where[0] + 45, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1], x + where[0] + 35, y + where[1]);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1], x + where[0] + 25, y + where[1] - 6);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1] - 13, x + where[0] + 35, y + where[1] - 14);
                context.fill()
            } 
            else if (this.length == "half"){
                // const note = "\uD834\uDD5E";
                // context.font = '75px Arial';
                // context.fillText(note, x + where[0] + 20, y + where[1]);
                context.beginPath();
                if (where[1] > 40) {
                    context.moveTo(x + where[0] + 44, y + where[1] - 5);
                    context.lineTo(x + where[0] + 44, y + where[1] - 45);
                } else{
                    context.moveTo(x + where[0] + 26, y + where[1] - 5);
                    context.lineTo(x + where[0] + 26, y + where[1] + 35);

                }
                context.stroke();
                context.moveTo(x + where[0] + 35, y + where[1] - 14);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1] - 15, x + where[0] + 45, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1], x + where[0] + 35, y + where[1]);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1], x + where[0] + 25, y + where[1] - 6);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1] - 13, x + where[0] + 35, y + where[1] - 14);
                context.fill()
                context.fillStyle = 'white';
                context.beginPath();
                context.moveTo (x + where[0] + 35, y + where[1] - 12);
                context.quadraticCurveTo (x + where[0] + 40, y + where[1] - 13, x + where[0] + 40, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 40, y + where[1] - 2, x + where[0] + 35, y + where[1] - 2);
                context.quadraticCurveTo (x + where[0] + 31, y + where[1] - 2, x + where[0] + 30, y + where[1] - 6);
                context.quadraticCurveTo (x + where[0] + 31, y + where[1] - 11, x + where[0] + 35, y + where[1] - 12);
                context.fill();
            }
            else if (this.length == "whole"){
                context.font = '75px Arial';
                context.beginPath();
                context.moveTo (x + where[0] + 35, y + where[1] - 16);
                context.quadraticCurveTo (x + where[0] + 48, y + where[1] - 15, x + where[0] + 48, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 48, y + where[1], x + where[0] + 35, y + where[1]);
                context.quadraticCurveTo (x + where[0] + 22, y + where[1], x + where[0] + 22, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 22, y + where[1] - 15, x + where[0] + 35, y + where[1] - 16);
                context.fill()
                context.fillStyle = 'white';
                context.beginPath();
                context.moveTo (x + where[0] + 35, y + where[1] - 14);
                context.quadraticCurveTo (x + where[0] + 43, y + where[1] - 13, x + where[0] + 43, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 43, y + where[1] - 2, x + where[0] + 35, y + where[1] - 2);
                context.quadraticCurveTo (x + where[0] + 28, y + where[1] - 2, x + where[0] + 27, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 28, y + where[1] - 13, x + where[0] + 35, y + where[1] - 14);
                context.fill();
            }
        }
        else if (this.fs == "flat"){
            context.font = '40px Arial';
            // const flat = "\u266D";
            context.fillStyle = 'black';
            context.lineWidth = 2.5;
            context.beginPath();
            context.moveTo(x + where[0] + 5, y + where[1] - 30);
            context.lineTo(x + where[0] + 5, y + where[1]);
            context.quadraticCurveTo(x + where[0] + 15, y + where[1] - 2, x + where[0] + 15, y + where[1] - 8);
            context.quadraticCurveTo(x + where[0] + 12, y + where[1] - 15, x + where[0] + 5, y + where[1] - 10);
            context.stroke();
            context.closePath();
            // context.fillText(flat, x + where[0] + 5, y + where[1]);
            if (this.length == "quarter"){
                // context.font = '75px Arial';
                // const note = "\uD834\uDD5F";
                // context.fillText(note, x + where[0] + 20, y + where[1]);
                context.beginPath();
                if (where[1] > 40) {
                    context.moveTo(x + where[0] + 44, y + where[1] - 5);
                    context.lineTo(x + where[0] + 44, y + where[1] - 45);
                } else{
                    context.moveTo(x + where[0] + 26, y + where[1] - 5);
                    context.lineTo(x + where[0] + 26, y + where[1] + 35);

                }
                context.stroke();
                context.moveTo(x + where[0] + 35, y + where[1] - 14);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1] - 15, x + where[0] + 45, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1], x + where[0] + 35, y + where[1]);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1], x + where[0] + 25, y + where[1] - 6);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1] - 13, x + where[0] + 35, y + where[1] - 14);
                context.fill()
            } 
            else if (this.length == "half"){
                // context.font = '75px Arial';
                // const note = "\uD834\uDD5E";
                // context.fillText(note, x + where[0] + 20, y + where[1]);
                context.beginPath();
                if (where[1] > 40) {
                    context.moveTo(x + where[0] + 44, y + where[1] - 5);
                    context.lineTo(x + where[0] + 44, y + where[1] - 45);
                } else{
                    context.moveTo(x + where[0] + 26, y + where[1] - 5);
                    context.lineTo(x + where[0] + 26, y + where[1] + 35);

                }
                context.stroke();
                context.moveTo(x + where[0] + 35, y + where[1] - 14);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1] - 15, x + where[0] + 45, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1], x + where[0] + 35, y + where[1]);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1], x + where[0] + 25, y + where[1] - 6);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1] - 13, x + where[0] + 35, y + where[1] - 14);
                context.fill()
                context.fillStyle = 'white';
                context.beginPath();
                context.moveTo (x + where[0] + 35, y + where[1] - 12);
                context.quadraticCurveTo (x + where[0] + 40, y + where[1] - 13, x + where[0] + 40, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 40, y + where[1] - 2, x + where[0] + 35, y + where[1] - 2);
                context.quadraticCurveTo (x + where[0] + 31, y + where[1] - 2, x + where[0] + 30, y + where[1] - 6);
                context.quadraticCurveTo (x + where[0] + 31, y + where[1] - 11, x + where[0] + 35, y + where[1] - 12);
                context.fill();
            }
            else if (this.length == "whole"){
                context.font = '75px Arial';
                context.beginPath();
                context.moveTo (x + where[0] + 35, y + where[1] - 16);
                context.quadraticCurveTo (x + where[0] + 48, y + where[1] - 15, x + where[0] + 48, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 48, y + where[1], x + where[0] + 35, y + where[1]);
                context.quadraticCurveTo (x + where[0] + 22, y + where[1], x + where[0] + 22, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 22, y + where[1] - 15, x + where[0] + 35, y + where[1] - 16);
                context.fill()
                context.fillStyle = 'white';
                context.beginPath();
                context.moveTo (x + where[0] + 35, y + where[1] - 14);
                context.quadraticCurveTo (x + where[0] + 43, y + where[1] - 13, x + where[0] + 43, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 43, y + where[1] - 2, x + where[0] + 35, y + where[1] - 2);
                context.quadraticCurveTo (x + where[0] + 28, y + where[1] - 2, x + where[0] + 27, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 28, y + where[1] - 13, x + where[0] + 35, y + where[1] - 14);
                context.fill();
                context.fillStyle = 'black';
            }                          
        }
        else {
            if (this.length == "quarter"){
                // context.font = '75px Arial';
                // const note = "\uD834\uDD5F";
                // context.fillText(note, x + where[0] + 20, y + where[1]);
                context.beginPath();
                if (where[1] > 40) {
                    context.moveTo(x + where[0] + 44, y + where[1] - 5);
                    context.lineTo(x + where[0] + 44, y + where[1] - 45);
                } else{
                    context.moveTo(x + where[0] + 26, y + where[1] - 5);
                    context.lineTo(x + where[0] + 26, y + where[1] + 35);

                }
                context.stroke();
                context.moveTo(x + where[0] + 35, y + where[1] - 14);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1] - 15, x + where[0] + 45, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1], x + where[0] + 35, y + where[1]);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1], x + where[0] + 25, y + where[1] - 6);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1] - 13, x + where[0] + 35, y + where[1] - 14);
                context.fill()
            } 
            else if (this.length == "half"){
                // context.font = '75px Arial';
                // const note = "\uD834\uDD5E";
                // context.fillText(note, x + where[0] + 20, y + where[1]);
                context.beginPath();
                if (where[1] > 40) {
                    context.moveTo(x + where[0] + 44, y + where[1] - 5);
                    context.lineTo(x + where[0] + 44, y + where[1] - 45);
                } else{
                    context.moveTo(x + where[0] + 26, y + where[1] - 5);
                    context.lineTo(x + where[0] + 26, y + where[1] + 35);

                }
                context.stroke();
                context.moveTo(x + where[0] + 35, y + where[1] - 14);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1] - 15, x + where[0] + 45, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 45, y + where[1], x + where[0] + 35, y + where[1]);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1], x + where[0] + 25, y + where[1] - 6);
                context.quadraticCurveTo (x + where[0] + 25, y + where[1] - 13, x + where[0] + 35, y + where[1] - 14);
                context.fill()
                context.fillStyle = 'white';
                context.beginPath();
                context.moveTo (x + where[0] + 35, y + where[1] - 12);
                context.quadraticCurveTo (x + where[0] + 40, y + where[1] - 13, x + where[0] + 40, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 40, y + where[1] - 2, x + where[0] + 35, y + where[1] - 2);
                context.quadraticCurveTo (x + where[0] + 31, y + where[1] - 2, x + where[0] + 30, y + where[1] - 6);
                context.quadraticCurveTo (x + where[0] + 31, y + where[1] - 11, x + where[0] + 35, y + where[1] - 12);
                context.fill();
            }
            else if (this.length == "whole"){
                context.font = '75px Arial';
                context.beginPath();
                context.moveTo (x + where[0] + 35, y + where[1] - 16);
                context.quadraticCurveTo (x + where[0] + 48, y + where[1] - 15, x + where[0] + 48, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 48, y + where[1], x + where[0] + 35, y + where[1]);
                context.quadraticCurveTo (x + where[0] + 22, y + where[1], x + where[0] + 22, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 22, y + where[1] - 15, x + where[0] + 35, y + where[1] - 16);
                context.fill()
                context.fillStyle = 'white';
                context.beginPath();
                context.moveTo (x + where[0] + 35, y + where[1] - 14);
                context.quadraticCurveTo (x + where[0] + 43, y + where[1] - 13, x + where[0] + 43, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 43, y + where[1] - 2, x + where[0] + 35, y + where[1] - 2);
                context.quadraticCurveTo (x + where[0] + 28, y + where[1] - 2, x + where[0] + 27, y + where[1] - 8);
                context.quadraticCurveTo (x + where[0] + 28, y + where[1] - 13, x + where[0] + 35, y + where[1] - 14);
                context.fill();
            }                         
        }
        if (100 < where[1]){
            context.lineWidth = 2;
            context.beginPath();
            if (this.fs == "flat" || this.fs == "sharp"){
                context.moveTo(x + where[0], y + 100);
                context.lineTo(x + where[0] + 60, y + 100);
            }
            else{
                context.moveTo(x + where[0] + 10, y + 100);
                context.lineTo(x + where[0] + 55, y + 100);
            }
            context.stroke();
            context.closePath();
        }
        if (where[1] > 120){
            context.lineWidth = 2;
            context.beginPath();
            if (this.fs == "flat" || this.fs == "sharp"){
                context.moveTo(x + where[0], y + 120);
                context.lineTo(x + where[0] + 60, y + 120);
            }
            else{
                context.moveTo(x + where[0] + 10, y + 120);
                context.lineTo(x + where[0] + 55, y + 120);
            }
            context.stroke();
            context.closePath();
        }
        if (where[1] < -10){
            context.lineWidth = 2;
            context.beginPath();
            if (this.fs == "flat" || this.fs == "sharp"){
                context.moveTo(x + where[0], y - 20);
                context.lineTo(x + where[0] + 60, y - 20);
            }
            else{
                context.moveTo(x + where[0] + 10, y - 20);
                context.lineTo(x + where[0] + 55, y - 20);
            }
            context.stroke();
            context.closePath();
        }
        if (where[1] < -30){
            context.lineWidth = 2;
            context.beginPath();
            if (this.fs == "flat" || this.fs == "sharp"){
                context.moveTo(x + where[0], y - 40);
                context.lineTo(x + where[0] + 60, y - 40);
            }
            else{
                context.moveTo(x + where[0] + 10, y - 40);
                context.lineTo(x + where[0] + 55, y - 40);
            }
            context.stroke();
            context.closePath();
        }
        this.pos = [x + where[0] + 20, y + where[1]];
    }
}

class TimeSignature{
    constructor(clef, top, bottom, position){
        this.clef = clef;
        this.top = top;
        this.bottom = bottom;
        this.position = position;
    }

    draw(x, y){
        const canvas = document.getElementById('canvas1');
        const context = canvas.getContext('2d');
        context.font = 'bold 54px serif';
        context.fillText(this.top, x + 80 + this.position, y + 38);
        context.fillText(this.bottom, x + 80 + this.position, y + 78);
    }
}


class KeySignature{
    constructor(clef, notes){
        this.clef = clef;
        this.notes = notes;
    }
    draw(x, y){
        const canvas = document.getElementById('canvas1');
        const context = canvas.getContext('2d');
        context.font = '40px Arial';
        var pos = 0;
        var clef = this.clef
        this.notes.forEach(function (note){
            const where = findNotePosition(clef, note.slice(0,2), 80);
            if (note.slice(2) == "#"){
                const sharp = "\u266F";
                context.fillText(sharp, where[0] + pos + x, where[1] + y + 4);
            }
            else if (note.slice(2) == "b"){
                // const flat = "\u266D";
                // context.fillText(flat, where[0] + pos + x, where[1] + y);
                context.fillStyle = 'black';
                context.lineWidth = 2.5;
                context.beginPath();
                context.moveTo(x + where[0] + 5 + pos, y + where[1] - 30);
                context.lineTo(x + where[0] + 5 + pos, y + where[1]);
                context.quadraticCurveTo(x + where[0] + 15 + pos, y + where[1] - 2, x + where[0] + 15 + pos, y + where[1] - 8);
                context.quadraticCurveTo(x + where[0] + 12 + pos, y + where[1] - 15, x + where[0] + 5 + pos, y + where[1] - 10);
                context.stroke();
                context.closePath();
            }
            pos += 20;
        }); 
    }
}


function findNotePosition(clef, note, position){
    if (clef == "treble"){
        // need to add an additional line for note to sit on
        if (note == "A3"){
            return [position, 128];
        }
        else if (note == "B3"){
            return [position, 118];
        }
        else if (note == "C4"){
            return [position, 108];
        }

        //no additional line needed
        else if (note == "D4"){
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

        //need to add an additional line for notes to sit on
        else if (note == "A5"){
            return [position, -12];
        }
        else if (note == "B5"){
            return [position, -22];
        }
        else if (note == "C6"){
            return [position, -32];
        }
        else if (note == "D6"){
            return [position, -42];
        }

    }
    if (clef == "bass"){
        // need to add an additional line for note to sit on
        if (note == "B1"){
            return [position, 138];
        }
        else if (note == "C2"){
            return [position, 128];
        }
        else if (note == "D2"){
            return [position, 118];
        }
        else if (note == "E2"){
            return [position, 108];
        }

        //no additional line needed
        else if (note == "F2"){
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

        //need to add an additional line for notes to sit on
        else if (note == "C4"){
            return [position, -12];
        }
        else if (note == "D4"){
            return [position, -22];
        }
        else if (note == "E4"){
            return [position, -32];
        }
    }
}

function playNote(note){

    // need to add an additional line for note to sit on
    var frequency;
    if (note == "B1"){
        if (note.fs == "sharp"){
            frequency = 65.41;
        }
        else if (note.fs == "flat"){
            frequency = 58.27;
        }
        else {
            frequency = 61.74;
        }
    }
    else if (note == "C2"){
        if (note.fs == "sharp"){
            frequency = 69.30;
        }
        else if (note.fs == "flat"){
            frequency = 61.74;
        }
        else {
            frequency = 65.41;
        }
    }
    else if (note == "D2"){
        if (note.fs == "sharp"){
            frequency = 77.78;
        }
        else if (note.fs == "flat"){
            frequency = 69.30;
        }
        else {
            frequency = 73.42;
        }
    }
    else if (note == "E2"){
        if (note.fs == "sharp"){
            frequency = 87.31;
        }
        else if (note.fs == "flat"){
            frequency = 77.78;
        }
        else {
            frequency = 82.41;
        }
    }
    else if (note == "F2"){
        if (note.fs == "sharp"){
            frequency = 92.50;
        }
        else if (note.fs == "flat"){
            frequency = 82.41;
        }
        else {
            frequency = 87.31;
        }
    }
    else if (note == "G2"){
        if (note.fs == "sharp"){
            frequency = 103.83;
        }
        else if (note.fs == "flat"){
            frequency = 92.50;
        }
        else {
            frequency = 98;
        }
    }
    else if (note == "A2"){
        if (note.fs == "sharp"){
            frequency = 116.54;
        }
        else if (note.fs == "flat"){
            frequency = 103.83;
        }
        else {
            frequency = 110;
        }
    }
    else if (note == "B2"){
        if (note.fs == "sharp"){
            frequency = 130.81;
        }
        else if (note.fs == "flat"){
            frequency = 116.54;
        }
        else {
            frequency = 123.47;
        }
    }
    else if (note == "C3"){
        if (note.fs == "sharp"){
            frequency = 138.59;
        }
        else if (note.fs == "flat"){
            frequency = 123.47;
        }
        else {
            frequency = 130.81;
        }
    }
    else if (note == "D3"){
        if (note.fs == "sharp"){
            frequency = 155.56;
        }
        else if (note.fs == "flat"){
            frequency = 138.59;
        }
        else {
            frequency = 146.83;
        }
    }
    else if (note == "E3"){
        if (note.fs == "sharp"){
            frequency = 174.61;
        }
        else if (note.fs == "flat"){
            frequency = 155.56;
        }
        else {
            frequency = 164.81;
        }
    }
    else if (note == "F3"){
        if (note.fs == "sharp"){
            frequency = 185;
        }
        else if (note.fs == "flat"){
            frequency = 164.81;
        }
        else {
            frequency = 174.61;
        }
    }
    else if (note == "G3"){
        if (note.fs == "sharp"){
            frequency = 207.65;
        }
        else if (note.fs == "flat"){
            frequency = 185;
        }
        else {
            frequency = 196;
        }
    }
    else if (note == "A3"){
        if (note.fs == "sharp"){
            frequency = 233.08;
        }
        else if (note.fs == "flat"){
            frequency = 207.65;
        }
        else {
            frequency = 220;
        }
    }
    else if (note == "B3"){
        if (note.fs == "sharp"){
            frequency = 261.63;
        }
        else if (note.fs == "flat"){
            frequency = 233.08;
        }
        else {
            frequency = 246.94;
        }
    }
    else if (note == "C4"){
        if (note.fs == "sharp"){
            frequency = 277.18;
        }
        else if (note.fs == "flat"){
            frequency = 246.94;
        }
        else {
            frequency = 261.63;
        }
    }
    else if (note == "D4"){
        if (note.fs == "sharp"){
            frequency = 311.13;
        }
        else if (note.fs == "flat"){
            frequency = 277.18;
        }
        else {
            frequency = 293.66;
        }
    }
    else if (note == "E4"){
        if (note.fs == "sharp"){
            frequency = 349.23;
        }
        else if (note.fs == "flat"){
            frequency = 311.13;
        }
        else {
            frequency = 329.63;
        }
    }
    else if (note == "F4"){
        if (note.fs == "sharp"){
            frequency = 369.99;
        }
        else if (note.fs == "flat"){
            frequency = 329.63;
        }
        else {
            frequency = 349.23;
        }
    }
    else if (note == "G4"){
        if (note.fs == "sharp"){
            frequency = 415.30;
        }
        else if (note.fs == "flat"){
            frequency = 369.99;
        }
        else {
            frequency = 392;
        }
    }
    else if (note == "A4"){
        if (note.fs == "sharp"){
            frequency = 466.16;
        }
        else if (note.fs == "flat"){
            frequency = 415.30;
        }
        else {
            frequency = 440;
        }
    }
    else if (note == "B4"){
        if (note.fs == "sharp"){
            frequency = 523.25;
        }
        else if (note.fs == "flat"){
            frequency = 466.16;
        }
        else {
            frequency = 493.88;
        }
    }
    else if (note == "C5"){
        if (note.fs == "sharp"){
            frequency = 554.37;
        }
        else if (note.fs == "flat"){
            frequency = 493.88;
        }
        else {
            frequency = 523.25;
        }
    }
    else if (note == "D5"){
        if (note.fs == "sharp"){
            frequency = 622.25;
        }
        else if (note.fs == "flat"){
            frequency = 554.37;
        }
        else {
            frequency = 587.33;
        }
    }
    else if (note == "E5"){
        if (note.fs == "sharp"){
            frequency = 698.46;
        }
        else if (note.fs == "flat"){
            frequency = 622.25;
        }
        else {
            frequency = 659.25;
        }
    }
    else if (note == "F5"){
        if (note.fs == "sharp"){
            frequency = 739.99;
        }
        else if (note.fs == "flat"){
            frequency = 659.25;
        }
        else {
            frequency = 698.46;
        }
    }
    else if (note == "G5"){
        if (note.fs == "sharp"){
            frequency = 830.61;
        }
        else if (note.fs == "flat"){
            frequency = 739.99;
        }
        else {
            frequency = 783.99;
        }
    }
    else if (note == "A5"){
        if (note.fs == "sharp"){
            frequency = 932.33;
        }
        else if (note.fs == "flat"){
            frequency = 830.61;
        }
        else {
            frequency = 880;
        }
    }
    else if (note == "B5"){
        if (note.fs == "sharp"){
            frequency = 1046.50;
        }
        else if (note.fs == "flat"){
            frequency = 932.33;
        }
        else {
            frequency = 987.77;
        }
    }
    else if (note == "C6"){
        if (note.fs == "sharp"){
            frequency = 1108.73;
        }
        else if (note.fs == "flat"){
            frequency = 987.77;
        }
        else {
            frequency = 1046.50;
        }
    }
    else if (note == "D6"){
        if (note.fs == "sharp"){
            frequency = 1244.51;
        }
        else if (note.fs == "flat"){
            frequency = 1108.73;
        }
        else {
            frequency = 1174.66;
        }
    }
    
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var oscillator = audioCtx.createOscillator();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    setTimeout(
        function() {
        oscillator.stop();
        }, 200);
}