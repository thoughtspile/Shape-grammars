(function() {
    function randi(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }

    function mkTile(l, t, w, h) {
        return { l: l, t: t, w: w, h: h };
    }

    function initTiles() {
        var axis = randi(100, 200);
        var w = randi(20, 30);
        var h2 = randi(20, 30);
        var tile1 = mkTile(randi(100, 150), axis, w, randi(20, 30));
        var tile2 = mkTile(randi(100, 150), axis - h2, w, h2);
        return {
            tiles: [tile1, tile2],
            corners: []
        };
    }

    function tile(count) {
        return initTiles().tiles;
    }

    if (typeof window != 'undefined')
        window.tile = tile;
    if (typeof module != 'undefined')
        module.tile = tile;
}());
