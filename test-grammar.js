(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {};
    window.model = model;

    gen.init(gen.init().resize([300, 300]));
    var rectPrev = gen.init();

    for (var i = 0; i < 5; i++) {
        var rect = gen.addState(function(parent) {
            this.scope.size = parent.scope.size.map(x => x / 2);
            this.color = randClr(null, null, null, 1);
            this.trace = (parent.trace || []).concat([parent.id]);
        });
        gen.rule(rectPrev, function(parent) {
            console.log(parent)
            var offset = parent.scope.size.map(x => x / 2);
            return [
                rect,
                rect.mv([0, offset[1]]),
                rect.mv([offset[0], 0]),
                rect.mv(offset)
            ]
        });
        rectPrev = rect;
    }
}());
