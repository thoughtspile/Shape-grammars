(function() {
    'use strict'

    function Factory(blueprint, id) {
        this.id = id;
        this.blueprint = blueprint;
    }

    Factory.isFactory = function(obj) {
        return obj instanceof Factory;
    };


    Factory.prototype.make = function(parent, locator, splitCount) {
        parent = parent || token();

        var obj = token(parent);
        obj.id = this.id;
        obj.locator = locator;
        obj.splitCount = splitCount;
        this.blueprint.call(obj, parent);

        return obj;
    };

    Factory.prototype.mv = function (x0, x1) {
        offset = offset.slice();

        var _blueprint = this.blueprint;
        var mvBlueprint = function(parent) {
            _blueprint.call(this, parent);
            this.mv(x0, x1);
        };

        return stateFactory(mvBlueprint, this.id);
    };

    Factory.prototype.resize = function (x0, x1) {
        x0 = x0 || 0;
        x1 = x1 || 0;

        var _blueprint = this.blueprint;
        var resizeBlueprint = function(parent) {
            _blueprint.call(this, parent);
            this.resize(x0, x1);
        };

        return stateFactory(resizeBlueprint, this.id);
    };


    function factory(blueprint, id) {
        return this instanceof Factory
            ? Factory.call(this, blueprint, id)
            : new Factory(blueprint, id);
    }

    window.stateFactory = factory;
    window.StateFactory = Factory;
}())
