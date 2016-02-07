(function() {
    'use strict'

    function Factory(blueprint, id) {
        this.id = id;
        this.blueprint = blueprint;
    }

    Factory.isFactory = function(obj) {
        return obj instanceof Factory;
    };


    Factory.prototype.make = function(parent) {
        parent = parent || token();

        var obj = token(parent);
        obj.id = this.id;
        this.blueprint.call(obj, parent);

        return obj;
    };

    Factory.prototype.mv = function (offset) {
        offset = offset.slice();

        var _blueprint = this.blueprint;
        var mvBlueprint = function(parent) {
            _blueprint.call(this, parent);
            this.mv(offset);
        };

        return stateFactory(mvBlueprint, this.id);
    };

    Factory.prototype.resize = function (size) {
        size = size.slice();

        var _blueprint = this.blueprint;
        var resizeBlueprint = function(parent) {
            _blueprint.call(this, parent);
            this.resize(size);
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
