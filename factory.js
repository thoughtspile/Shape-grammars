(function() {

    function Factory(blueprint, id) {
        token.call(this);

        this.id = id;
        this.blueprint = blueprint;
    }

    Factory.prototype = token();


    Factory.isFactory = function(obj) {
        return obj instanceof Factory;
    };


    Factory.prototype.make = function(parent) {
        parent = parent || token();
        // inherit
        var obj = Object.assign(token(), parent);

        obj.scope.pos = this.translation.map(function(comp, i) {
            return comp + parent.scope.pos[i];
        });
        obj.scope.size = this.size.slice();
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
        var factory = stateFactory(mvBlueprint, this.id);
        return factory;
    };

    Factory.prototype.resize = function (size) {
        size = size.slice();
        var _blueprint = this.blueprint;
        var resizeBlueprint = function(parent) {
            _blueprint.call(this, parent);
            this.resize(offset);
        };
        var factory = stateFactory(resizeBlueprint, this.id);
        return factory;
    };


    function factory(blueprint, id) {
        return this !== window
            ? Factory.call(this, blueprint, id)
            : new Factory(blueprint, id);
    }

    window.stateFactory = factory;
    window.StateFactory = Factory;
}())
