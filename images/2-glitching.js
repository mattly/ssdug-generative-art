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
      // .sortBy(brightness)
      // .sortBy(red)
      // .sortBy(([r,g,b]) => chroma(r,g,b).get('hcl.l'))
      // .reverse()
      // .sortBy(saturation).reverse()
      // .sortBy(([r,g,b]) => chroma(r,g,b).get('hcl.c')).reverse()

    sorted = sorted.take(underrun).reverse().concat(sorted.value())

    const chunkSize = 50
    // const chunkSize = constrain(randomGaussian(50, 10), 10, 100)
    sorted = sorted.chunk(chunkSize).map((chunk, i) => {
      const x = chunkSize * i
      const mirrored = x < underrun
      return chunk.reverse()
      // return _.sortBy(chunk, brightness)
      // return _.sortBy(chunk, ([r, g, b]) => {
      //   return chroma(r, g, b).get(mirrored ? 'hcl.h' : 'hcl.l')
      // }).reverse()

      // let local = chunk.map(([r, g, b]) => chroma(r, g, b))
      // local = _.sortBy(local, c =>
      //   (c.get('hcl.h') * (w - x) / w) + (c.get('hcl.l') * x / w)
      // )
      // local = local.reduce((out, c, idx) => {
      //   let newIdx = idx % 2 == 0 ? floor(idx / 2) : chunkSize - ceil(idx / 2)
      //   out[newIdx] = c
      //   return out
      // }, [])
      // local = local.map(c => ([...c.rgb(), 255]))
      // return mirrored ? local.reverse() : local

      // let avgHue = _.meanBy(local, c => c.get('lch.h'))
      // return local.map(c => [...c.set('lch.h', avgHue).rgb(), 255])
      // let avgChr = _.meanBy(local, c => c.get('lch.c'))
      // let avgLit = _.meanBy(local, c => c.get('lch.l'))
      // return local.map(c => {
      //   c = c
      //     .set('lch.c', (c.get('lch.c') + avgChr) / 2)
      //     .set('lch.l', (c.get('lch.l') + avgLit) / 2)
      //   return [...c.rgb(), 255]
      // })
      // return local.map(c => [...chroma.lch(avgLit, avgChr, avgHue).rgb(), 255])
    }).flatten()

    destImg.pixels.set(sorted.flatten().value(), destRowIdx)
    if (y % 20 == 0) { console.debug('row', y) }
    // if (y > 200) { y = srcImg.height }
  }
  destImg.updatePixels()
}

function myDraw() {
  image(destImg, 0, 0)
  console.debug('done')
}
