let cols, rows, fr, bg,
    scaleX = 70,
    scaleY = 26,
    zoff = 0,
    strkW = 6,
    rainbowMode = true,
    patternIndex = 0;

const increment = 0.02,
    PALETTE = [],
    PATTERNS = [
        ({w, h, col} = {}) => {

            push();

            if (!rainbowMode || typeof col === "undefined") {
                fill(PALETTE[4])// fill(PALETTE[1])
            }

            rectMode(CENTER);

            rect(scaleX / 2, scaleY / 2, w, h);

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
                        rect(x * s, y * s, w / 6, s);
                    }
                }
            }

            pop();
        },
    ],
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
}

function draw() {
    background(bg)

    translate(width % scaleX, height % scaleY);

    let yoff = 0;

    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
            let index = x + y * cols,
                c = cells[index],
                n = noise(xoff + mouseX * increment / 10, yoff + mouseY * increment / 10, zoff),
                n2 = n * 2,
                col = n2 < 1
                    ? lerpColor(color(255, 0, 0), color(0, 0, 255), n2)
                    : lerpColor(color(0, 0, 255), color(0, 255, 255), n2 - 1);

            // console.log(col, n2, x, y, n)
            c.run({
                col,
                widthRatio: map(n, 0, 1, 0.1, 1),
                heightRatio: map(n, 0, 1, 0.1, 1),
            });
            xoff += increment;
        }

        yoff += increment;
    }
    zoff += increment;


    fr.html(floor(frameRate()));

}

function Cell(
    {
        x = 0,
        y = 0,
        col,
        cellWidth = scaleX,
        cellHeight = scaleY,
    } = {}
) {

    this.x = x;
    this.y = y;
    this.color = typeof col !== 'undefined' ? col : color(230);
    this.height = cellHeight;
    this.width = cellWidth;
    this.initialHeight = cellHeight;
    this.initialWidth = cellWidth;


    this.draw = function () {
        push();
        fill(this.color)
        translate(this.x, this.y);
        this.pattern({w: this.width, h: this.height, col: this.color});
        pop();
    }

    this.run = function ({col, width, widthRatio, heightRatio}) {

        this.pattern = PATTERNS[0];

        if (typeof width !== "undefined") {
            this.width = width;
        } else if (typeof widthRatio !== "undefined") {
            this.width = this.initialWidth * widthRatio;
        }
        if (typeof heightRatio !== "undefined") {
            this.height = this.initialHeight * heightRatio;
        }

        if (typeof col !== "undefined" && col instanceof p5.Color)
            this.color = col;

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

    // patternIndex++;

    // patternIndex = patternIndex % PATTERNS.length;
}