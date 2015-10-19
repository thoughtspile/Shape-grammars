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

    function rep(n, el) {
        var arr = [];
        for (var i = 0; i < n; i++)
            arr.push(clone(el));
        return arr;
    }

    function randi(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }

    var counter = 0;
    function makeId() {
        return counter++;
    }



    var grammar = [];

    grammar.cmp = function(st1, st2) {
        return st1.id === st2.id;
    };

    grammar.register = function(obj) {
        obj = obj || {};
        obj.id = makeId();
        return obj;
    }

    grammar.addState = function(state) {
        var rule = {from: state, to: []};
        this.push(rule);
        return rule;
    };

    grammar.getRule = function(state) {
        return this.reduce(function(done, rule) {
            return done || (this.cmp(rule.from, state)? rule: done);
        }.bind(this), null)
    };

    grammar.addRule = function(from, to) {
        if (!(to instanceof Function)) {
            var toOld = to;
            to = function() { return toOld; };
        }
        (this.getRule(from) || this.addState(from)).to.push(to);
        return this;
    };

    grammar.isNonTerminal = function(token) {
        return this.getRule(token) != null;
    };

    grammar.expandState = function(token) {
        var transitions = this.getRule(token).to;
        return transitions[randi(0, transitions.length)]();
    };

    grammar.apply = function(root) {
        var state = root? root.slice(): [init];
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


    var city = grammar.register();
    var distr = grammar.register();
    var height = grammar.register();
    var lot = grammar.register();
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


    var gen = grammar.apply.bind(grammar); 
    if (typeof window != 'undefined')
        window.gen = gen;
    if (typeof module != 'undefined')
        module.exports = gen;
}());
