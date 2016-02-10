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
    Grammar.prototype.repeat = function (from, axis, size, to, cond) {
        to = funcify(to);
        var transition = function(parent) {
            var offset = [0, 0];
            var res = [];
            var count = Math.round(parent.scope.size[axis] / size) || 1;
            var adjustedSize = parent.scope.size[axis] / count;
            console.log(count)
            var factory = to(parent);
            for (var i = 0; i < count; i++) {
                var temp = factory.make(parent, i, count);
                temp.scope.size[axis] = adjustedSize;
                temp.mv(offset);
                offset[axis] += adjustedSize;
                res.push(temp);
            };
            return res;
        };
        transition.cond = cond || function () { return true; };
        this.getRule(from).push(transition);
        return this;
    };

    // add a basic split rule (along axis)
    Grammar.prototype.split = function (from, axis, sizes, to, cond) {
        to = funcify(to);
        var transition = function(parent) {
            var offset = [0, 0];
            var sumAbs = 0;
            var sumRel = 0;
            sizes.forEach(function(size) {
                if (/r$/.test(size))
                    sumRel += parseFloat(size, 10);
                else
                    sumAbs += size;
            }, 0);
            var contextSizes = sizes.map(function(size) {
                return /r$/.test(size)
                    ? parseFloat(size, 10) * (parent.scope.size[axis] - sumAbs) / sumRel
                    : size;
            });
            return to(parent).map(function(factory, i, a) {
                var temp = factory.make(parent, i, a.length);
                temp.scope.size[axis] = contextSizes[i];
                temp.mv(offset);
                offset[axis] += contextSizes[i];
                return temp;
            });
        };
        transition.cond = cond || function () { return true; };
        this.getRule(from).push(transition);
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
        while (state.length > 0)
            this.expandState(state.pop(), newState);
        newState.push.apply(newState, state);
        callback(newState);

        if(!newState.every(this.isTerminal.bind(this))) {
            setTimeout(this.apply.bind(this, callback, newState), 0);
        } else {
            console.log(Date.now() - window.timer)
        }
    };


    function grammar() {
        return new Grammar();
    }

    if (typeof window != 'undefined')
        window.grammar = grammar;
    if (typeof module != 'undefined')
        module.exports = grammar;
}());
