let cols, rows, fr, bg,
    scaleX = 30,
    scaleY = 80,
    zoff = 0,
    strkW = 4,
    rainbowMode = false;

const increment = 0.05,
    PALETTE = [],
    /**
     * @type {Eater[]}
     */
    EATERS = [],
    EATER_ACTION = [
        ADDS = true,
        REMOVES = false,
    ],
    CELL_PATTERNS = [
        BLANK = ({w, h, col} = {}) => {
            noFill();

            rainbowMode ? stroke(col) : stroke(PALETTE[1])
            rectMode(CENTER);
            rect(w / 2, h / 2, w - strkW * 2, h - strkW * 2);

        },
        PLAIN = ({w, h, col} = {}) => {
            push();

            if (!rainbowMode || typeof col === "undefined") {
                fill(PALETTE[1])
            }

            rectMode(CENTER);
            rect(w / 2, h / 2, w, h);
            pop();
        },
        STRIPED = ({w, h, col = PALETTE[2]}) => {
            push();

            let weight = 6;

            strokeWeight(weight);


            if (rainbowMode && typeof col !== "undefined") {
                stroke(col);
            } else stroke(PALETTE[2]);


            translate(strkW, strkW);

            for (let i = 0; (i + 1) < (h - strkW) / weight; i += 2) {
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

            if (!rainbowMode)
                fill(PALETTE[PALETTE.length - 1])

            for (let y = 0; y < r; y++) {
                for (let x = 0; x < c; x++) {
                    if ((x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0)) {
                        rect(x * s, y * s, s);
                    }
                }
            }

            pop();
        },
    ],
    /**
     * @type {Cell[]}
     */
    cells = [];

function setup() {
    createCanvas(windowWidth, windowHeight);

    PALETTE.push(color(20), color(10, 255, 0), color(255, 255, 0), color(255, 0, 0), color(235));

    bg = PALETTE[0];

    scaleX += strkW * 2;
    scaleY += strkW * 2;

    background(bg);

    stroke(bg);

    strokeWeight(strkW)

    cols = floor(width / scaleX) - 2;
    rows = floor(height / scaleY);

    fr = createP('');

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            cells.push(new Cell({x: x * scaleX, y: y * scaleY}))
        }

    }

    let eatersCount = random([2, 5, 8])

    for (let i = 0; i < eatersCount; i++) {
        // EATERS.push(new Eater({col: floor(random(cols)), row: floor(random(rows))}))
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


            c.run({
                patternIndex: floor(n2 * CELL_PATTERNS.length),
                col: getNoisedColor(n, n2)
            });
            xoff += increment;
        }

        yoff += increment;
    }
    zoff += increment / 2;

    EATERS.forEach(e => e.run());

    fr.html(floor(frameRate()));
}

/**
 *
 * @param action
 * @param direction
 * @param col
 * @param row
 * @constructor
 */
function Eater(
    {
        action = ADDS,
        direction,
        col,
        row
    }
) {
    this.action = action;
    this.direction = noise(zoff) * TWO_PI;
    this.col = col;
    this.row = row;

    console.log("New eater", this)

    this.draw = function () {

        push();

        fill('orange');

        ellipseMode(CORNER);

        ellipse(this.col * scaleX, this.row * scaleY, this.scaleX, this.scaleX);

        pop();
    };

    this.run = function () {
        // Calculates current index

        // Takes action if position changed

        this.draw();


    };


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
        this.pattern({w: this.width, h: this.height, col: this.color});
        pop();
    }

    this.run = function ({patternIndex, col}) {
        if (typeof patternIndex !== "undefined")
            this.patternIndex = patternIndex;

        if (typeof col !== "undefined")
            this.color = col;

        this.update();
        this.draw();
    }
}


function getNoisedColor(n1 = 1, n2 = 1, n3 = abs(cos(frameCount / 10))) {
    return color(255 - n1 * 255, 255 - 255 * n2, 255 * n3);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    rainbowMode = !rainbowMode;
}