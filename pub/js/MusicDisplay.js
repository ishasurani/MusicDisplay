"use strict";
const log = console.log;

(function(global, document, $) { 

    function _checkNoteClicked(md, e){
        const canvas = md.canvas;
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
                        var fs = note.fs;
                        if (fs == ""){
                            staff.keySignature.forEach(function(n){
                                if (n.slice(0,1) == note.note.slice(0,1)){
                                    if (n.slice(1,2) == 'b'){
                                        fs = "flat";
                                    }
                                    else if (n.slice(1,2) == '#'){
                                        fs = "sharp";
                                    }
                                }
                            })
                        }
                        if (fs == "sharp"){
                            context.fillText(note.note + "#", note.pos[0], staff.y - 65);
                        } 
                        else if (fs == "flat"){
                            context.fillText(note.note + "b", note.pos[0], staff.y - 65);
                        }
                        else{
                            context.fillText(note.note, note.pos[0], staff.y - 65);
                        }
                        note.clicked = true;
                        if (staff.playNote){
                            _playNote(staff, note);
                        }
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

    function _checkNoteClicked2(md, e){
        const canvas = md.canvas;
        const r = canvas.getBoundingClientRect();
        const pos = {
            x: e.clientX - r.left,
            y: e.clientY - r.top
        };

        md.play.forEach(staff => 
            staff.notes.forEach(
                function(note){
                    if ((pos.x >= note.pos[0] && pos.x <= note.pos[0] + 40) && (pos.y >= note.pos[1] - 40 && pos.y <= note.pos[1]) && (!note.clicked)){
                        _playNote(staff, note);
                    }
                }
            )
        )
    }

    function _checkHovered(md, e){   
        const canvas = md.canvas;
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
                        var fs = note.fs;
                        if (fs == ""){
                            staff.keySignature.forEach(function(n){
                                if (n.slice(0,1) == note.note.slice(0,1)){
                                    if (n.slice(1,2) == 'b'){
                                        fs = "flat";
                                    }
                                    else if (n.slice(1,2) == '#'){
                                        fs = "sharp";
                                    }
                                }
                            })
                        }
                        if (fs == "sharp"){
                            context.fillText(note.note + "#", note.pos[0], staff.y - 65);
                        } 
                        else if (fs == "flat"){
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

    /**
     * A MusicDisplay object
     */
    class MusicDisplay {
        constructor(divId) {
            this.staves = [];
            this.click = [];
            this.hover = [];
            this.play = [];
            this.canvas = document.createElement('canvas');
            this.div = document.getElementById(divId);
            this.div.appendChild(this.canvas);
        }

        /**
         * This function makes a staff.
         * @param {String} clef the clef (treble or bass)
         * @param {number} x the x coordinate of the Staff
         * @param {number} y the y coordinate of the Staff
         * @param {number} length the length of the Staff
         * @param {String} method when the note name should be shown (hover, click, or both)
         * @param {boolean} ShowHideButton Whether a Show Notes and a Hide Notes Button should be made
         * @param {boolean} playNote Whether the notes be played when clicked
         * @returns {Staff} the new Staff
         */
        makeStaff(clef, x, y, length, method, ShowHideButton, playNote) {
            this.canvas.width = length + 20;
            this.canvas.height = 300;
            this.canvas.style.position = "absolute";
            this.canvas.style.left = x + "px";
            this.canvas.style.top = y + 20 + "px";
            const s = new Staff(clef, 0, 0, length, this.canvas, ShowHideButton, this.div, playNote);
            this.staves.push(s);
            if (method == "click"){
                if (this.click.length == 0){
                    this.canvas.addEventListener('click', _checkNoteClicked.bind(null, this));
                }
                this.click.push(s);
            }
            else if (method == "both"){
                if (this.click.length == 0){
                    this.canvas.addEventListener('click', _checkNoteClicked.bind(null, this));
                }
                if (this.hover.length == 0){
                    this.canvas.addEventListener("mousemove", _checkHovered.bind(null, this));
                }
                this.click.push(s);
                this.hover.push(s);
            }
            else if (method == "hover") {
                if (this.hover.length == 0){
                    this.canvas.addEventListener("mousemove", _checkHovered.bind(null, this));
                }
                if (playNote){
                    if (this.play.length == 0){
                        this.canvas.addEventListener('click', _checkNoteClicked2.bind(null, this));
                    }
                    this.play.push(s);
                }
                this.hover.push(s);
            }
            else if (playNote){
                if (this.play.length == 0){
                    this.canvas.addEventListener('click', _checkNoteClicked2.bind(null, this));
                }
                this.play.push(s);
            }

            return s;
        }
    }

    /**
     * A Staff object
     * @param {String} clef the clef (treble or bass)
     * @param {number} x the x coordinate of the Staff
     * @param {number} y the y coordinate of the Staff
     * @param {number} length the length of the Staff
     * @param {HTMLCanvasElement} canvas the canvas
     * @param {boolean} ShowHideButton Whether a Show Notes and a Hide Notes Button should be made
     * @param {HTMLDivElement} div the div
     * @param {boolean} playNote Whether the notes be played when clicked
     */
    class Staff {
        constructor(clef, x, y, length, canvas, ShowHideButton, div, playNote) {
            this.x = x;
            this.y = y + 80;
            this.length = length;
            this.currPosition = 10;
            this.clef = clef;
            this.notes = [];
            this.canvas = canvas;
            this.playNote = playNote;
            this.keySignature = [];
            if (ShowHideButton){
                const showButton = document.createElement('button');
                showButton.innerHTML = "Show Notes";
                showButton.style.padding = "8px";
                showButton.style.position = "absolute";
                showButton.style.backgroundColor = "#008CBA";
                showButton.style.color = "white";
                showButton.style.border = "0px";
                showButton.style.borderRadius = "4px";
                showButton.style.fontSize = "15px";
                showButton.style.left = this.canvas.style.left;
                showButton.style.top = 220 + parseInt(this.canvas.style.top) + "px";
                showButton.style.cursor = "pointer";
                const hideButton = document.createElement('button');
                hideButton.innerHTML = "Hide Notes";
                hideButton.style.padding = "8px";
                hideButton.style.position = "absolute";
                hideButton.style.backgroundColor = "#008CBA";
                hideButton.style.color = "white";
                hideButton.style.border = "0px";
                hideButton.style.borderRadius = "4px";
                hideButton.style.fontSize = "15px";
                hideButton.style.left = 120 + parseInt(this.canvas.style.left) + "px";
                hideButton.style.top = 220 + parseInt(this.canvas.style.top) + "px";
                hideButton.style.cursor = "pointer";
                div.appendChild(showButton);
                div.appendChild(hideButton);
                _showAll(this, showButton);
                _hideAll(this, hideButton);
            }
        }

        /**
         * This function draws a note.
         * @param {String} fs flat, sharp, or neither
         * @param {String} note the note name
         * @param {String} length note length (whole, half, quarter)
         */
        addNote(fs, note, length) {
            const newNote = new Note(this.clef, fs, note, length, this.canvas);
            newNote.draw(this.x, this.y, this.currPosition);
            this.currPosition += 60;
            this.notes.push(newNote);
        }

        /**
         * This function draws the time signature.
         * @param {String} top number of beats per measure
         * @param {String} bottom the type of beat
         */
        addTimeSignature(top, bottom){
            const ts = new TimeSignature(this.clef, top, bottom, this.currPosition, this.canvas);
            ts.draw(this.x, this.y);
            this.currPosition += 120;
        }

        /**
         * This function draws a key signature.
         * @param {Array<String>} notes an array of notes in key signature (eg. [E4b, C3#, B3b]) 
         */
        addKeySignature(notes) {
            const staff = this;
            notes.forEach(function(note){
                staff.keySignature.push(note.slice(0,1) + note.slice(2,3));
            })
            const ks = new KeySignature(this.clef, notes, this.canvas);
            ks.draw(this.x, this.y);
            this.currPosition += 20*(notes.length);
        }

        /**
         * This function draws a bar line.
         */
        addBarLine(){
            const context = this.canvas.getContext('2d');
            this.currPosition += 5;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(this.x + this.currPosition, this.y);
            context.lineTo(this.x + this.currPosition, this.y + 80);
            context.stroke();
            context.closePath();
            this.currPosition += 5;
        }

        /**
         * This function draws a double bar line.
         */
        addDoubleBarLine(){
            const context = this.canvas.getContext('2d');
            this.currPosition += 10;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(this.x + this.currPosition, this.y);
            context.lineTo(this.x + this.currPosition, this.y + 80);
            context.stroke();
            context.closePath();
            context.beginPath();
            context.moveTo(this.x + this.currPosition + 10, this.y);
            context.lineTo(this.x + this.currPosition + 10, this.y + 80);
            context.stroke();
            context.closePath();
        }

        /**
         * This function draws a rest.
         * @param {String} length the length of the rest (whole, half, quarter)
         */
        addRest(length){
            const context = this.canvas.getContext('2d');
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
                context.lineWidth = 4;
                context.beginPath();
                context.moveTo(this.x + this.currPosition + 2, this.y + 72);
                context.quadraticCurveTo(this.x + this.currPosition - 12, this.y + 53, this.x + this.currPosition + 10, this.y + 58);
                context.quadraticCurveTo(this.x + this.currPosition - 10, this.y + 37, this.x + this.currPosition + 5, this.y + 33);
                context.quadraticCurveTo( this.x + this.currPosition + 13, this.y + 30, this.x + this.currPosition, this.y + 15);
                context.stroke();
                context.closePath();
            }
            this.currPosition += 30;
        }

        /**
         * This function draws the staff and the clef.
         */
        draw(){
            const context = this.canvas.getContext('2d');
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

    function _showAll(staff, showButton){
        const context = staff.canvas.getContext('2d');
        const s = staff;
        showButton.onclick = function(){
            s.notes.forEach(
                function(note){
                    if (!note.clicked){
                        context.font = '20px Arial';
                        context.fillStyle = 'black';
                        var fs = note.fs;
                        if (fs == ""){
                            staff.keySignature.forEach(function(n){
                                if (n.slice(0,1) == note.note.slice(0,1)){
                                    if (n.slice(1,2) == 'b'){
                                        fs = "flat";
                                    }
                                    else if (n.slice(1,2) == '#'){
                                        fs = "sharp";
                                    }
                                }
                            })
                        }
                        if (fs == "sharp"){
                            context.fillText(note.note + "#", note.pos[0], s.y - 65);
                        } 
                        else if (fs == "flat"){
                            context.fillText(note.note + "b", note.pos[0], s.y - 65);
                        }
                        else{
                            context.fillText(note.note, note.pos[0], s.y - 65);
                        }
                        note.clicked = true;
                    }
                }
            )
        }
    }

    function _hideAll(staff, hideButton){
        const context = staff.canvas.getContext('2d');
        const s = staff;
        hideButton.onclick = function(){
            s.notes.forEach(
                function(note){
                    if (note.clicked){
                        context.fillStyle = 'white';
                        context.fillRect(note.pos[0], s.y - 82, 40, 20);
                        note.clicked = false;
                    }
                }
            )
        }
    }

    class Note{
        constructor(clef, fs, note, length, canvas){
            this.clef = clef;
            this.fs = fs;
            this.note = note;
            this.length = length;
            this.pos = 0;
            this.displayed = false;
            this.clicked = false;
            this.canvas = canvas;
        }

        draw(x, y, position){
            const context = this.canvas.getContext('2d');
            context.font = '35px Arial';
            context.fillStyle = 'black';
            const where = _findNotePosition(this.clef, this.note, position);
            if (this.fs == "sharp"){
                context.font = '35px Arial';
                const sharp = "\u266F";
                context.fillText(sharp, x + where[0] + 5, y + where[1]);
                if (this.length == "quarter"){
                    context.beginPath();
                    if (where[1] > 40) {
                        context.moveTo(x + where[0] + 44, y + where[1] - 5);
                        context.lineTo(x + where[0] + 44, y + where[1] - 45);
                    } else{
                        context.moveTo(x + where[0] + 26, y + where[1] - 5);
                        context.lineTo(x + where[0] + 26, y + where[1] + 35);

                    }
                    context.stroke();
                    context.moveTo(x + where[0] + 35, y + where[1] - 16);
                    context.quadraticCurveTo (x + where[0] + 45, y + where[1] - 16, x + where[0] + 45, y + where[1] - 8);
                    context.quadraticCurveTo (x + where[0] + 45, y + where[1], x + where[0] + 35, y + where[1]);
                    context.quadraticCurveTo (x + where[0] + 25, y + where[1], x + where[0] + 25, y + where[1] - 6);
                    context.quadraticCurveTo (x + where[0] + 25, y + where[1] - 16, x + where[0] + 35, y + where[1] - 16);
                    context.fill()
                } 
                else if (this.length == "half"){
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
                context.fillStyle = 'black';
                context.lineWidth = 2.5;
                context.beginPath();
                context.moveTo(x + where[0] + 5, y + where[1] - 30);
                context.lineTo(x + where[0] + 5, y + where[1]);
                context.quadraticCurveTo(x + where[0] + 15, y + where[1] - 2, x + where[0] + 15, y + where[1] - 8);
                context.quadraticCurveTo(x + where[0] + 12, y + where[1] - 15, x + where[0] + 5, y + where[1] - 10);
                context.stroke();
                context.closePath();
                if (this.length == "quarter"){
                    context.beginPath();
                    if (where[1] > 40) {
                        context.moveTo(x + where[0] + 44, y + where[1] - 5);
                        context.lineTo(x + where[0] + 44, y + where[1] - 45);
                    } else{
                        context.moveTo(x + where[0] + 26, y + where[1] - 5);
                        context.lineTo(x + where[0] + 26, y + where[1] + 35);

                    }
                    context.stroke();
                    context.moveTo(x + where[0] + 35, y + where[1] - 16);
                    context.quadraticCurveTo (x + where[0] + 45, y + where[1] - 16, x + where[0] + 45, y + where[1] - 8);
                    context.quadraticCurveTo (x + where[0] + 45, y + where[1], x + where[0] + 35, y + where[1]);
                    context.quadraticCurveTo (x + where[0] + 25, y + where[1], x + where[0] + 25, y + where[1] - 6);
                    context.quadraticCurveTo (x + where[0] + 25, y + where[1] - 16, x + where[0] + 35, y + where[1] - 16);
                    context.fill()
                } 
                else if (this.length == "half"){
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
                    context.beginPath();
                    if (where[1] > 40) {
                        context.moveTo(x + where[0] + 44, y + where[1] - 5);
                        context.lineTo(x + where[0] + 44, y + where[1] - 45);
                    } else{
                        context.moveTo(x + where[0] + 26, y + where[1] - 5);
                        context.lineTo(x + where[0] + 26, y + where[1] + 35);

                    }
                    context.stroke();
                    context.moveTo(x + where[0] + 35, y + where[1] - 16);
                    context.quadraticCurveTo (x + where[0] + 45, y + where[1] - 16, x + where[0] + 45, y + where[1] - 8);
                    context.quadraticCurveTo (x + where[0] + 45, y + where[1], x + where[0] + 35, y + where[1]);
                    context.quadraticCurveTo (x + where[0] + 25, y + where[1], x + where[0] + 25, y + where[1] - 6);
                    context.quadraticCurveTo (x + where[0] + 25, y + where[1] - 16, x + where[0] + 35, y + where[1] - 16);
                    context.fill()
                } 
                else if (this.length == "half"){
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
        constructor(clef, top, bottom, position, canvas){
            this.clef = clef;
            this.top = top;
            this.bottom = bottom;
            this.position = position;
            this.canvas = canvas;
        }

        draw(x, y){
            const context = this.canvas.getContext('2d');
            context.font = 'bold 54px serif';
            context.fillText(this.top, x + 80 + this.position, y + 38);
            context.fillText(this.bottom, x + 80 + this.position, y + 78);
        }
    }


    class KeySignature{
        constructor(clef, notes, canvas){
            this.clef = clef;
            this.notes = notes;
            this.canvas = canvas;
        }
        draw(x, y){
            const context = this.canvas.getContext('2d');
            context.font = '40px Arial';
            var pos = 0;
            var clef = this.clef
            this.notes.forEach(function (note){
                const where = _findNotePosition(clef, note.slice(0,2), 80);
                if (note.slice(2) == "#"){
                    const sharp = "\u266F";
                    context.fillText(sharp, where[0] + pos + x, where[1] + y + 4);
                }
                else if (note.slice(2) == "b"){
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


    function _findNotePosition(clef, note, position){
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

    function _playNote(staff, note){

        var frequency;
        var fs = note.fs;
        if (fs == ""){
            staff.keySignature.forEach(function(n){
                if (n.slice(0,1) == note.note.slice(0,1)){
                    if (n.slice(1,2) == 'b'){
                        fs = "flat";
                    }
                    else if (n.slice(1,2) == '#'){
                        fs = "sharp";
                    }
                }
            })
        }
        if (note.note == "B1"){
            if (fs == "sharp"){
                frequency = 65.41;
            }
            else if (fs == "flat"){
                frequency = 58.27;
            }
            else {
                frequency = 61.74;
            }
        }
        else if (note.note == "C2"){
            if (fs == "sharp"){
                frequency = 69.30;
            }
            else if (fs == "flat"){
                frequency = 61.74;
            }
            else {
                frequency = 65.41;
            }
        }
        else if (note.note == "D2"){
            if (fs == "sharp"){
                frequency = 77.78;
            }
            else if (fs == "flat"){
                frequency = 69.30;
            }
            else {
                frequency = 73.42;
            }
        }
        else if (note.note == "E2"){
            if (fs == "sharp"){
                frequency = 87.31;
            }
            else if (fs == "flat"){
                frequency = 77.78;
            }
            else {
                frequency = 82.41;
            }
        }
        else if (note.note == "F2"){
            if (fs == "sharp"){
                frequency = 92.50;
            }
            else if (fs == "flat"){
                frequency = 82.41;
            }
            else {
                frequency = 87.31;
            }
        }
        else if (note.note == "G2"){
            if (fs == "sharp"){
                frequency = 103.83;
            }
            else if (fs == "flat"){
                frequency = 92.50;
            }
            else {
                frequency = 98;
            }
        }
        else if (note.note == "A2"){
            if (fs == "sharp"){
                frequency = 116.54;
            }
            else if (fs == "flat"){
                frequency = 103.83;
            }
            else {
                frequency = 110;
            }
        }
        else if (note.note == "B2"){
            if (fs == "sharp"){
                frequency = 130.81;
            }
            else if (fs == "flat"){
                frequency = 116.54;
            }
            else {
                frequency = 123.47;
            }
        }
        else if (note.note == "C3"){
            if (fs == "sharp"){
                frequency = 138.59;
            }
            else if (fs == "flat"){
                frequency = 123.47;
            }
            else {
                frequency = 130.81;
            }
        }
        else if (note.note == "D3"){
            if (fs == "sharp"){
                frequency = 155.56;
            }
            else if (fs == "flat"){
                frequency = 138.59;
            }
            else {
                frequency = 146.83;
            }
        }
        else if (note.note == "E3"){
            if (fs == "sharp"){
                frequency = 174.61;
            }
            else if (fs == "flat"){
                frequency = 155.56;
            }
            else {
                frequency = 164.81;
            }
        }
        else if (note.note == "F3"){
            if (fs == "sharp"){
                frequency = 185;
            }
            else if (fs == "flat"){
                frequency = 164.81;
            }
            else {
                frequency = 174.61;
            }
        }
        else if (note.note == "G3"){
            if (fs == "sharp"){
                frequency = 207.65;
            }
            else if (fs == "flat"){
                frequency = 185;
            }
            else {
                frequency = 196;
            }
        }
        else if (note.note == "A3"){
            if (fs == "sharp"){
                frequency = 233.08;
            }
            else if (fs == "flat"){
                frequency = 207.65;
            }
            else {
                frequency = 220;
            }
        }
        else if (note.note == "B3"){
            if (fs == "sharp"){
                frequency = 261.63;
            }
            else if (fs == "flat"){
                frequency = 233.08;
            }
            else {
                frequency = 246.94;
            }
        }
        else if (note.note == "C4"){
            if (fs == "sharp"){
                frequency = 277.18;
            }
            else if (fs == "flat"){
                frequency = 246.94;
            }
            else {
                frequency = 261.63;
            }
        }
        else if (note.note == "D4"){
            if (fs == "sharp"){
                frequency = 311.13;
            }
            else if (fs == "flat"){
                frequency = 277.18;
            }
            else {
                frequency = 293.66;
            }
        }
        else if (note.note == "E4"){
            if (fs == "sharp"){
                frequency = 349.23;
            }
            else if (fs == "flat"){
                frequency = 311.13;
            }
            else {
                frequency = 329.63;
            }
        }
        else if (note.note == "F4"){
            if (fs == "sharp"){
                frequency = 369.99;
            }
            else if (fs == "flat"){
                frequency = 329.63;
            }
            else {
                frequency = 349.23;
            }
        }
        else if (note.note == "G4"){
            if (fs == "sharp"){
                frequency = 415.30;
            }
            else if (fs == "flat"){
                frequency = 369.99;
            }
            else {
                frequency = 392;
            }
        }
        else if (note.note == "A4"){
            if (fs == "sharp"){
                frequency = 466.16;
            }
            else if (fs == "flat"){
                frequency = 415.30;
            }
            else {
                frequency = 440;
            }
        }
        else if (note.note == "B4"){
            if (fs == "sharp"){
                frequency = 523.25;
            }
            else if (fs == "flat"){
                frequency = 466.16;
            }
            else {
                frequency = 493.88;
            }
        }
        else if (note.note == "C5"){
            if (fs == "sharp"){
                frequency = 554.37;
            }
            else if (fs == "flat"){
                frequency = 493.88;
            }
            else {
                frequency = 523.25;
            }
        }
        else if (note.note == "D5"){
            if (fs == "sharp"){
                frequency = 622.25;
            }
            else if (fs == "flat"){
                frequency = 554.37;
            }
            else {
                frequency = 587.33;
            }
        }
        else if (note.note == "E5"){
            if (fs == "sharp"){
                frequency = 698.46;
            }
            else if (fs == "flat"){
                frequency = 622.25;
            }
            else {
                frequency = 659.25;
            }
        }
        else if (note.note == "F5"){
            if (fs == "sharp"){
                frequency = 739.99;
            }
            else if (fs == "flat"){
                frequency = 659.25;
            }
            else {
                frequency = 698.46;
            }
        }
        else if (note.note == "G5"){
            if (fs == "sharp"){
                frequency = 830.61;
            }
            else if (fs == "flat"){
                frequency = 739.99;
            }
            else {
                frequency = 783.99;
            }
        }
        else if (note.note == "A5"){
            if (fs == "sharp"){
                frequency = 932.33;
            }
            else if (fs == "flat"){
                frequency = 830.61;
            }
            else {
                frequency = 880;
            }
        }
        else if (note.note == "B5"){
            if (fs == "sharp"){
                frequency = 1046.50;
            }
            else if (fs == "flat"){
                frequency = 932.33;
            }
            else {
                frequency = 987.77;
            }
        }
        else if (note.note == "C6"){
            if (fs == "sharp"){
                frequency = 1108.73;
            }
            else if (fs == "flat"){
                frequency = 987.77;
            }
            else {
                frequency = 1046.50;
            }
        }
        else if (note.note == "D6"){
            if (fs == "sharp"){
                frequency = 1244.51;
            }
            else if (fs == "flat"){
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

        var time;
        if (note.length == "quarter"){
            time = 150;
        }
        if (note.length == "half"){
            time = 300;
        }
        if (note.length == "whole"){
            time = 600;
        }

        setTimeout(
            function() {
            oscillator.stop();
            }, time);
    }

    // class MusicQuiz{
        
    // }

    global.MusicDisplay = global.MusicDisplay || MusicDisplay;
})(window, window.document);