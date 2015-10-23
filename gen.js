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
    grammar.addRule = function(from, to, cond) {
        var transition = to instanceof Function? to: function() { return to; };
        transition.cond = cond || function() { return true; };
        this.getRule(from).to.push(transition);
        return this;
    }

    // tiling rule; to is a state
    grammar.repeat = function(from, axis, to, cond) {
        this.addRule(from, function(token) {
            var toSize = to.reduce(function(blockSize, child) {
                return blockSize + child(token).scope.size[axis];
            }, 0);
            var repCount = Math.ceil(token.scope.size[axis] / toSize);
            return rep(repCount, to).reduce(function(buff, succ, i) {
                var x = axis == 0? toSize * i: 0;
                var y = axis == 1? toSize * i: 0;
                return buff.concat(succ.map(function(item) {
                    return item.mv(x, y);
                }));
            }, []);
        }, cond);
        return this;
    };

    grammar.split = function(from , axis, to, cond) {
        this.addRule(from, function(token) {
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
            .map(function(succ, i) {
                var temp = succ(token);
                temp.locator = i;
                return temp;
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


    grammar.init();

    if (typeof window != 'undefined')
        window.gen = grammar;
    if (typeof module != 'undefined')
        module.exports = grammar;
}());
