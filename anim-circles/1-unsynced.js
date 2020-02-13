const circles = []

function mySetup() {
  loopDuration = 1000
  let r = randomGaussian(w / 15)
  while (r < w * 0.9) {
    let pct = r/w
    let circle = {i: circles.length, r}
    let rv = constrain(abs(randomGaussian(0,0.25)),0,1)
    circle.radius = osc(1, 1)(Sin(1-rv,1+rv), Times(circle.r))
    circle.offset = {
      radius: osc(1, pct)(Sin(-1 * circle.r/circle.i, circle.r/circle.i)),
      angle: osc(1/(circle.i+1), 1/pct)()
    }
    circle.lit = map(random(),0,1,50*(1-pct),100*(1-pct))
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
    const [r,g,b,a] = chroma.lab(lit, cx*abScale, cy*abScale).alpha(0.5).rgba()
    fill(r,g,b,a*100)
    ellipse(width/2 + cx, height/2 + cy, rad, rad)
  })
}
