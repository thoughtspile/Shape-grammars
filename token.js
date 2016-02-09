(function() {
    'use strict'

    function Token(parent) {
        if (parent) {
            for (var key in parent)
                if (!(key in this))
                    this[key] = parent[key];
            this.scope = {
                pos: parent.scope.pos.slice(),
                size: parent.scope.size.slice(),
                rot: parent.scope.rot.slice()
            }
        } else {
            this.scope = {
                pos: [0, 0],
                size: [1, 1],
                rot: [0]
            };
        }
    }

    Token.prototype.mv = function(offset) {
        // for (var i = 0; i < offset.length; i++)
        var cr = Math.cos(this.scope.rot[0]);
        var sr = Math.sin(this.scope.rot[0]);
        this.scope.pos[0] += (cr * offset[0] - sr * offset[1]);
        this.scope.pos[1] += (sr * offset[0] + cr * offset[1]);
        return this;
    };

    Token.prototype.resize = function(size) {
        for (var i = 0; i < size.length; i++)
            this.scope.size[i] = size[i];
        return this;
    };

    Token.prototype.rotate = function(rot) {
        this.scope.rot[0] += rot[0];
        return this;
    }

    function token(parent) {
        return this instanceof Token
            ? Token.call(this, parent)
            : new Token(parent);
    }

    window.token = token;
}())
