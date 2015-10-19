var render = function(target, data) {
    var width = 10;
    var maxHeight = 20;
    var canvasHeight = 300;
    var topOffset = 50;
    data.reduce(function(offset, state) {
        if (state == 'wall') {
            var bldHeight = Math.random() * maxHeight;
            target.fillRect(offset, canvasHeight - bldHeight, width, bldHeight);
        }
        return offset + width;
    }, 0);
    target.fillStyle = 'black';
    target.fill();
};
