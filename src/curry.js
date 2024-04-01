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
            break;
    }
}

function replacePlaceholders(currentArguments, args) {
    const newArguments = [...args];
    let argIndex = 0;
    const partiallyReplacedArguments = currentArguments.map((argument) => {
        if (argument === _ && argIndex < newArguments.length) {
            const argumentToReplace = newArguments[argIndex];
            argIndex++;

            return argumentToReplace;
        } else {
            return argument;
        }
    });

    let remainingArguments = [];
    for (let i = argIndex; i < args.length; i++) {
        remainingArguments = [...remainingArguments, newArguments[i]];
    }

    return [partiallyReplacedArguments, remainingArguments];
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

        if (isRemainingArguments) {
            return functionOfArity((...args) => {
                const [partiallyReplacedArguments, remainingArguments] =
                    replacePlaceholders(passedInArguments, args);
                return curriedFunction.call(
                    this,
                    ...partiallyReplacedArguments,
                    ...remainingArguments
                );
            }, arityOfCurriedFunction - currentNumberOfArguments);
        } else {
            return func.call(this, ...passedInArguments);
        }
    }

    return functionOfArity(curriedFunction, arityOfCurriedFunction);
}

export default curry;
