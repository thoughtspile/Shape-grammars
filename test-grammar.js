(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {};
    window.model = model;

    gen.init(gen.init().resize([300, 300]));
    var rectPrev = gen.init();

    [0,1,2].forEach(function() {
        var rect = gen.addState(function(parent) {
            this.color = randClr(null, null, null, 1);
        });
        gen.rule(rectPrev, function(parent) {
            var size = parent.scope.size.slice();
            var ratio = Math.random();
            return [
                rect.resize([size[0] * ratio, size[1] * ratio]),
                rect.mv([0, ratio * size[1]])
                    .resize([size[0] * ratio, size[1] * (1 - ratio)]),
                rect.mv([ratio * size[0], 0])
                    .resize([size[0] * (1 - ratio), size[1] * ratio]),
                rect.mv([ratio * size[0], ratio * size[1]])
                    .resize([size[0] * (1 - ratio), size[1] * (1 - ratio)])
            ]
        });
        rectPrev = rect;
    });
}());
