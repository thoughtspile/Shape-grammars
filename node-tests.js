var assert = require('assert');
var gen = require(__dirname + '/gen.js');
var render = require(__dirname + '/asci-render.js');

assert(gen instanceof Function, 'Generator exported');

for (var i = 0; i < 100; i++) {
    render(gen()), console.log('\n');
}
