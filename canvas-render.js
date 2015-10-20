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

    data.reduce(function(offset, state) {
        var width = state.width;
        if (state.type == 'house') {
            var height = state.height;
            target.fillRect(offset, canvasHeight - height, width, height);
            target.fillStyle = state.color;
            target.fill();
        } else if (state.type == 'gap') {
            target.fillRect(offset, canvasHeight - 1, width, 1);
        }
        return offset + width;
    }, 0);
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
