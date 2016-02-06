(function () {
    'use strict';

    var gen = grammar();
    window.gen = gen;
    var model = {};
    window.model = model;

    // descriptions
    var shadow = gen.addState(function () {
        this.color = 'rgba(0,0,0,.4)';
    });
    var lot = gen.addState(function () {
        this.color = this.color || randClr(null, null, null, .7);
    }).resize(30, 100);

    var house = gen.addState(function () {
        this.color = this.color || randClr(null, null, null, .7);
    }).resize(30, 120);
    var floor = gen.addState().resize(30, 20);
    var wall = gen.addState().resize(30, 20);
    var door = gen.addState(function () {
        this.color = 'rgba(20, 20, 20, .7)';
    }).resize(7, 14);
    var shopShade =  gen.addState(function () {
        this.color = randClr(null, null, null, 1);
    }).resize(30, 7).mv(0, 13);

    var win = gen.addState().mv(0, 6).resize(7, 8);
    var winGlass = gen.addState(function () {
        this.color = randClr([20, 80], [40, 100], [20, 50], .8);
    }).resize(7, 8);
    var vertFrame = gen.addState(function () {
        this.color = 'rgba(150, 140, 60, .7)';
    }).resize(1, 8).mv(3, 0);
    var sill = gen.addState(function () {
        this.color = 'rgba(240, 240, 240, .8)';
    }).resize(9, 1).mv(-1, -1);
    var horzFrame = gen.addState(function () {
        this.color = 'rgba(150, 140, 60, .7)';
    }).resize(7, 1).mv(0, 4); // why no mv before resize

    var roof = gen.addState().resize(30, 15);
    var roofStruct = gen.addState().resize(30, 15);
    var roofTileRow = gen.addState()
    var roofTile = gen.addState(function (parent) {
        var hash = parent.color.split('').reduce(function (a, c) {
            return a + c.charCodeAt(0);
        }, '')
        this.color = randClr(180 + hash % 47, [80, 180], hash % 17, 1);
    }).resize(2, 2);

    var street = gen.addState(function () {
        this.color = 'gray';
    }).resize(30, 1);
    var park = gen.addState().resize(90, 40);
    var grass = gen.addState(function () {
        this.color = randClr(40, [100, 200], 0, .7);
    }).resize(30, 1);
    var tree = gen.addState();
    var trunk = gen.addState(function () {
        this.color = 'rgb(130, 70, 0)';
    }).mv(-2, 0).resize(4, 20);
    var crown = gen.addState().mv(0, 20);
    var leaf = gen.addState(function () {
        this.color = randClr(40, [100, 200], 0, .7);
    }).resize(3, 3);

    // grammar
    model.low = 2;
    model.high = 10;
    model.facLow = 1;
    model.facHigh = 4
    model.floorHeight = 20;
    model.blockWidth = 30;
    gen.repeat(gen.init(), 0, function () {
            return [
                lot.resize(model.blockWidth * randi(model.facLow, model.facHigh),
                model.floorHeight * randi(model.low, model.high))
            ];
        })
        .repeat(lot, 0, function (loth) {
            return [
                street,
                house.resize(model.blockWidth, loth.scope.size[1]),
                tree
            ];
        })
        .repeat(house, 1, [floor])
        .rule(floor, [wall, win.mv(4, 6), win.mv(19, 6)], function (floor) {
            return floor.locator < floor.splitCount - 1;
        })
        .rule(floor, [wall, win.mv(4, 6), door.mv(19, 0), shopShade], function (floor) {
            return floor.locator == 0;
        })
        .rule(floor, [wall, win.mv(19, 6), door.mv(4, 0), shopShade], function (floor) {
            return floor.locator == 0;
        })
        .rule(floor, [roof], function (floor) {
            return floor.locator >= floor.splitCount - 1;
        })
        .rule(win, [
            shadow.resize(7, 2).mv(0, 6),
            winGlass,
            horzFrame,
            vertFrame,
            sill])
        .rule(roof, [shadow.resize(30, 2).mv(0, -2), roofStruct])
        .repeat(roofStruct, 1, [roofTileRow.resize(32, 2).mv(-1, 1)])
        .rule(roofStruct, rep(10, roofTileRow).map(function (row, i) {
            return row.resize(32 - 2 * i, 2).mv(i - 1, i);
        }))
        .rule(roofStruct, [roofTileRow.resize(34, 2).mv(-2, 0)])
        .repeat(roofTileRow, 0, [roofTile])
        .rule(tree, [trunk, crown])
        .rule(tree, [tree.mv(randi(-10, 0), 0)])

    var crownLayers = [];
    for (var i = 0; i < 10; i++) {
        var crownLayer = gen.addState();
        gen.rule(crownLayer, rep(50, leaf).map(function (leaf) {
            return leaf.mv(randi(-12, 12), randi(-10, 15));
        }));
        crownLayers.push(crownLayer.mv(randi(-3, 3), randi(-3, 3)));
    }

    for (var i = 0; i < 100; i++) {
        gen.rule(crown, [
            crownLayers[randi(0, 10)],
            crownLayers[randi(0, 10)],
            crownLayers[randi(0, 10)]
        ]);
    }
}());
