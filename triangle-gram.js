(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {};
    window.model = model;

    gen.init(gen.addState(function() {
        this.shape = 'rect';
        this.resize([300, 300]);
        this.palette = [[0, 255], [0, 255], [0, 255]]
    }));

    model.decay = .2;
    model.area = 90;

    var paletteMgr = function(parent) {
        this.color = randClr(parent.palette[0], parent.palette[1], parent.palette[2], 1);
        this.palette = parent.palette.map(function(comp) {
            return contract(comp, model.decay);
        });
    };

    var rect = gen.addState(function(parent) {
        this.shape = 'rect';
        paletteMgr.call(this, parent);
        this.resize(parent.scope.size.map(x => x / 2))
    });
    var tri = gen.addState(function(parent) {
        this.shape = 'triangle';
        paletteMgr.call(this, parent);
        if (parent.shape == 'rect') {
            if (this.locator == 1)
                this.mv(this.scope.size).rotate([Math.PI]);
        } else if (parent.shape == 'triangle') {
            this.resize(parent.scope.size.map(x => x / 2));
            if (this.locator == 0)
                this.mv([0, parent.scope.size[1] / 2]);
            else if (this.locator == 1)
                this.mv([parent.scope.size[0] / 2, 0]);
        }
    });

    function isLarge(shape) {
        return shape.scope.size[0] * shape.scope.size[1] > model.area;
    };

    gen.rule(gen.init(), [tri, tri]);
    gen.rule(rect, [tri, tri], isLarge);
    gen.rule(tri, [tri, tri, rect], isLarge);
}());
