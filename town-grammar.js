(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {};
    window.model = model;

    gen.init(gen.init().resize([1000, 300]))

    // descriptions
    var shadow = gen.addState(function () {
        this.color = 'rgba(0,0,0,.4)';
    });
    var lot = gen.addState(function () {
        this.color = randClr(null, null, null, .7);
        this.resize([30, 100]);
    });

    var house = gen.addState(function () {
        this.resize([this.scope.size[0], randi(model.low, model.high) * model.floorHeight]);
        this.flHt = randi(14, 25);
    });
    var floors = gen.addState();
    var floor = gen.addState();
    var wall = gen.addState();
    var door = gen.addState(function () {
        this.color = 'rgba(20, 20, 20, .7)';
        this.resize([7, 14]);
    });
    var shopShade =  gen.addState(function () {
        this.color = randClr(null, null, null, 1);
        this.resize([30, 7]).mv([0, 13]);
    });

    var win = gen.addState();
    var winRow = gen.addState();
    var winGlass = gen.addState(function () {
        this.color = randClr([20, 80], [40, 100], [20, 50], .8);
    });
    var vertFrame = gen.addState(function () {
        this.color = 'rgba(150, 140, 60, .7)';
    }).resize([1, null]).mv([3, 0]);
    var sill = gen.addState(function () {
        this.color = 'rgba(240, 240, 240, .8)';
    }).resize([9, 1]).mv([-1, -1]);
    var horzFrame = gen.addState(function () {
        this.color = 'rgba(150, 140, 60, .7)';
    }).resize([null, 1]).mv([0, 4]);

    var roof = gen.addState().resize([30, 15]);
    var roofStruct = gen.addState().resize([30, 15]);
    var roofTileRow = gen.addState()
    var roofTile = gen.addState(function (parent) {
        var hash = parent.color.split('').reduce(function (a, c) {
            return a + c.charCodeAt(0);
        }, '')
        this.color = randClr(180 + hash % 47, [80, 180], hash % 17, 1);
    }).resize([2, 2]);

    var street = gen.addState(function () {
        this.color = 'gray';
    }).resize([null, 1]);
    var tree = gen.addState(function() {
        this.color = 'black';
        this.depth = 0;
        this.resize([treeModel.init, treeModel.initL])
    });

    // grammar
    model.low = 2;
    model.high = 10;
    model.facLow = 1;
    model.facHigh = 4
    model.floorHeight = 20;
    model.blockWidth = 30;
    gen.repeat(gen.init(), 0, model.blockWidth, lot)
        .rule(lot, [street, tree, house])
        .split(house, 1, ['1r', 30], [floors, roof])
        .repeat(floors, 1, p => p.flHt, floor)
        .split(floor, 1, ['1r', 8, '.5r'], [wall, winRow, wall])
        .split(winRow, 0, ['1r', 7, '1r', 7, '1r'], [wall, win, wall, win, wall])
        // .rule(floor, [win.mv([4, 6]), win.mv([19, 6]), wall])
        .rule(floor, [win.mv([4, 6]), door.mv([19, 0]), shopShade, wall], function (floor) {
            return floor.locator == 0;
        })
        .rule(floor, [win.mv([19, 6]), door.mv([4, 0]), wall], function (floor) {
            return floor.locator == 0;
        })
        .rule(win, [
            shadow.resize([7, 2]).mv([0, 6]),
            winGlass,
            horzFrame,
            vertFrame,
            sill])

        .rule(roof, [shadow.resize([30, 2]).mv([0, -2]), roofStruct])
        .repeat(roofStruct, 1, 2, roofTileRow.resize([32, 2]).mv([-1, 1]))
        .rule(roofStruct, rep(10, roofTileRow).map(function (row, i) {
            return row.resize([32 - 2 * i, 2]).mv([i - 1, i]);
        }))
        .rule(roofStruct, [roofTileRow.resize([34, 2]).mv([-2, 0])])
        .repeat(roofTileRow, 0, 2, roofTile);

    var treeModel = {
        decay: .6,
        decayL: 1,
        init: 3,
        initL: 8,
        depth: 8
    };
    function depthTest(parent) { return parent.depth < treeModel.depth; };
    var path = gen.addState(function(parent) {
        this.isTree = true;
        if (parent.isTree)
            this.mv([0, parent.scope.size[1]]);
        this.depth = parent.depth + 1 + Math.random();
        this.resize([parent.scope.size[0] * treeModel.decay, parent.scope.size[1] * treeModel.decayL]);
        this.rotate([.2 * this.locator * Math.PI * (Math.random() - .5)]);
    });
    var pathTerm = gen.addState();

    gen.rule(tree, [path]);
    gen.rule(path, [pathTerm, path], depthTest);
    gen.rule(path, [pathTerm, path, path, path], depthTest);
}());
