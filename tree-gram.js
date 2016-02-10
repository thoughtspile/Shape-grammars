(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {
        decay: .8,
        init: 8,
        depth: 30
    };
    window.model = model;

    function depthTest(parent) { return parent.depth < model.depth; };

    gen.init(gen.addState(function() {
        this.resize([model.init, 10]);
        this.color = 'rgba(0,0,0,1)';
        this.mv([150,0]);
        this.depth = 0;
    }));

    var path = gen.addState(function(parent) {
        this.mv([0, 10]);
        this.depth = parent.depth + 3 * Math.random();
        this.resize([parent.scope.size[0] * model.decay, 10]);
        this.rotate([.2 * this.locator * Math.PI * (Math.random() - .5)]);
    });
    var pathTerm = gen.addState();

    gen.rule(gen.init(), [path]);
    var count = 0;
    gen.rule(path, [pathTerm, path], depthTest);
    gen.rule(path, [pathTerm, path, path], depthTest);
}());
