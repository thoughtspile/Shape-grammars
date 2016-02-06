(function () {
    var canvas = document.getElementById('canvas');
    var paramBlock = document.getElementById('param-block');
    var inputs = {};

    function fetchSettings() {
        Object.keys(model).forEach(function(key) {
            if (key == 'set')
                return;
            model.set(key, Number(inputs[key].value));
        });
        run();
    }

    Object.keys(model).forEach(function(key) {
        if (key == 'set')
            return;
        var block = document.createElement('div');
        var input = document.createElement('input');
        var label = document.createElement('label');
        label.innerHTML = key + ':';
        block.appendChild(label);
        block.appendChild(input);
        paramBlock.appendChild(block);
        input.value = model[key];
        input.type = 'number';
        input.addEventListener('change', fetchSettings);
        inputs[key] = input;
    });

    setupCanvas(canvas);
    gen.init(gen.init().resize(canvas.width, canvas.height));
    function run() {
        gen.apply(null, render.bind(null, canvas));
    };
    document.getElementById('runBtn').addEventListener('click', run);
    run();

    model.set = function(key, value) {
        model[key] = value;
    };
}());
