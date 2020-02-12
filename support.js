document.write('<script src="https://cdn.jsdelivr.net/npm/p5@0.10.2/lib/p5.js"></script>')
document.write('<script src="https://unpkg.com/p5.createloop@0.1.3/dist/p5.createloop.js"></script>')
document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.1.0/chroma.min.js"></script>')
document.write('<link rel="stylesheet" href="../main.css" />')

let w = 800
let h = 800
let startTime = Date.now()
let now = 0
let saveGif = false
let loopDuration = 12
let framerate = 24

function size(s) { w = s; h = s; }

function setup() {
  startTime = Date.now()
  mySetup()
  frameRate(framerate)
  createCanvas(w, h)
  createLoop({
    duration: loopDuration,
    gif: saveGif ? { download: saveGif, loop: 1 } : false,
  })
}

let prevTheta = 0

function draw() {
  clear()
  now = (Date.now() - startTime) / 1000
  if (prevTheta > animLoop.theta) { console.log('loop!') }
  prevTheta = animLoop.theta
  myDraw()
}

function osc(hzStdDev, hzMax, xf) {
  if (!xf) { xf = (v) => v }
  const hz = constrain(randomGaussian(0, hzStdDev), -1 * hzMax, hzMax)
  const offset = random(1)
  return (time) => xf((TAU * (offset + (time*hz))) % TAU)
}

function thetaOsc(hzMax, xf) {
  if (!xf) { xf = v => v }
  let hz = ceil(random(hzMax))
  if (random([true, false])) { hz = -1 * hz }
  const offset = random(TAU)
  console.log(hzMax, hz, offset)
  return () => xf((offset + (animLoop.theta * hz)) % TAU)
}

const constantly = (val) => () => val

const car2pol = (r, a) => [r * cos(a), r * sin(a)]
