const increment = 0.05;

const CELL_PATTERNS = [

    BLANK = () => {
    }, PLAIN = ({w, h} = {}) => {
        push();
        fill(255,0,0)
        rectMode(CENTER);
        rect(w / 2, h / 2, w, h);
        pop();
    },
    STRIPED = ({w, h}) => {
        push();
        let weight = 2;

        strokeWeight(weight)

        stroke(255,255,0);

        translate(strkW, strkW)

        for (let i = 0; i +1  < (h - strkW ) / weight; i += 2) {
            line(
                0,
                i * weight,
                w - strkW * 2,
                i * weight
            );
        }

        pop();
    },
    CHECKERED = ({w, h} = {}) => {
        push();
        translate(strkW, strkW);
        let s = 5,
            c = floor((w - 2 * strkW) / s),
            r = floor((h - 2 * strkW) / s);

        noStroke();

        for (let y = 0; y < r; y++) {
            for (let x = 0; x < c; x++) {
                if ((x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0)) {
                    rect(x * s, y * s, s);
                }
            }
        }

        pop();
    },
]
/**
 *
 * @type {Cell[]}
 */
cells = [];

let cols, rows, fr, bg,
    scaleX = 20,
    scaleY = 110,
    zoff = 0,
    strkW = 3;

function setup() {
    createCanvas(windowWidth, windowHeight);

    bg = color(20);


    scaleX += strkW * 2;
    scaleY += strkW * 2;

    background(bg);

    frameRate(30);

    stroke(bg);


    strokeWeight(strkW)

    cols = floor(width / scaleX) - 2;
    rows = floor(height / scaleY);

    fr = createP('');

    let yoff = 0;
    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
            cells.push(new Cell({x: x * scaleX, y: y * scaleY}))
            xoff += increment;
        }

        yoff += increment;
    }


}

function Cell(
    {
        x = 0,
        y = 0,
        col,
        cellWidth = scaleX,
        cellHeight = scaleY,
        patternIndex = 0
    } = {}
) {

    this.x = x;
    this.y = y;
    this.color = typeof col !== 'undefined' ? col : color(230);
    this.height = cellHeight;
    this.width = cellWidth;
    this.initialHeight = cellHeight;
    this.initialWidth = cellWidth;
    this.patternIndex = patternIndex;
    this.pattern = CELL_PATTERNS[patternIndex];

    this.update = function () {

        let i = abs(this.patternIndex % CELL_PATTERNS.length);

        this.pattern = CELL_PATTERNS[i];

    }

    this.draw = function () {
        push();
        fill(this.color)
        translate(this.x, this.y);

        this.pattern({w: this.width, h: this.height});
        pop();
    }

    this.run = function () {
        this.update();
        this.draw();
    }
}

function draw() {

    background(bg)

    translate(width % scaleX, scaleY + height % scaleY);


    let yoff = 0;
    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
            let index = x + y * cols,
                c = cells[index],
                n = noise(xoff, yoff, zoff),
                n2 = noise(xoff, yoff, zoff / 2);


            // c.width = c.initialWidth * map(n2, 0, 1, .7, 1);
            // c.height = c.initialHeight * n;

            // c.color = color(n * 255);
            c.patternIndex = floor(n2 * CELL_PATTERNS.length);
            c.run();
            xoff += increment;
        }

        yoff += increment;
    }
    iterateGrid(({x, y, xoff, yoff}) => {

    })

    zoff += increment / 2;

    fr.html(floor(frameRate()));
}

function getNoisedColor(n1 = 1, n2 = 1, n3 = 1) {
    return color(255 - n1 * 255, 255 - 255 * n2, 130 * n3);
}

function iterateGrid(callback) {

    if (typeof callback !== "function") return;


}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}