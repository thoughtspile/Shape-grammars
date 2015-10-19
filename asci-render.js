module.exports = function(state) {
    console.log(state.reduce(function(partial, state) {
        if (state == 'wall')
            return partial + '▓';
        else if (state == 'gap')
            return partial + '_';
    }, ''));
};
