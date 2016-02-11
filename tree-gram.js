(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {
        decay: .8,
        decayL: .98,
        branchDecay: .8,
        init: 20,
        depth: 20,
        spread: .05,
        leafSpread: 12
    };
    window.model = model;

    function depthTest(parent) { return parent.depth < model.depth; };

    gen.init(gen.addState(function() {
        this.resize(model.init, 15);
        this.color = 'rgba(0,0,0,1)';
        this.mv(150, 0);
        this.depth = 0;
        this.centrality = model.depth;
    }));

    var path = gen.addState(function(parent) {
        this.depth = parent.depth + 3 * Math.random();
        this.resize(parent.scope.size[0] * model.decay, parent.scope.size[1] * model.decayL);
        this.mv(
            (parent.scope.size[0] - this.scope.size[0]) / 2,
            parent.scope.size[1] - this.scope.size[0] / 5);
        if (this.locator > 1) {
            this.resize(model.branchDecay * this.scope.size[0], null);
            this.centrality--;
            var dir = randEl([-1, 1]);
            var spread = model.spread;
            var staightness = 1 + .5 * (1 - this.centrality / model.depth);
            var rand = 1 + Math.random();
            this.rotate([dir * Math.PI * spread * staightness * rand]);
        }
    });
    var pathTerm = gen.addState();
    var leaves = gen.addState(function(parent) {
        this.color = randClr([100, 160], 50, [30, 80], .4);
        this.resize(model.leafSpread, parent.scope.size[1] + 20);
        this.mv(null, -10)
    });
    var leaf = gen.addState(function(parent) {
        // shadow leaves
        if (randi(0, 1)) this.color = randClr([20, 40], [40, 80], 0, .4);
        this.mv.apply(this, parent.scope.size.map(x => Math.random() * x));
        this.resize(3, 3);
        this.rotate([2 * Math.PI * Math.random()]);
    });

    gen.rule(gen.init(), [path]); // init
    gen.rule(path, [pathTerm, path], depthTest); // extend
    gen.rule(path, [pathTerm, path, path], function(seg) {
        return depthTest(seg) && seg.scope.pos[1] > 20;
    }); // split
    gen.rule(path, [pathTerm, leaves], p => !depthTest(p)); // end
    gen.rule(leaves, rep(20, leaf)); // leafiness
}());
