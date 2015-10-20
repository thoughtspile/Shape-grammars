(function() {
    var grammar = [];
    grammar.counter = 0;


    // wrap, push, return key
    grammar.addState = function(blueprint) {
        var counter = grammar.counter++;
        blueprint = blueprint || function() {
            return { scope: { pos: [], size: [] } };
        };
        var factory = function() {
            var res = blueprint.call(null, arguments);
            res.id = counter;
            return res;
        };
        factory.id = counter;
        var rule = {from: factory, to: []};
        this.push(rule);
        return factory;
    };

    // query, add if absent, return rule
    grammar.getRule = function(state) {
        return this.reduce(function(done, rule) {
            return done || (rule.from.id == state.id? rule: done);
        }.bind(this), null) || this.getRule(this.addState(state));
    };

    // wrap, push to rule, return self
    grammar.addRule = function(from, toRaw) {
        var to = (toRaw instanceof Function)? toRaw: function() { return toRaw; };
        this.getRule(from).to.push(to);
        return this;
    }

    // set initial state
    grammar.init = function(state) {
        this._init = state;
    };


    grammar.isNonTerminal = function(token) {
        return this.getRule(token).to.length != 0;
    };

    grammar.expandState = function(token) {
        var transitions = this.getRule(token).to;
        return transitions[randi(0, transitions.length)](token);
    };

    grammar.apply = function(root) {
        var state = root? root.slice(): [this._init];
        while(state.some(this.isNonTerminal.bind(this))) {
            state = state.reduce(function(state, token) {
                return state.concat(this.isNonTerminal(token)?
                    this.expandState(token):
                    token
                );
            }.bind(this), []);
        }
        return state;
    };


    if (typeof window != 'undefined')
        window.gen = grammar;
    if (typeof module != 'undefined')
        module.exports = grammar;
}());
