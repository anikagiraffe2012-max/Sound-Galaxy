let fft
let particles = [];
const PARTICLE_COUNT = 1024;

let Particle = function (position) {
    this.position = position
    this.speed = createVector(0,1)
    this.color = [random(0,255), random(0,255), random(0,255)]
    this.diameter = random(5,7);

    this.draw = function () {
        fill(this.color)
        circle(this.position.x, this.position.y, this.diameter)
    }

    this.update = function (energy) {
        this.diameter = random(5,7) + energy * 100
        this.position.y += this.speed.y * energy * 10
        if(this.position.y > height) {
            this.position.y = 0
        }
    }

}

function positionParticles(){
    for (let i = 0; i < PARTICLE_COUNT; i++){
        let pos = createVector(random(width), random(height));
        particles.push(new Particle(pos));
    }
}

function drawParticles(){
    for (let p of particles) {
        p.draw();
    }
}

function updateParticles(spectrum){
    for(let i = 0; i < particles.length; i++) {
        let energy = spectrum[i % spectrum.length] / 255;
        particles[i].update(energy);
    }
}


function setup() {
    createCanvas(windowWidth, windowHeight)
    noStroke()

    let mic = new p5.AudioIn()
    mic.start()

    fft = new p5.FFT();
    fft.setInput(mic)

    positionParticles()
}

function mousePressed() {
    userStartAudio();
}

function draw() {
    fill(0, 0, 0, 20);      
    rect(0, 0, width, height);
    let spectrum = fft.analyze();
    let maxEnergy = max(spectrum); 
    fill(255, 0, 0);
    text(`Max energy: ${maxEnergy}`, 10, 30);
    updateParticles (spectrum)
    drawParticles();
}