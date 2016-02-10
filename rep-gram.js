(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {};
    window.model = model;

    gen.init(gen.addState(function() {
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
    });

    function isLarge(rect) { return rect.scope.size[0] * rect.scope.size[1] > model.area; };

    gen.rule(gen.init(), [rect]);
    gen.split(rect, 0, ['1r', '1r'], [rect, rect], isLarge);
    gen.repeat(rect, 0, 1, rect, isLarge);
}());
