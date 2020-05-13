const colors = {}

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
}

function myDraw() {
  background(colors.bg.css())

  drawSky()
  drawGround()
  drawClouds()
}

function drawSky() {
  let areaWidth = w + 100
  let areaHeight = h / 3 * 2
  let yStart = -50

  noStroke()
  fill(colors.sky.blue.css())
  rect(0, 0, areaWidth, areaHeight)

  let colCount = 26
  let rowCount = 13
  let colSize = areaWidth / colCount
  let halfCol = colSize / 2
  let rowSize = areaHeight / rowCount

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      let phaseX = col / colCount
      let phaseY = row / rowCount
      let color = colors.sky.blue
        .set('lch.l', `*${map(sin((phaseX - phaseY) * HALF_PI), -1, 1, 0.75, 1.25)}`)
        .set('lch.h', `*${map(sin((phaseY - phaseX) * PI), -1, 1, 1.2, 1)}`)
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
  let clouds = 20
  let yStart = 100
  let stepHeight = h * 0.5 / clouds
  let stepWidth = (w-100) / clouds
  for (let i = 0; i < clouds; i++) {
    let phase = i / clouds
    let lyBase = yStart + (i * stepHeight)
    let ly = map(sin(i), -1, 1, lyBase, lyBase+stepHeight)
    let sx = w - 100 - (i * stepWidth) + map(sin(phase * TAU * 3), -1, 1, stepWidth * -1, stepWidth)
    let color = colors.sky.white
      .set('lch.l', `*${map(phase * phase, 0, 1, 1, 0.8)}`)
      .alpha(map(sin(phase*8*TAU), -1, 1, 0.3, 0.7))
    fill(color.css())
    beginShape()
    curveVertex(sx, ly)
    curveVertex(sx,ly)
    let px = sx
    let py = ly
    while (px < w) {
      let phaseThere = (w - px)/w
      py = ly - map(sin(phaseThere * 1/phase * TAU * 8), -1, 1, stepHeight*0.1, stepHeight*(1-phaseThere)*3)
      curveVertex(px, py)
      px = px + map(sin((1-phaseThere) * 1/i * TAU), -1, 1, stepWidth/2, stepWidth*2)
    }
    vertex(px, py-stepHeight)
    py = ly
    vertex(px, py)
    while (px > sx+100) {
      let phaseBack = px / (w-sx)
      curveVertex(px, map(sin(phaseBack*i*TAU), -1, 1, ly, ly+stepWidth*0.33))
      px = px - map(cos(phaseBack*i), -1, 1, stepWidth, stepWidth*4)
    }
    curveVertex(sx, ly)
    curveVertex(sx,ly)
    endShape()
  }
}

function drawGround() {
  let areaWidth = w
  let xStart = 0
  let areaHeight = h / 3
  let yStart = (h / 3) * 2

  noStroke()
  fill(colors.grounds.brown.css())
  rect(xStart, yStart, areaWidth, areaHeight)

  for (let i = 0; i < 10; i++) {
    let lx = xStart + (i / 10 * areaWidth)
    let ly = map(sin(i), -1, 1, yStart, yStart + areaHeight * 0.5)
    let color = colors.grounds.brown
      .set('lch.l', `*${map(sin(i / 10 * TAU), -1, 1, 0.2, 2)}`)
      .set('lch.c', `*${map(cos(i % 3 * TAU), -1, 1, 0.2, 1.3)}`)
      .css()
    fill(color)
    rect(lx, ly, areaWidth/10, areaHeight/2)
  }

  let colCount = 36
  let colSize = areaWidth / colCount
  let rowCount = 12
  let rowSize = areaHeight / rowCount

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      let phaseX = col / colCount
      let phaseY = row / rowCount
      let cx = xStart + colSize * col + colSize / 2
      let cy = yStart + rowSize * row + rowSize / 2

      let litMod = map(
        sin(phaseY * (col % 3) * TAU) * sin(phaseX * (row % 4) * TAU),
        -1, 1, 1.5, -0.5
      )
      let chrMod = map(
        sin(phaseX * TAU * (col % 8)) + cos(phaseY * phaseY * TAU),
        -1, 1, 0.1, 2
      )
      let alpha = map(sin(phaseX * phaseY), -1, 1, 0.33, 0.8)
      let color = colors.grounds.green
        .set('lch.l', `*${litMod}`)
        .set('lch.c', `*${chrMod}`)
        .alpha(alpha)
      fill(color.css())

      let hMod = 1 // - linear
      // hMod = cos(col / colCount * TAU)  // . simple
      // . derived from x/y coordinates
      hMod = map(sin(phaseX * TAU) + cos(phaseY * TAU) + phaseY, -2, 3, 0.33, 3)

      let wMod = 1 // - linear
      // wMod = cos(row / rowCount * HALF_PI) // . simple
      // . derived from x/y
      wMod = map(sin(row + col) + cos(phaseY * TAU) + phaseX, -2, 3, 0.33, 3)

      let mode = 'rect'

      switch (mode) {
        case 'rect': {
          let lw = colSize * 0.8 * wMod
          let lh = rowSize * 0.8 * hMod
          rect(cx - lw / 2, cy - lh / 2, lw, lh)
        }
      }
    }
  }
}
