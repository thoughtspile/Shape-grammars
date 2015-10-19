(function() {
    function clone(obj) {
        if (!(obj instanceof Object))
            return obj;
        var cloneObj = {};
        for (var key in obj) {
            cloneObj[key] = clone(obj[key]);
        }
        return cloneObj;
    }

    var counter = 0;
    function makeId() { return counter++; }


    function makeState(obj) {
        obj = obj || {};
        obj.id = makeId();
        return obj;
    }

    function cmpState(st1, st2) {
        return st1.id === st2.id;
    }

    var grammar = [];

    grammar.addState = function(state) {
        var rule = {from: state, to: []};
        this.push(rule);
        return rule;
    };

    grammar.getRule = function(state) {
        return this.reduce(function(done, rule) {
            return done || (cmpState(rule.from, state)? rule: done);
        }, null)
    };

    grammar.addRule = function(from, to) {
        if (!(to instanceof Function)) {
            var toOld = to;
            to = function() { return toOld; };
        }
        (this.getRule(from) || this.addState(from)).to.push(to);
        return this;
    };


    var city = makeState();
    var distr = makeState();
    var height = makeState();
    var lot = makeState();
    var init = city;
    grammar
        .addRule(city, rep(5, distr))
        .addRule(distr, function() {
            return rep(randi(2, 10), lot);
        })
        .addRule(lot, function() {
            return {
                type: 'house',
                height: randi(10, 100),
                width: 10
            }
        })
        .addRule(lot, {type: 'gap', width: 10})

    function rep(n, el) {
        var arr = [];
        for (var i = 0; i < n; i++)
            arr.push(clone(el));
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
        return transitions[randi(0, transitions.length)]();
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
    gen.clone = clone;

    if (typeof window != 'undefined')
        window.gen = gen;
    if (typeof module != 'undefined')
        module.exports = gen;
}());
