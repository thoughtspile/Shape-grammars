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
        var pos = state.scope.pos;
        var size = state.scope.size;
        var rot = state.scope.rot[0];
        target.fillStyle = state.color;
        target.save();
        target.translate(pos[0], canvasHeight - pos[1]);
        target.rotate(rot);
        if (state.shape == 'triangle') {
        // if (false) {
            target.beginPath();
            target.moveTo(0, -size[1]);
            target.lineTo(size[0], 0);
            target.lineTo(0, 0);
        } else {
            target.fillRect(0, -size[1], size[0], size[1]);
        }
        target.fill();
        target.restore();
    });
};

var drawSky = function(canvas, target) {
    var grd = target.createLinearGradient(0,0,0,canvas.height);
    grd.addColorStop(0,"skyblue");
    grd.addColorStop(1,"white");
    target.fillStyle = grd;
    target.fillRect(0, 0, canvas.width, canvas.height);
}
