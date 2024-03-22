function curry(func) {
    let numOfProvidedArguments = [];
    const numOfParametersInFunc = func.length;

    function curriedFunction(...args) {
        numOfProvidedArguments = [...numOfProvidedArguments, ...args];

        if (numOfProvidedArguments.length === numOfParametersInFunc) {
            return func(...numOfProvidedArguments);
        }

        return curriedFunction;
    }

    return curriedFunction;
}

export default curry;
