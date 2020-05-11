let srcImg
let destImg

function preload() {
  srcImg = loadImage('images/650.jpg')
}

const chr = ([r, g, b], f) => f(chroma(r, g, b))
const poster = (val, size, roundfn=round) => size * roundfn(val / size)

function mySetup() {
  srcImg.loadPixels()

  destImg = createImage(1000, 1000)
  destImg.loadPixels()

  let srcRowLen = srcImg.width * 4
  let destRowLen = destImg.width * 4

  let underrun = destImg.width - srcImg.width

  for (let y = 0; y < srcImg.height; y++) {
    let srcRowIdx = y * srcRowLen
    const yp = y/h
    let destRowIdx = (destImg.height - 1 - y) * destRowLen
    let srcRowPx = srcImg.pixels.subarray(srcRowIdx, srcRowIdx+srcRowLen)
    let sorted = _(srcRowPx)
      .chunk(4)                                    // chunk into r,g,b,a values
      // let's process the entire row again
      .sortBy(p =>
        brightness                              // . obvious
      //   // chr(p, c => c.luminance())              // . using true luminance
      //   // red                                     // . novel
      //   // saturation                              // . less novel, but shows interest
      //   // chr(p, c => c.get('hcl.c'))             // . perceptual saturation
      //   // chr(p, c => (yp * c.get('hcl.l')) + ((1-yp) * c.get('hcl.c'))) // fade
      )
      // .reverse()                                // invert whatever is above

    sorted = sorted.take(underrun).reverse().concat(sorted.value())

    // const chunkSize = 50
    const chunkSize = 100
    // const chunkSize = constrain(randomGaussian(50, 10), 10, 100)
    sorted = sorted.chunk(chunkSize).map((chunk, i) => {
      const x = chunkSize * i
      const xp = (x+ chunkSize/2)/w
      const mir = x < underrun // mirrored

      let local = _.chain(chunk).map(([r,g,b]) => chroma(r,g,b))

      // -- first ideas: simple chunk manipulation
      local = local
        .sortBy(c =>
          c.get('hcl.h')
          // c.get(mir ? 'hcl.h' : 'hcl.l')                         // . change pattern based on mirror
          // c.get('hcl.h') + mir ? c.get('hcl.l') : c.get('hcl.c') // . or mix it up
          // (xp * c.get('hcl.h')) + ((1-xp) * (180 - c.get('hcl.h'))) // . fade between then
      )

      // second idea -- mirror the internal chunks
      // local = local.reduce((out, c, idx) => {
      //   let newIdx = idx % 2 == 0 ? floor(idx / 2) : chunkSize - ceil(idx / 2)
      //   out[newIdx] = c
      //   return out
      // }, [])

      // third idea - posterize
      // local = local.map(chr => {
      //   let [l, c, h] = chr.lch()
      //   return chroma.lch(poster(l, 5), poster(c, 10, ceil), poster(h, 30))
      // })

      // fourth idea - something something averages - cool but *slow*
      // let avgHue = local.meanBy(c => c.get('lch.h')).value()
      // let avgChr = local.meanBy(c => c.get('lch.c')).value()
      // let avgLit = local.meanBy(c => c.get('lch.l')).value()
      // local = local.map(chr => {
      //   let [l,c,h] = chr.lch()
      //   return chr
      //     .set('lch.h', avgHue)
      //     // .set('lch.h', (avgHue + h)/2)
      //     .set('lch.c', avgChr)
      //     // .set('lch.l', (l + avgLit) / 2)
      // })

      local = local.map(c => [...c.rgb(), 255])
      // local = local.reverse()
      local = mir ? local.reverse() : local
      return local.value()
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
