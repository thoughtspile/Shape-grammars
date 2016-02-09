(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {};
    window.model = model;

    var paletteMgr = function(parent) {
        this.color = randClr(parent.palette[0], parent.palette[1], parent.palette[2], .2);
        this.palette = parent.palette.map(function(comp) {
            return contract(comp, model.decay);
        });
    };


    gen.init(gen.addState(function() {
        this.resize([300, 300]);
        this.palette = [[0, 255], [0, 255], [0, 255]];
    }));

    var building = gen.addState(function(parent) {
        this.shape = 'rect';
        paletteMgr.call(this, parent);
        this.mv(parent.scope.size.map(x => x / 2));
        this.rotate([2 * Math.PI * Math.random()]);
        this.resize(parent.scope.size.map(x => 10 + x * .2 * Math.random()));
    });

    gen.rule(gen.init(), rep(5000, building));
}());
