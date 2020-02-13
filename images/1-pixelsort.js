let img

function preload() {
  img = loadImage('images/650.jpg')
}

function mySetup() {
  let rowLen = img.width * 4
  console.log(img)
  img.loadPixels()
  for (let y = 0; y < img.height; y++) {
    let startIdx = y * rowLen
    let rowPx = img.pixels.subarray(startIdx, startIdx+rowLen)
    let sorted = _(rowPx)
      .chunk(4)
      .sortBy(brightness)
      // .sortBy(saturation)
      .flatten()
      .value()
    rowPx.set(sorted)
  }
  img.updatePixels()
}

function myDraw() {
  image(img, 0, 0)
}
