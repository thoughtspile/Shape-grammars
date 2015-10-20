function rep(n, el) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(el);
    return arr;
}

function randi(min, max) {
    return min + Math.floor((max - min) * Math.random());
}
