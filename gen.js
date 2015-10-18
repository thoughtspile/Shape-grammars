(function() {
    var grammar  = [
        {from: 'S', to: ['a', 'b', ['S', 'S']]}
    ];

    function randi(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }

    function isNonTerminal(token) {
        return /^[A-Z]+$/.test(token);
    }

    function randExpand(token) {
        var rule = grammar.filter(function(rule) {
            return rule.from == token;
        })[0];
        var transition = rule.to[randi(0, rule.to.length)];
        return transition;
    }


    function gen(root) {
        var state = root.slice();
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


    if (typeof module !== 'undefined')
        module.exports = gen;
}());
