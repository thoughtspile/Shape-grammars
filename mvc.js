(function () {
    var canvas = document.getElementById('canvas');
    setupCanvas(canvas);
    gen.rule(gen._init, [distr.resize(canvas.width, canvas.height)]);
    function run() {
        gen.apply(null, render.bind(null, canvas));
    };
    document.getElementById('runBtn').addEventListener('click', run);
    run();
}());
