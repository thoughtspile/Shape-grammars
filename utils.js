function rep(n, el) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(el);
    return arr;
}

function randi(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function randEl(arr) {
    return arr[randi(0, arr.length)];
}

function randClr(rspan, gspan, bspan, aspan) {
    var args = Array.prototype.slice.call(arguments);
    args.length = 4;
    return 'rgba(' + args.map(function(span, i) {
            return span != null? span: [0, i != 3? 256: 1];
        })
        .map(function(span, i) {
            return Array.isArray(span)? randi(span[0], span[1]): span;
        })
        .join(', ') + ')';
}

function objFill(from) {
    for (var key in from)
        if (from[key] instanceof Function)
            this[key] = from[key]();
        else
            this[key] = from[key];
    return this;
}

function funcify(cand) {
    return cand instanceof Function? cand: function() { return cand; };
}
