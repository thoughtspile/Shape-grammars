var setupCanvas = function(target) {
    var canvasHeight = parseInt(window.getComputedStyle(target).height);
    var canvasWidth = parseInt(window.getComputedStyle(target).width);
    target.setAttribute('height', canvasHeight);
    target.setAttribute('width', canvasWidth);
    return target;
};

var render = function(canvas, data) {
    var canvasHeight = canvas.height;
    var target = canvas.getContext('2d');

    drawSky(canvas, target)

    data.forEach(function(state) {
        target.fillStyle = state.color;
        var height = state.scope.size[1];//height;
        var width = state.scope.size[0];
        target.fillRect(
            state.scope.pos[0],
            canvasHeight - state.scope.pos[1] - height,
            width,
            height);
        target.fill();
    });
};

var drawSky = function(canvas, target) {
    var grd = target.createLinearGradient(0,0,0,canvas.height);
    grd.addColorStop(0,"skyblue");
    grd.addColorStop(1,"white");
    target.fillStyle = grd;
    target.fillRect(0, 0, canvas.width, canvas.height);
}
