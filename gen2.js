(function() {
    var grammar = [];
    grammar.counter = 0;

    function stateFactory(blueprint, id) {
        if (!(blueprint instanceof Function))
            blueprint = objFill.bind(null, blueprint);
        var factory = function(parent) {
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
        factory.mv = function(x, y) {
            var altFactory = stateFactory(blueprint, id);
            altFactory.translation[0] = factory.translation[0] + x;
            altFactory.translation[1] = factory.translation[0] + y;
            altFactory.size[0] = factory.size[0];
            altFactory.size[1] = factory.size[1];
            return altFactory;
        };
        factory.resize = function(x, y) {
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
    grammar.rule = function(from, to, cond) {
        var transition = funcify(to);
        transition.cond = cond || function() { return true; };
        this.getRule(from).to.push(transition);
        return this;
    }

    grammar.repeat = function(from, axis, to, cond) {
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

    grammar.split = function(from , axis, to, cond) {
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
    grammar.init = function() {
        this._init = this.addState(function() { });
        return this._init;
    };


    grammar.isNonTerminal = function(token) {
        return this.getRule(token).to.length != 0;
    };

    grammar.expandState = function(token) {
        var transitions = this.getRule(token).to.filter(function(transition) {
            return transition.cond(token);
        });
        return transitions[randi(0, transitions.length)](token)
            .map(function(succ, i, a) {
                var temp = succ(token);
                temp.locator = i;
                temp.splitCount = a.length;
                return temp;
            });
    };

    grammar.apply = function(root, callback) {
        var state = root? root.slice(): [this._init()];
        if(!state.some(this.isNonTerminal.bind(this)))
            return;
        state = state.reduce(function(state, token) {
            this.isNonTerminal(token)?
                state.push.apply(state, this.expandState(token)):
                state.push(token);
            return state;
        }.bind(this), []);
        callback(state);
        console.log(9)
        setTimeout(this.apply.bind(this, state, callback), 300);
    };


    grammar.init();

    if (typeof window != 'undefined')
        window.gen = grammar;
    if (typeof module != 'undefined')
        module.exports = grammar;
}());
