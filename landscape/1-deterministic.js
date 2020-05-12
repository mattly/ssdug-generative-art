const colors = {}

function mySetup() {
  colors.bg = chroma.hcl(23, 3, 80)
  colors.grounds = {
    brown: chroma.hcl(40, 30, 30),
    green: chroma.hcl(150, 70, 40),
  }
}

function myDraw() {
  background(colors.bg.css())

  drawGround()
  console.log('done')
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
      .set('lch.c', `*${map(cos(i % 3 * TAU), -1, 1, 0.2, 2)}`)
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
