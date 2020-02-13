const circles = []
let minRadius = 0

function mySetup() {
  loopDuration = 12
  let r = randomGaussian(w / 12)
  const hueBaseVal = random(360)
  const hueBaseSpread = random(120)
  const hueBase = thetaOsc(2)(Sin(hueBaseVal - hueBaseSpread, hueBaseVal + hueBaseSpread))
  while (r < w * 0.98) {
    let circle = { i: circles.length, r }
    let rv = constrain(abs(randomGaussian(0, r / w)), 0, 1)
    if (circle.i == 1) {
      minRadius = circle.r - (rv * 2)
    }
    circle.radius = thetaOsc(2,0)(Sin(1 - rv, 1), Times(circle.r))
    const hueSpread = constrain(randomGaussian(0, 90), 360, 360)
    circle.hueBase = hueBase
    circle.hue = thetaOsc(3)(Sin(-1*hueSpread, hueSpread))
    circle.sat = thetaOsc(7,0.33)(Sin(circle.r / w * 30, circle.r / w * 70))
    const litBase = pow(1/circle.i, 0.25) * 90
    circle.lit = thetaOsc(4, 0.5)(Sin(litBase*0.8, litBase*1.2))
    circles.push(circle)
    r = r + abs(randomGaussian(0, w/12))
  }
  circles.reverse()
}

function myDraw() {
  noStroke()
  circles.forEach(({ radius, hueBase, hue, sat, lit }) => {
    const rad = constrain(radius(now), minRadius, w)
    const h = (hueBase(now) + hue(now)) % 360
    const [r,g,b,a] = chroma.lch(lit(now), sat(now), h).alpha(0.7).rgba()
    fill(r,g,b,a*100)
    ellipse(width/2, height/2, rad, rad)
  })
}
