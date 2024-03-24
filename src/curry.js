function functionOfArity(func, arity, storedProvidedArguments) {
    if (arity === 4) {
        return (a, b, c, d) => {
            return func(storedProvidedArguments, a, b, c, d);
        };
    } else if (arity === 3) {
        return (a, b, c) => {
            return func(storedProvidedArguments, a, b, c);
        };
    } else if (arity === 2) {
        return (a, b) => {
            return func(storedProvidedArguments, a, b);
        };
    } else if (arity === 1) {
        return (a) => {
            return func(storedProvidedArguments, a);
        };
    }
}

function curry(func) {
    const numOfParametersInFunc = func.length;

    function curriedFunction(providedArguments = [], ...args) {
        const passedInArguments = args.filter((arg) => arg !== undefined);
        providedArguments = [...providedArguments, ...passedInArguments];

        if (providedArguments.length === numOfParametersInFunc) {
            return func(...providedArguments);
        }

        return functionOfArity(
            curriedFunction,
            numOfParametersInFunc - providedArguments.length,
            providedArguments
        );
    }

    return functionOfArity(curriedFunction, numOfParametersInFunc, []);
}

export default curry;
