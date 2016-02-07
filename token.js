(function() {
    'use strict'

    function Token(parent) {
        if (parent) {
            Object.assign(this, parent);
            this.scope = {
                pos: parent.scope.pos.slice(),
                size: parent.scope.size.slice()
            }
        } else {
            this.scope = {
                pos: [0, 0],
                size: [1, 1]
            };
        }
    }

    Token.prototype.mv = function(offset) {
        var _this = this;
        offset.forEach(function(comp, i) {
            _this.scope.pos[i] += comp;
        });
        return this;
    };

    Token.prototype.resize = function(size) {
        this.scope.size = size.slice();
        return this;
    };

    function token(parent) {
        return this instanceof Token
            ? Token.call(this, parent)
            : new Token(parent);
    }

    window.token = token;
}())
