(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {};
    window.model = model;


    var rectPrev = null;
    [0,1,2,3].forEach(function(i) {
        var rect = gen.addState(function(parent) {
            this.color = randClr(null, null, null, 1);
            this.ratio = Math.random();

            var ratio = parent.ratio || 0;
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

        if (i == 0)
            gen.init(rect.resize([300, 300]))
        else
            gen.rule(rectPrev, [rect, rect, rect, rect]);
        rectPrev = rect;
    });
}());
