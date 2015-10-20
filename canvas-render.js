var setupCanvas = function(target) {
    var canvasHeight = parseInt(window.getComputedStyle(target).height);
    var canvasWidth = parseInt(window.getComputedStyle(target).width);
    target.setAttribute('height', canvasHeight);
    target.setAttribute('width', canvasWidth);
    return target;
};

var render = function(canvas, data) {
    setupCanvas(canvas);
    var canvasHeight = canvas.height;
    var target = canvas.getContext('2d');

    data.forEach(function(state) {
        var width = state.width;
        target.fillStyle = state.color;
        var height = state.height;
        var width = state.width;
        target.fillRect(
            state.scope.pos[0], canvasHeight - state.scope.pos[1] - height,
            width, height);
        target.fill();
    });
};

var renderBlocks = function(canvas, data) {
    setupCanvas(canvas);
    var target = canvas.getContext('2d');
    data.forEach(function(tile) {
        target.fillRect(tile.l, tile.t, tile.w, tile.h);
        target.fillStyle = '#' + Math.floor(16777216 * Math.random()).toString(16);
        target.fill();
    })
}
