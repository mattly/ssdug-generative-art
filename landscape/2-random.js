const colors = {}
let modulators

const inputScaler = (scale, f) =>
  input => f(input * scale)

function mySetup() {
  colors.bg = chroma.hcl(23, 3, 80)
  colors.grounds = {
    brown: chroma.hcl(40, 30, 30),
    green: chroma.hcl(150, 70, 40),
  }
  colors.sky = {
    blue: chroma.hcl(210, 30, 80),
    white: chroma.hcl(30, 5, 97)
  }

  modulators = [
    sin,
    cos,
    phase => (phase % TAU) > PI ? -1 : 1,
    phase => map(phase % TAU, 0, TAU, -1, 1),
    phase => map((phase * phase) % TAU, 0, TAU, -1, 1)
  ]
}

function myDraw() {
  background(colors.bg.css())

  drawSky()
  drawGround()
  drawClouds()
}

function drawSky() {
  let areaWidth = w + 100
  let areaHeight = h
  let yStart = -50

  noStroke()
  fill(colors.sky.blue.css())
  rect(0, 0, areaWidth, areaHeight)

  let colCount = constrain(randomGaussian(25, 5), 1, 50)
  let rowCount = constrain(randomGaussian(15, 5), 1, 50)
  let colSize = areaWidth / colCount
  let halfCol = colSize / 2
  let rowSize = areaHeight / rowCount

  let litBase = constrain(randomGaussian(80, 10), 0, 100)
  let litMod = inputScaler(randomGaussian(HALF_PI, PI), random(modulators))
  let litModScale = random(0.8)
  let chr = constrain(randomGaussian(30, 10), 0, 100)
  let hueBase = randomGaussian(210, 30) % 360
  let hueMod = inputScaler(randomGaussian(PI, TAU), random(modulators))
  let hueModScale = random(0.2)

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      let phaseX = col / colCount * TAU
      let phaseY = row / rowCount * TAU

      let color = chroma.lch(
        litBase * map(litMod(phaseX - phaseY), -1, 1, 1-litModScale, 1+litModScale),
        chr,
        hueBase * map(hueMod(phaseY - phaseX), -1, 1, 1+hueModScale, 1-hueModScale)
      )
      fill(color.css())

      let ly = rowSize * row
      let nextRow = ly + rowSize + 1
      let lx = yStart + colSize * col
      let left = lx - halfCol - 1
      let center = lx + halfCol
      let right = lx + colSize + halfCol + 1
      if ((col + row) % 2 == 0) {
        triangle(left, ly, right, ly, center, nextRow)
      } else {
        triangle(center, ly, left, nextRow, right, nextRow)
      }
    }
  }
}

function drawClouds() {
  noStroke()
  let clouds = round(constrain(randomGaussian(20, 5), 1, 1000))
  let yStart = 100
  let stepHeight = h * 0.5 / clouds
  let stepWidth = (w-100) / clouds

  let yMod = random(modulators)
  let xStartMod = inputScaler(randomGaussian(), random(modulators))

  let hue = randomGaussian(30, 30) % 360
  let chr = constrain(randomGaussian(5, 5), 0, 100)
  let litBase = constrain(randomGaussian(97, 5), 0, 100)

  let litMod = random(modulators)
  let litScale = 1 - random(0.3)
  let alphaMod = inputScaler(random(10), random(modulators))
  let alphaMin = random(0.1, 0.5)
  let alphaMax = alphaMin + random(0.5)

  let topHeightMod = inputScaler(randomGaussian(), random(modulators))
  let topStepMod = inputScaler(random(3), random(modulators))
  let botHeightMod = inputScaler(randomGaussian(), random(modulators))
  let botStepMod = inputScaler(random(5), random(modulators))

  for (let i = 0; i < clouds; i++) {
    let phase = i / clouds * TAU
    let lyBase = yStart + (i * stepHeight)
    let ly = map(yMod(i), -1, 1, lyBase, lyBase+stepHeight)
    let sx = w - 100 - (i * stepWidth) + map(xStartMod(phase), -1, 1, stepWidth * -1, stepWidth)
    let color = chroma.hcl(litBase * map(litMod(phase), -1, 1, 1, litScale), chr, hue)
      .alpha(map(alphaMod(phase), -1, 1, alphaMin, alphaMax))
    fill(color.css())
    beginShape()
    curveVertex(sx, ly)
    curveVertex(sx,ly)
    let px = sx
    let py = ly
    while (px < w) {
      let phaseThere = 1/((w - px)/w) * TAU
      py = ly - map(topHeightMod(phaseThere), -1, 1, stepHeight*0.1, stepHeight*phaseThere*0.5)
      curveVertex(px, py)
      px = px + map(topStepMod(phaseThere), -1, 1, stepWidth/2, stepWidth*2)
    }
    vertex(px, py-stepHeight)
    py = ly
    vertex(px, py)
    while (px > sx+100) {
      let phaseBack = px / (w-sx) * TAU
      curveVertex(px, map(botHeightMod(phaseBack*i), -1, 1, ly, ly+stepWidth*0.33))
      px = px - map(botStepMod(phaseBack*i), -1, 1, stepWidth, stepWidth*4)
    }
    curveVertex(sx, ly)
    curveVertex(sx,ly)
    endShape()
  }
}

function drawGround() {
  let areaWidth = w
  let xStart = 0
  let heightPct = 1/random(2,5)
  let areaHeight = h * heightPct
  let yStart = h - areaHeight

  noStroke()
  let bgHue = randomGaussian(40, 30) % 360
  let bgLitBase = constrain(randomGaussian(30, 15), 0, 100)
  let bgChrBase = constrain(randomGaussian(30, 15), 0, 100)

  fill(chroma.lch(bgHue, bgLitBase, bgChrBase).css())
  rect(xStart, yStart, areaWidth, areaHeight)

  let bgPatchCount = random(2, 20)
  let bgPatchYMod = inputScaler(randomGaussian(), random(modulators))
  let bgPatchLitMod = inputScaler(randomGaussian(), random(modulators))
  let bgPatchLitModMin = 1 - random(0.9)
  let bgPatchLitModMax = 1 + random(3)
  let bgPatchChrMod = inputScaler(random(1,2), random(modulators))
  let bgPatchChrModMin = 1 - random(0.9)
  let bgPatchChrModMax = 1 + random(2)

  for (let i = 0; i < bgPatchCount; i++) {
    let phase = i / bgPatchCount * TAU
    let patchHeight = random()
    let lx = xStart + (i / bgPatchCount * areaWidth)
    let ly = map(bgPatchYMod(i), -1, 1, yStart, yStart + areaHeight * patchHeight)
    let color = chroma.lch(
      bgLitBase * map(bgPatchChrMod(phase), -1, 1, bgPatchLitModMin, bgPatchLitModMax),
      bgChrBase * map(bgPatchChrMod(phase), -1, 1, bgPatchChrModMin, bgPatchChrModMax),
      bgHue
    )
    fill(color.css())
    rect(lx, ly, areaWidth/bgPatchCount, areaHeight*patchHeight)
  }

  let colCount = round(constrain(randomGaussian(50, 10), 0, 100))
  let colSize = areaWidth / colCount
  let rowCount = round(constrain(randomGaussian(1/heightPct * 10), 0, 100))
  let rowSize = areaHeight / rowCount

  let litBase = constrain(randomGaussian(40, 20), 0, 100)
  let litModFs = [random(modulators), random(modulators)]
  let litModVals = [random(1, 20), random(1, 20)]
  let litModScale = [random(3), -1 * random()]
  let chrBase = constrain(randomGaussian(70, 20), 0, 100)
  let chrModFs = [random(modulators), random(modulators)]
  let chrModVals = [random(1, 100)]
  let chrModScale = [random(1), random(3)]
  let hue = randomGaussian(150, 30) % 360
  let alphaModF = random(modulators)
  let alphaMin = random(0.1, 0.5)
  let alphaMax = alphaMin + random(0.5)

  let hModFs = [random(modulators), random(modulators)]
  let hModScale = [random(), random(10)]

  let wModFs = [random(modulators), random(modulators)]
  let wModScale = [random(), random(10)]

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      let phaseX = col / colCount * TAU
      let phaseY = row / rowCount * TAU
      let cx = xStart + colSize * col + colSize / 2
      let cy = yStart + rowSize * row + rowSize / 2

      let litMod = map(
        litModFs[0](phaseY * (col % litModVals[0])) * litModFs[1](phaseX * (row % litModVals[1])),
        -1, 1, litModScale[0], litModScale[1]
      )
      let chrMod = map(
        chrModFs[0](phaseX * (col % chrModVals[0])) + chrModFs[1](phaseY * phaseY),
        -1, 1, chrModScale[0], chrModScale[1]
      )
      let alpha = map(alphaModF(phaseX * phaseY), -1, 1, alphaMin, alphaMax)
      let color = chroma.lch(litBase * litMod, chrBase * chrMod, hue).alpha(alpha)
      fill(color.css())

      let lw = colSize * map(wModFs[0](row + col) + wModFs[1](phaseY) + phaseX, -2, 3, hModScale[0], hModScale[1])
      let lh = rowSize * map(hModFs[0](phaseX) + hModFs[1](phaseY) + phaseY, -2, 3, wModScale[0], wModScale[1])
      rect(cx - lw / 2, cy - lh / 2, lw, lh)
    }
  }
}
