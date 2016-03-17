(function () {
  'use strict';

  function factory(blueprint, id) {
    if (!(this instanceof factory)) return new factory(blueprint, id);
    this.id = id;
    this.blueprint = blueprint;
  }

  factory.isFactory = function (obj) {
    return obj instanceof factory;
  };


  factory.prototype.make = function (parent, locator, splitCount) {
    parent = parent || token();

    var obj = token(parent);
    obj.id = this.id;
    obj.locator = locator;
    obj.splitCount = splitCount;
    this.blueprint.call(obj, parent);

    return obj;
  };

  factory.prototype.mv = function (x0, x1) {
    var _blueprint = this.blueprint;
    var mvBlueprint = function (parent) {
      _blueprint.call(this, parent);
      this.mv(x0, x1);
    };

    return factory(mvBlueprint, this.id);
  };

  factory.prototype.resize = function (x0, x1) {
    var _blueprint = this.blueprint;
    var resizeBlueprint = function (parent) {
      _blueprint.call(this, parent);
      this.resize(x0, x1);
    };

    return factory(resizeBlueprint, this.id);
  };

  window.stateFactory = factory;
  window.StateFactory = factory;
}());
