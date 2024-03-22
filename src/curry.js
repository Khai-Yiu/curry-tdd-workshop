function functionOfArity(func, arity) {
    if (arity === 4) {
        return (a, b, c, d) => {
            return func(a, b, c, d);
        };
    } else if (arity === 3) {
        return (a, b, c) => {
            return func(a, b, c);
        };
    } else if (arity === 2) {
        return (a, b) => {
            return func(a, b);
        };
    } else if (arity === 1) {
        return (a) => {
            return func(a);
        };
    }
}

function curry(func) {
    let providedArguments = [];
    const numOfParametersInFunc = func.length;

    function curriedFunction(...args) {
        const passedInArguments = args.filter((arg) => arg !== undefined);
        providedArguments = [...providedArguments, ...passedInArguments];

        if (providedArguments.length === numOfParametersInFunc) {
            return func(...providedArguments);
        }

        return functionOfArity(
            curriedFunction,
            numOfParametersInFunc - providedArguments.length
        );
    }

    return functionOfArity(curriedFunction, numOfParametersInFunc);
}

export default curry;
