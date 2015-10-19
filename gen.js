(function() {
    function makeState(id) {
        return id;
    }

    var grammar = [];

    grammar.addState = function(state) {
        var rule = {from: state, to: []};
        this.push(rule);
        return rule;
    };

    grammar.getRule = function(state) {
        return this.reduce(function(done, rule) {
            return done || (rule.from == state? rule: done);
        }, null)
    };

    grammar.addRule = function(from, to) {
        (this.getRule(from) || this.addState(from)).to.push(to);
        return this;
    };


    var city = makeState('city');
    var distr = makeState('district');
    var house = makeState('wall');
    var gap = makeState('gap');
    var cell = makeState('cell');
    var init = city;
    grammar
        .addRule(city, rep(5, distr))
        .addRule(distr, rep(10, cell))
        .addRule(cell, gap)
        .addRule(cell, house);

    function rep(n, el) {
        var arr = [];
        for (var i = 0; i < n; i++)
            arr.push(el);
        return arr;
    }

    function randi(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }

    function isNonTerminal(token) {
        return grammar.getRule(token) != null;
    }

    function randExpand(token) {
        var transitions = grammar.getRule(token).to;
        return transitions[randi(0, transitions.length)];
    }


    function gen(root) {
        var state = root? root.slice(): [init];
        while(state.some(isNonTerminal)) {
            state = state.reduce(function(state, token) {
                return state.concat(isNonTerminal(token)?
                    randExpand(token):
                    token
                );
            }, []);
        }
        return state;
    }

    gen.grammar = grammar;

    if (typeof window != 'undefined')
        window.gen = gen;
    if (typeof module != 'undefined')
        module.exports = gen;
}());
