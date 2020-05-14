function mySetup() {
  threeD = true
}

const lch = (lit, chr, hue) => color(...chroma.lch(lit, chr, hue).rgb())

function myDraw() {
  cam = createCamera()

  let camAngle = 0
  // camAngle = random(500)
  if (camAngle > 0) {
    cam.move(0, -camAngle, -100)
    cam.lookAt(0, -1000 + camAngle, 0)
  }
  let fov = PI / 3
  // fov = PI*0.9
  // fov = constrain(randomGaussian(PI/3, PI/3), PI*0.1, PI*0.9)
  cam.perspective(fov)
  cam.move(0, 0, (fov - (PI/3)) * 200)

  // cam.ortho()

  noStroke()

  background(20)

  ambientLight(100)

  let hueBase = random(360)
  let hueVary = random(90)
  console.log(hueBase, hueVary)

  // can't have more than five pointlights
  let lightBase = 0
  let lightCount = 5
  for (i = 0; i < lightCount; i++){
    lightBase = lightBase + randomGaussian()
    let z = i * 200
    let x = random(-0.5* z, 0.5*z)
    let y = random(-0.5*z, 0.5*z)
    let hue = (map(noise(x), 0, 1, -hueVary, hueVary) + hueBase) % 360
    let chr = noise(lightBase, y) * 30
    let lit = map(noise(lightBase, y, z), 0, 1, 10, 80)
    console.log('pointlight', [lit, chr, hue], [x,y,z])
    pointLight(lch(lit, chr, hue), x, y, z)
  }


  push()
  rotateX(HALF_PI)
  for (i = 1; i < 7; i++) {
    shininess(i * 10)
    fill(lch(50 - (i * 5), 50 - (i * 9), hueBase))
    translate(0, -10*i, 0)
    cylinder(i*120, 1)
  }
  pop()

  let monolithCount = 30
  monolithCount = floor(constrain(randomGaussian(100, 10), 30, 200))
  console.log(monolithCount, monolithCount * monolithCount)

  for (let i = 0; i < monolithCount; i++) {
    if (i%20 == 0) { console.log(i/monolithCount)}
    let iPct = i / monolithCount
    for (let j = 0; j < monolithCount; j++) {
      let jPct = j / monolithCount
      let a = (iPct + noise(j))/2
      let angle = a * TAU
      let distBase = noise(sin(angle * iPct), jPct)
      let dist = map(distBase, 0, 1, -2000, 2000)
      let [x, y] = car2pol(dist, angle)

      let z = noise(x/w, y/h)
      let depth = noise(x/w, y/h, z) * dist

      push()
      translate(x, y, z * distBase * 100)
      shininess(noise(sin(angle)) * 50)

      let lit = map(noise(dist, a, z), 0, 1, 5, 98)
      let chr = map(noise(a, z, distBase), 0, 1, 5, 98)
      let hue = (map(noise(x, y, z), 0, 1, -hueVary, hueVary) + hueBase) % 360

      let thisColor = lch(lit, chr, hue)
      fill(thisColor)
      specularColor(thisColor)
      if (noise(a, distBase) > 0.5) {
        specularMaterial(thisColor)
      } else {
        emissiveMaterial(thisColor)
      }

      rotateZ(noise(iPct, jPct) * TAU)

      // stroke(thisColor)

      box(10, 10, depth)
      pop()
    }
  }

  console.log('done')
}
