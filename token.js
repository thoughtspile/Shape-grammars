(function () {
  'use strict';

  function Token(parent) {
    this.scope = {
      pos: new Float32Array(2),
      size: new Float32Array(2),
      rot: new Float32Array(2),
    };

    if (parent) {
      var key = null;
      for (key in parent) {
        if (parent.hasOwnProperty(key) && key !== 'scope') {
          this[key] = this[key] || parent[key];
        }
      }
      for (key in parent.scope) {
        this.scope[key].set(parent.scope[key]);
      }
    }
  }

  Token.prototype.mv = function (x0, x1) {
    var cr = Math.cos(this.scope.rot[0]);
    var sr = Math.sin(this.scope.rot[0]);
    this.scope.pos[0] += (cr * x0 - sr * x1);
    this.scope.pos[1] += (sr * x0 + cr * x1);
    return this;
  };

  Token.prototype.resize = function (x0, x1) {
    if (x0) this.scope.size[0] = x0;
    if (x1) this.scope.size[1] = x1;
    return this;
  };

  Token.prototype.rotate = function (rot) {
    this.scope.rot[0] -= rot[0];
    return this;
  };

  function token(parent) {
    return this instanceof Token
      ? Token.call(this, parent)
      : new Token(parent);
  }

  window.token = token;
}());
