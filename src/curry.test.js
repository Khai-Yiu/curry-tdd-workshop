import curry from './curry';

describe('curry', () => {
    it('curries a single value', () => {
        const mockedFunctionToCurry = jest.fn((a, b, c, d) => (a + b * c) / d);
        const f = curry(mockedFunctionToCurry);
        const g = f(12);

        expect(g(3, 6, 2)).toBe(15);
        expect(mockedFunctionToCurry).toHaveBeenCalledWith(12, 3, 6, 2);
    });
    it('curries multiple values', () => {
        const mockedFunctionToCurry = jest.fn((a, b, c, d) => (a + b * c) / d);
        const f = curry(mockedFunctionToCurry);
        const g = f(12, 3);

        expect(g(6, 2)).toBe(15);
        expect(mockedFunctionToCurry).toHaveBeenCalledWith(12, 3, 6, 2);
    });
});
