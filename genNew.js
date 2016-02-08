(function () {
    'use strict';

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
        var factory = StateFactory.isFactory(blueprint)
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
    Grammar.prototype.isTerminal = function (token, parent) {
        return this.getRule(token)
            .every(function(transition) {
                return !transition.cond(token);
            });
    };

    // apply a random rule from token "token", push to "into" array
    Grammar.prototype.expandState = function (token, into) {
        var transitions = this.getRule(token)
            .filter(function(transition) {
                return transition.cond(token);
            });
        if (transitions.length == 0) {
            into.push(token);
        } else {
            into.push.apply(into, randEl(transitions)(token));
        }
        return into;
    };


    // *** interface ***

    // wrap, push to rule, return self
    Grammar.prototype.rule = function (from, to, cond) {
        to = funcify(to);
        var transition = function(parent) {
            return to(parent).map(function(factory, i, a) {
                return factory.make(parent, i, a.length);
            });
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
        if (init) this._init = this.addState(init);
        return this._init;
    };

    // run grammar
    Grammar.prototype.apply = function(callback, root) {
        if (!window.timer)
            window.timer = Date.now();
        var state = root || [this.init().make()];
        var newState = [];
        for (var i = 0; i < state.length; i++)
            this.expandState(state[i], newState);
        callback(newState);

        if(!state.every(this.isTerminal.bind(this)))
            setTimeout(this.apply.bind(this, callback, newState), 0);
        else
            console.log(Date.now() - window.timer)
    };


    function grammar() {
        return new Grammar();
    }

    if (typeof window != 'undefined')
        window.grammar = grammar;
    if (typeof module != 'undefined')
        module.exports = grammar;
}());
