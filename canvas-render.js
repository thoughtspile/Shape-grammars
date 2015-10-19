var render = function(target, data) {
    var canvasHeight = 300;
    data.reduce(function(offset, state) {
        var width = state.width;
        if (state.type == 'house') {
            var height = state.height;
            target.fillRect(offset, canvasHeight - height, width, height);
        } else if (state.type == 'gap') {
            target.fillRect(offset, canvasHeight - 1, width, 1);
        }
        return offset + width;
    }, 0);
    target.fillStyle = 'black';
    target.fill();
};
