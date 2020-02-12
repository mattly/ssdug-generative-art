const circles = []

function mySetup() {
  // saveGif=true
  let r = randomGaussian(w / 15)
  const hueBase = random(360)
  while (r < w * 0.9) {
    let circle = { i: circles.length, r }
    let rv = constrain(abs(randomGaussian(0, circle.i/10)), 0, 1)
    circle.radius = thetaOsc(5,0.2)(Sin(1 - rv, 1), Times(circle.r))
    const hueSpread = constrain(randomGaussian(0, 15), 360, 360)
    circle.hue = thetaOsc(3)(Sin(hueBase - hueSpread, hueBase + hueSpread), Mod(360))
    circle.sat = thetaOsc(7,0.33)(Sin(circle.r / w * 30, circle.r / w * 70))
    const litBase = pow(1/circle.i, 0.25) * 90
    circle.lit = thetaOsc(4)(Sin(litBase*0.8, litBase*1.2))
    circles.push(circle)
    r = r + abs(randomGaussian(0, w/10))
  }
  circles.reverse()
}

function myDraw() {
  noStroke()
  circles.forEach(({ radius, hue, sat, lit }) => {
    const rad = radius(now)
    const [r,g,b,a] = chroma.lch(lit(now), sat(now), hue(now)).alpha(0.7).rgba()
    fill(r,g,b,a*100)
    ellipse(width/2, height/2, rad, rad)
  })
}
