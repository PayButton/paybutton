const { Blob } = require('buffer');
global.React = require('react');
globalThis.Blob = Blob;

// jest.setup.js
// Polyfill TextEncoder/TextDecoder for Node <18 in jsdom tests
const { TextEncoder, TextDecoder } = require('util');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // some libs expect TextDecoder to accept an encoding argument
  global.TextDecoder = TextDecoder;
}

