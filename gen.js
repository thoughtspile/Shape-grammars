(function() {
    var grammar = [];
    grammar.counter = 0;

    function stateFactory(blueprint, id) {
        var factory = function(parent) {
            parent = parent || { scope: { pos: [0, 0] } };
            var obj = new blueprint(parent);
            obj.id = id;
            obj.scope = {
                pos: [
                    parent.scope.pos[0] + factory.translation[0],
                    parent.scope.pos[1] + factory.translation[1]
                ]
            };
            return obj;
        };
        factory.id = id;
        factory.translation = [0, 0];
        factory.mv = function(x, y) {
            var altFactory = stateFactory(blueprint, id);
            altFactory.translation[0] = x;
            altFactory.translation[1] = y;
            return altFactory;
        };
        return factory;
    }

    // wrap, push, return key
    grammar.addState = function(blueprint) {
        blueprint = blueprint || function() {};
        var factory = stateFactory(blueprint, grammar.counter++);
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
    grammar.addRule = function(from, to) {
        this.getRule(from).to.push(to);
        return this;
    }

    // set initial state
    grammar.init = function(state) {
        this._init = this.addState(state || function() {
            this.scope = { pos: [0, 0] };
        });
        return this._init;
    };


    grammar.isNonTerminal = function(token) {
        return this.getRule(token).to.length != 0;
    };

    grammar.expandState = function(token) {
        var transitions = this.getRule(token).to;
        return transitions[randi(0, transitions.length)].map(function(succ) {
            return succ(token);
        });
    };

    grammar.apply = function(root) {
        var state = root? root.slice(): [this._init()];
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
