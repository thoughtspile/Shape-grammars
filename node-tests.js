var assert = require('assert');
var gen = require(__dirname + '/gen.js');

assert(gen instanceof Function, 'Generator exported');

for (var i = 0; i < 100; i++)
    console.log(gen(['S']));
