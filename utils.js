function rep(n, el) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(el);
    return arr;
}

function randi(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function randClr(rspan, gspan, bspan, aspan) {
    var args = Array.prototype.slice.call(arguments);
    args.length = 3;
    return 'rgba(' + args.map(function(span, i) {
            return span || [0, i != 3? 256: 1];
        })
        .map(function(rgba, span, i) {
            return Array.isArray(span)? randi(span[0], span[1]): span;
        })
        .join(', ') + ')';
}
