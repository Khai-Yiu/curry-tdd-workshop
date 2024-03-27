function functionOfArity(func, arity) {
    switch (arity) {
        case 4:
            return function (a, b, c, d) {
                // Only apply func with the supplied arguments
                // How do I access supplied arguments to a function
                return func.apply(this, arguments);
            };
        case 3:
            return function (a, b, c) {
                return func.apply(this, arguments);
            };
        case 2:
            return function (a, b) {
                return func.apply(this, arguments);
            };
        case 1:
            return function (a) {
                return func.apply(this, arguments);
            };
        default:
            break;
    }
}

function curry(func) {
    const arityOfCurriedFunction = func.length;

    function curriedFunction(...passedInArguments) {
        const isRemainingArguments =
            arityOfCurriedFunction - passedInArguments.length > 0;

        if (isRemainingArguments) {
            return functionOfArity((...args) => {
                return curriedFunction(...passedInArguments, ...args);
            }, arityOfCurriedFunction - passedInArguments.length);
        } else {
            return func(...passedInArguments);
        }
    }

    return functionOfArity(curriedFunction, arityOfCurriedFunction);
}

export default curry;
