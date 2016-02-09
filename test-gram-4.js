(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {};
    window.model = model;

    gen.init(gen.addState(function() {
        this.ratio = Math.random();
        this.resize([300, 300]);
        this.palette = [[0, 255], [0, 255], [0, 255]]
    }));

    model.decay = .4;
    model.area = 40;
    var rect = gen.addState(function(parent) {
        this.color = randClr(parent.palette[0], parent.palette[1], parent.palette[2], 1);
        this.palette = parent.palette.map(function(comp) {
            return contract(comp, model.decay);
        });
        this.ratio = Math.random();

        var ratio = parent.ratio;
        var size = parent.scope.size;
        var loc = this.locator;
        var left = (loc < 2);
        var bottom = (loc % 2 == 0);
        this.mv([
            left? 0: ratio * size[0],
            bottom? 0: ratio * size[1]
        ]);
        this.resize([
            size[0] * (left? ratio: 1 - ratio),
            size[1] * (bottom? ratio: 1 - ratio)
        ]);
    });
    var rectTerm = gen.addState();

    function isLarge(rect) { return rect.scope.size[0] * rect.scope.size[1] > model.area; };

    gen.rule(gen.init(), [rect, rect, rect, rect]);
    gen.rule(rect, [rect, rect, rect, rect], isLarge);

    // disappear
    // gen.rule(rect, [], function(rect) { return !isLarge(rect); });
    // gen.rule(rect, [rectTerm], function(rect) { return !isLarge(rect); });
}());
