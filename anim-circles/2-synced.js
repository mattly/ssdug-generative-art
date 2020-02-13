const circles = []

function mySetup() {
  loopDuration = 12
  let r = randomGaussian(w / 15)
  while (r < w * 0.9) {
    let circle = {i: circles.length, r}
    let rv = constrain(abs(randomGaussian(0,0.25)),0,1)
    circle.radius = thetaOsc(10)(Sin(1-rv,1+rv), Times(circle.r))
    circle.offset = {
      radius: thetaOsc(4)(Sin(-1 * circle.r/circle.i, circle.r/circle.i)),
      angle: thetaOsc(circle.i)()
    }
    circle.lit = pow(1 / circle.i, 0.5) * 100
    circles.push(circle)
    r = r + abs(randomGaussian(0, w/10))
  }
  circles.reverse()
}

function myDraw() {
  noStroke()
  circles.forEach(({ offset, radius, lit }) => {
    const [cx,cy] = car2pol(offset.radius(now), offset.angle(now))
    const rad = radius(now)
    const abScale = 1/(width/10) * 42
    const [r,g,b,a] = chroma.lab(lit, cx*abScale, cy*abScale).alpha(0.7).rgba()
    fill(r,g,b,a*100)
    ellipse(width/2 + cx, height/2 + cy, rad, rad)
  })
}
