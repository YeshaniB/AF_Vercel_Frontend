// jest.setup.js
import 'whatwg-fetch';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
