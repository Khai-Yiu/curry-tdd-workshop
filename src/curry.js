import _ from './_';

function functionOfArity(func, arity) {
    switch (arity) {
        case 4:
            return function (a, b, c, d) {
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
            return function (...args) {
                return func.apply(this, arguments);
            };
    }
}

function replacePlaceholders(currentProvidedArguments, args) {
    const newArguments = [...args];
    const partiallyReplacedArguments = currentProvidedArguments.reduce(
        (replacedArguments, currentArgument) => {
            if (currentArgument === _ && newArguments.length > 0) {
                return [...replacedArguments, newArguments.shift()];
            } else {
                return [...replacedArguments, currentArgument];
            }
        },
        []
    );

    return [...partiallyReplacedArguments, ...newArguments];
}

function curry(func) {
    const arityOfCurriedFunction = func.length;

    function curriedFunction(...passedInArguments) {
        let currentNumberOfArguments = 0;
        for (let i = 0; i < passedInArguments.length; i++) {
            if (passedInArguments[i] !== _) {
                currentNumberOfArguments++;
            }
        }

        const isRemainingArguments =
            arityOfCurriedFunction - currentNumberOfArguments > 0;
        const containsPlaceholder = passedInArguments.find(
            (currentArgument) => currentArgument === _
        );

        if (isRemainingArguments || containsPlaceholder) {
            return functionOfArity((...args) => {
                const newArgumentsToPassIn = replacePlaceholders(
                    passedInArguments,
                    args
                );
                return curriedFunction.call(this, ...newArgumentsToPassIn);
            }, arityOfCurriedFunction - currentNumberOfArguments);
        } else {
            return func.call(this, ...passedInArguments);
        }
    }

    return functionOfArity(curriedFunction, arityOfCurriedFunction);
}

export default curry;
