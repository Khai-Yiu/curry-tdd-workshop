function curry(func) {
    return (a) => {
        return (b, c, d) => {
            return func(a, b, c, d);
        };
    };
}

export default curry;
