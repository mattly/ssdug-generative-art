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

function doXfs(xfs, val) {
  return xfs.length == 0 ?
    val :
    xfs.reduce((acc, xf) => xf(acc), val)
}

function osc(hzStdDev, hzMax, offsetScale=1) {
  const hz = constrain(randomGaussian(0, hzStdDev), -1 * hzMax, hzMax)
  const offset = random(1) * offsetScale
  return (...xfs) => (time) => doXfs(xfs, (TAU * (offset + (time*hz))) % TAU)
}

function thetaOsc(hzMax, offsetScale=1) {
  let hz = ceil(random(hzMax))
  if (random([true, false])) { hz = -1 * hz }
  const offset = random(TAU) * offsetScale
  console.log(hzMax, hz, offset)
  return (...xfs) =>
    () => doXfs(xfs, (offset + (animLoop.theta * hz)) % TAU)
}

const Times = a => b => a * b
const Plus = a => b => a + b
const Mod = b => a => a % b
const Sin = (bot, top) => v => map(sin(v), -1, 1, bot, top)



const constantly = (val) => () => val

const car2pol = (r, a) => [r * cos(a), r * sin(a)]
