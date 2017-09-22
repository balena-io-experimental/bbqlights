var ws281x = require('rpi-ws281x-native')

var ledCount = process.env.LED_COUNT || 100
var ledDMA = process.env.LED_DMA || 5
var ledFreqHz = process.env.LED_FREQ_HZ || 800000
var ledInvert = /^true/i.test( process.env.LED_INVERT )
var ledPin = process.env.LED_PIN || 18
var frameRate = process.env.LED_FRAMERATE || 30

// Brightness
var alpha = 128
var offset = 0
// Pixel buffer
var buffer = new Uint32Array( ledCount )

function color(r, g, b) {
  r = r * alpha / 255;
  g = g * alpha / 255;
  b = b * alpha / 255;
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function wheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return color(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return color(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return color(pos * 3, 255 - pos * 3, 0); }
}

function frame() {
  for (var i = 0; i < ledCount; i++) {
    buffer[i] = wheel(((i * 256 / ledCount) + offset) % 256);
  }

  offset = (offset + 1) % 256
  ws281x.render( buffer )
}

function shutdown() {
  for (var i = 0; i < ledCount; i++) {
    buffer[i] = color(0, 0, 0)
  }
  ws281x.render(buffer)
  ws281x.reset()
  process.nextTick( function() {
    process.exit(0)
  })
}

process.on( 'SIGINT', shutdown )
process.on( 'SIGTERM', shutdown )

ws281x.init( ledCount )

setInterval( frame, 1000 / 30 )
