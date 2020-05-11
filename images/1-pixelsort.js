let srcImg
let destImg

function preload() {
  srcImg = loadImage('images/650.jpg')
}

function mySetup() {
  srcImg.loadPixels()

  destImg = createImage(1000, 1000)
  destImg.loadPixels()

  let srcRowLen = srcImg.width * 4
  let destRowLen = destImg.width * 4

  let underrun = destImg.width - srcImg.width

  for (let y = 0; y < srcImg.height; y++) {
    let srcRowIdx = y * srcRowLen
    let destRowIdx = (destImg.height - 1 - y) * destRowLen
    let srcRowPx = srcImg.pixels.subarray(srcRowIdx, srcRowIdx+srcRowLen)
    let sorted = _(srcRowPx)
      .chunk(4)                // chunk into r,g,b,a values
      .sortBy(brightness)
      // .sortBy(saturation)
      // .sortBy(red)
      // .sortBy(p => red(p) + brightness(p))

    sorted = sorted.take(underrun).reverse().concat(sorted.value())

    destImg.pixels.set(sorted.flatten().value(), destRowIdx)
  }
  destImg.updatePixels()
}

function myDraw() {
  image(destImg, 0, 0)
}
