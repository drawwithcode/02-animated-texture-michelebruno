let cols, rows, bg, howTo,
    scaleX = 100,
    scaleY = 46,
    zoff = 0,
    strkW = 5,
    rainbowMode = true,
    patternIndex = 1,
    increment = 0.07;

const cells = [],
    PATTERNS = [
        ({w, h, col} = {}) => {
            push();

            if (!rainbowMode || typeof col === "undefined") {
                fill(color(235))
            }

            rectMode(CENTER);
            rect(scaleX / 2, scaleY / 2, w, h);

            pop();
        },
        WAVE = ({col, h} = {}) => {
            push();

            h *= 1.1;

            let w = scaleX;

            stroke(col);
            strokeWeight(3)

            for (let i = 0; i < 3; i++) {
                translate(0, cos(frameCount / 6) + h / 3);
                bezier(0, 0, w * .2, 0, w * .2, h * .6, w / 2, h * .6);
                bezier(w / 2, h * .6, w * .8, h * .6, w * .8, 0, w, 0);
            }

            pop();
        },
    ];


function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);

    canvas.parent('#bg');

    frameRate(15)

    bg = color(20)

    scaleX += strkW * 2;
    scaleY += strkW * 2;

    background(bg);

    stroke(bg);

    strokeWeight(strkW)

    cols = floor(width / scaleX) - 1;
    rows = floor(height / scaleY) - 1;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            cells.push(new Cell({x: x * scaleX, y: y * scaleY, cellCol: x, cellRow: y}))
        }
    }
}

function draw() {
    background(bg)

    translate((width % scaleX + scaleX) / 2, height % scaleY);

    let yoff = 0;

    for (let y = 0; y < rows; y++) {

        let xoff = 0;

        for (let x = 0; x < cols; x++) {
            let index = x + y * cols,
                c = cells[index],
                n = noise(xoff + mouseX * increment / 10, yoff + mouseY * increment / 10, zoff),
                n2 = noise(xoff + 1000 + mouseX * increment / 10, yoff + 1000 + mouseY * increment / 10, zoff) * 2,
                col = n2 < 1
                    ? lerpColor(color(255, 0, 0), color(0, 0, 255), n2)
                    : lerpColor(color(0, 0, 255), color(0, 255, 255), n2 - 1);

            c.run({
                col,
                widthRatio: map(n, 0, 1, 0.2, 1),
                heightRatio: map(n, 0, 1, 0.3, .8),
            });
            xoff += increment;
        }

        yoff += increment;
    }

    zoff += increment / 2;

}

function Cell(
    {
        x = 0,
        y = 0,
        col,
        cellWidth = scaleX,
        cellHeight = scaleY,
        cellRow,
        cellCol
    } = {}
) {

    this.x = x;
    this.y = y;
    this.row = cellRow;
    this.col = cellCol;
    this.color = typeof col !== 'undefined' ? col : color(230);
    this.height = cellHeight;
    this.width = cellWidth;
    this.initialHeight = cellHeight;
    this.initialWidth = cellWidth;

    this.draw = function () {
        push();
        fill(this.color)
        translate(this.x, this.y);
        if (patternIndex === 1) {
            this.row % 2 ?
                translate(scaleX / 7, 0) :
                translate(-scaleX / 7, 0);
        }

        this.pattern({w: this.width, h: this.height, col: this.color});
        pop();
    }

    this.run = function ({col, width, widthRatio, heightRatio}) {

        this.pattern = PATTERNS[patternIndex];

        if (typeof width !== "undefined") {
            this.width = width;
        } else if (typeof widthRatio !== "undefined") {
            this.width = this.initialWidth * widthRatio;
        }

        if (typeof heightRatio !== "undefined") {
            this.height = this.initialHeight * heightRatio;
        }

        if (typeof col !== "undefined" && col instanceof p5.Color) {
            this.color = col;
        }

        this.draw();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {

    patternIndex++;

    patternIndex = patternIndex % PATTERNS.length;

    if (patternIndex === 1) {
        increment = 0.03;
    } else increment = 0.07

}