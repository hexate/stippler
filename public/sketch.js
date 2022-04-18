let width = 500;
let height = 500;
const amp = 100;
const period = 100;
const pointCount = 1000;
const speed = 100;

const n = 1000;
let sweep = 0;
const totalSweeps = 12;
const pointR = 4;
let delaunay;
let voronoi;
let img;
let imgData;
let points;
let c;
let s;
let colors;

function preload(){
    let imgFile = "./gradient.png";
    img = loadImage(imgFile);
}

function setup() {
    createCanvas(1000, 1000);
    image(img, 0, 0);
    imgData = get();

    points = new Float64Array(n * 2);
    c = new Float64Array(n * 2);
    s = new Float64Array(n);
    colors = new Array(n);

    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < 30; ++j) {
            const x = points[i * 2] = Math.floor(Math.random() * width);
            const y = points[i * 2 + 1] = Math.floor(Math.random() * height);
            // if (Math.random() < data[y * width + x]) break;
            let p = imgData.get(x, y);
            //console.log(p);
            if (Math.random() < 1 - p[0] / 254) break;
        }
    }
    delaunay = new d3.Delaunay(points);
    voronoi = delaunay.voronoi([0, 0, width, height]);
}

function drawWave() {
    background(0);
    noFill();
    stroke(255);
    beginShape();
    for (let i = 0; i <= points; i++) {
        let y = height/2;
        vertex(i*width/points, y+amp*sin(i/period+frameCount/speed));
    }
    endShape();
}

function draw() {
    clear();
    noStroke();
    //rect(ul.x, ul.y, width, height - 1);

    if (sweep < totalSweeps) {
        console.log("sweep: " + sweep);
        // Compute the weighted centroid for each Voronoi cell.
        c.fill(0);
        s.fill(0);
        colors.fill(0);
        for (let y = 0, i = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                //const w = data[y * width + x];
                let color = imgData.get(x, y);
                const w = 1 - color[0] / 254;
                //console.log(w);
                i = delaunay.find(x + 0.5, y + 0.5, i);
                s[i] += w;
                c[i * 2] += w * (x + 0.5);
                c[i * 2 + 1] += w * (y + 0.5);
                colors[i] = color;
            }
        }

        const w = Math.pow(sweep + 1, -0.8) * 10;
        for (let i = 0; i < n; ++i) {
        const x0 = points[i * 2], y0 = points[i * 2 + 1];
        const x1 = s[i] ? c[i * 2] / s[i] : x0, y1 = s[i] ? c[i * 2 + 1] / s[i] : y0;
        points[i * 2] = x0 + (x1 - x0) * 1.8 + (Math.random() - 0.5) * w;
        points[i * 2 + 1] = y0 + (y1 - y0) * 1.8 + (Math.random() - 0.5) * w;
        }

        voronoi.update();
        sweep++;
    }

    for (let i = 0; i < n; i++) {
        const x = points[i * 2], y = points[i * 2 + 1];
        const color = colors[i];
        
        let d1 = Math.abs(color[0] - color[1]);
        let d2 = Math.abs(color[1] - color[2]);
        let isGrey = d1 < 10 && d2 < 10;
        isGrey = true;

        noStroke();
        if (isGrey) {
            fill(0);
        } else {
            fill(color[0], color[1], color[2]);
        }
        //rect(ul.x + x, ul.y + y, pointR, pointR);
        ellipse(x, y, pointR, pointR);
    }
}