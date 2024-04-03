import _ from './_';

function functionOfArity(func, arity) {
    Object.defineProperty(func, 'length', {
        value: arity
    });

    return func;
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
        let numberOfNonPlaceholderArguments = 0;
        for (let i = 0; i < passedInArguments.length; i++) {
            if (passedInArguments[i] !== _) {
                numberOfNonPlaceholderArguments++;
            }
        }

        const workingArity =
            passedInArguments.length > arityOfCurriedFunction
                ? passedInArguments.length
                : arityOfCurriedFunction;
        const numberOfArgumentsRemaining =
            workingArity - numberOfNonPlaceholderArguments;

        if (numberOfArgumentsRemaining > 0) {
            return functionOfArity((...args) => {
                const newArgumentsToPassIn = replacePlaceholders(
                    passedInArguments,
                    args
                );
                return curriedFunction.call(this, ...newArgumentsToPassIn);
            }, numberOfArgumentsRemaining);
        } else {
            return func.call(this, ...passedInArguments);
        }
    }

    return functionOfArity(curriedFunction, arityOfCurriedFunction);
}

export default curry;
