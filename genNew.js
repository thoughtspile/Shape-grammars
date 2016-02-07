(function () {
    'use strict';

    function Token(parent) {
        this.scope = {
            pos: [0, 0],
            size: [1, 1]
        }
    }

    var tokenMixin = {
        mv: function(offset) {
            // console.log(this.scope.pos[0], offset[0])
            var _this = this;
            offset.forEach(function(comp, i) {
                _this.scope.pos[i] += comp;
            });
            // console.log(this.scope.pos[0])
            return this;
        },
        resize: function(size) {
            this.scope.size = size.slice();
            return this;
        }
    }


    function stateFactory(blueprint, id) {
        // console.log(facs++)
        var factory = function (parent) {
            parent = parent || { scope: { pos: [0, 0] } };
            // inherit
            var obj = Object.assign({}, parent);
            for (var method in tokenMixin)
                obj[method] = tokenMixin[method];

            obj.scope = {
                pos: factory.translation.map(function(comp, i) {
                    return comp + parent.scope.pos[i];
                }),
                size: factory.size.slice()
            };
            obj.id = id;
            blueprint.call(obj, parent);

            return obj;
        };
        factory.id = id;
        factory.blueprint = blueprint;
        factory.translation = [0, 0];
        factory.size = [1, 1];
        factory.isFactory = true;

        for (var method in stateFactory.mixin)
            factory[method] = stateFactory.mixin[method];

        return factory;
    }

    stateFactory.mixin = {
        clone: function() {
            var clone = stateFactory(this.blueprint, this.id);
            clone.translation = this.translation.slice();
            clone.size = this.size.slice();
            return clone;
        },
        mv: function (offset) {
            offset = offset.slice();
            var _this = this;
            var mvBlueprint = function(parent) {
                // console.log(this)
                _this.blueprint.call(this, parent);
                this.mv(offset);
            };
            var factory = stateFactory(mvBlueprint, this.id);
            // offset.forEach(function(comp, i) {
            //     factory.translation[i] += comp;
            // });
            return factory;
        },
        resize: function (size) {
            var factory = this.clone();
            factory.size = size.slice();
            return factory;
        }
    };



    function Grammar() {
        this.states = [];
        this.counter = 0;
        this.init(this.addState());
        return this;
    };


    // *** utility methods ***

    // wrap, push, return key
    Grammar.prototype.addState = function (blueprint) {
        blueprint = blueprint || function () {};
        var factory = blueprint.isFactory
            ? blueprint
            : stateFactory(blueprint, this.counter);
        this.counter++;
        this.states.push({
            from: factory,
            to: []
        });
        return factory;
    };

    // query, add if absent, return rule
    Grammar.prototype.getRule = function (state) {
        for (var i = 0; i < this.states.length; i++)
            if (this.states[i].from.id === state.id)
                return this.states[i].to;
        return this.getRule(this.addState(state));
    };

    // boolean
    Grammar.prototype.isTerminal = function (token) {
        return this.getRule(token).length == 0;
    };

    // apply a random rule from token "token", push to "into" array
    Grammar.prototype.expandState = function (token, into) {
        // console.log(token)
        if (this.isTerminal(token)) {
            into.push(token);
            return into;
        }
        var transitions = this.getRule(token)
            .filter(function(transition) {
                return transition.cond(token);
            });
        // console.log(transitions[0](token))
        randEl(transitions)(token)
            .forEach(function(child, i, a) {
                child.locator = i;
                child.splitCount = a.length;
                into.push(child);
            });
        return into;
    };


    // *** interface ***

    // wrap, push to rule, return self
    Grammar.prototype.rule = function (from, to, cond) {
        to = funcify(to);
        var transition = function(parent) {
            var factories = to(parent);
            return factories.map(function(factory) {
                if (factory.isFactory)
                    return factory(parent);
                else
                    return factory;
            })
        };
        transition.cond = cond || function () { return true; };
        this.getRule(from).push(transition);
        return this;
    };

    // add a basic repeat rule (along axis)
    Grammar.prototype.repeat = function (from, axis, to, cond) {
        to = funcify(to);
        this.rule(from, function(token) {
            var res = [];
            var offset = [0, 0];
            while (offset[axis] < token.scope.size[axis]) {
                to(token).forEach(function(factory) {
                    var item = factory(token).mv(offset);
                    res.push(factory.mv(offset));
                    offset[axis] += item.scope.size[axis];
                });
            }
            return res;
        }, cond);
        return this;
    };

    // add a basic split rule (along axis)
    Grammar.prototype.split = function (from , axis, to, cond) {
        this.rule(from, function(token) {
            var offset = 0;
            return to.reduce(function(stack, next) {
                var x = axis == 0? offset: 0;
                var y = axis == 1? offset: 0;
                offset += next(token).scope.size[axis];
                return stack.concat(next.mv([x, y]));
            }, []);
        }, cond);
        return this;
    };

    // initial state accessor
    Grammar.prototype.init = function (init) {
        if (init)
            this._init = this.addState(init);
        return this._init;
    };

    // run grammar
    Grammar.prototype.apply = function(callback, root) {
        var state = root || [this._init()];
        // console.log(state)
        var newState = [];
        for (var i = 0; i < state.length; i++)
            this.expandState(state[i], newState);
        console.log(newState)
        callback(newState);
        console.log(900)

        if(!state.every(this.isTerminal.bind(this)))
            setTimeout(this.apply.bind(this, callback, newState), 0);
    };


    function grammar() {
        return new Grammar();
    }

    if (typeof window != 'undefined')
        window.grammar = grammar;
    if (typeof module != 'undefined')
        module.exports = grammar;
}());
