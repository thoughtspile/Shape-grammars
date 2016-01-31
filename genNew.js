(function () {
    'use strict';

    function Grammar() {
        this.states = [];
        this.counter = 0;
        this.init();
        return this;
    };

    window.Grammar = Grammar;

    function stateFactory(blueprint, id) {
        if (!(blueprint instanceof Function)) {
            blueprint = objFill.bind(null, blueprint);
        }
        var factory = function (parent) {
            parent = parent || { scope: { pos: [0, 0] } };
            var obj = Object.assign({}, parent);
            blueprint.call(obj, parent);
            obj.id = id;
            obj.scope = {
                pos: [
                    parent.scope.pos[0] + factory.translation[0],
                    parent.scope.pos[1] + factory.translation[1]
                ],
                size: [factory.size[0], factory.size[1]]
            };
            return obj;
        };
        factory.id = id;
        factory.translation = [0, 0];
        factory.size = [1, 1];
        factory.mv = function (x, y) {
            var altFactory = stateFactory(blueprint, id);
            altFactory.translation[0] = factory.translation[0] + x;
            altFactory.translation[1] = factory.translation[0] + y;
            altFactory.size[0] = factory.size[0];
            altFactory.size[1] = factory.size[1];
            return altFactory;
        };
        factory.resize = function (x, y) {
            var altFactory = stateFactory(blueprint, id);
            altFactory.translation[0] = factory.translation[0];
            altFactory.translation[1] = factory.translation[0];
            altFactory.size[0] = x;
            altFactory.size[1] = y;
            return altFactory;
        };
        return factory;
    }

    // wrap, push, return key
    Grammar.prototype.addState = function (blueprint) {
        blueprint = blueprint || function () {};
        var factory = stateFactory(blueprint, this.counter);
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

    // wrap, push to rule, return self
    Grammar.prototype.rule = function (from, to, cond) {
        var transition = funcify(to);
        transition.cond = cond || function () { return true; };
        this.getRule(from).push(transition);
        return this;
    };

    // add a basic repeat rule (along axis)
    Grammar.prototype.repeat = function (from, axis, to, cond) {
        to = funcify(to);
        this.rule(from, function(token) {
            var res = [];
            var offset = 0;
            while (offset < token.scope.size[axis]) {
                offset += to(token).reduce(function(max, nextItem) {
                    var x = axis == 0? offset: 0;
                    var y = axis == 1? offset: 0;
                    var item = nextItem.mv(x, y)(token);
                    res.push(nextItem.mv(x, y));
                    return Math.max(max, item.scope.size[axis]);
                }, 0);
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
                return stack.concat(next.mv(x, y));
            }, []);
        }, cond);
        return this;
    };

    // set initial state
    Grammar.prototype.init = function () {
        this._init = this.addState(function() { });
        return this._init;
    };


    Grammar.prototype.isTerminal = function (token) {
        return this.getRule(token).length == 0;
    };

    Grammar.prototype.expandState = function (token, into) {
        if (this.isTerminal(token)) {
            into.push(token);
            return;
        }
        var transitions = this.getRule(token).filter(function(transition) {
            return transition.cond(token);
        });
        return randEl(transitions)(token)
            .forEach(function(succ, i, a) {
                var temp = succ(token);
                temp.locator = i;
                temp.splitCount = a.length;
                into.push(temp);
            });
    };

    Grammar.prototype.apply = function(root, callback) {
        var state = root || [this._init()];
        var newState = [];
        for (var i = 0; i < state.length; i++)
            this.expandState(state[i], newState);
        callback(newState);

        if(!state.every(this.isTerminal.bind(this)))
            setTimeout(this.apply.bind(this, newState, callback), 0);
    };


    function grammar() {
        return new Grammar();
    }

    if (typeof window != 'undefined')
        window.grammar = grammar;
    if (typeof module != 'undefined')
        module.exports = grammar;
}());
