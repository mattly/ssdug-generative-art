let w = 1000
let h = 1000
let startTime = Date.now()
let now = 0
let saveGif = false
let loopDuration = 0
let framerate = 24
let seed = Date.now()
let threeD = false

function size(s) { w = s; h = s; }

function setup() {
  startTime = Date.now()
  mySetup()
  frameRate(framerate)
  createCanvas(w, h, threeD ? WEBGL : P2D)
  console.log('setting random seed', seed)
  randomSeed(seed)
  noiseSeed(seed)
  if (loopDuration > 0) {
    createLoop({
      duration: loopDuration,
      gif: saveGif ? { download: saveGif, loop: 1 } : false,
    })
  } else {
    noLoop()
  }
}

let prevTheta = 0

function draw() {
  clear()
  now = (Date.now() - startTime) / 1000
  if (loopDuration > 0) {
    if (prevTheta > animLoop.theta) { console.log('loop!') }
    prevTheta = animLoop.theta
  }
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
