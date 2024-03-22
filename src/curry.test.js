import { curry } from './curry';

describe('curry', () => {
    it('curries a single value', () => {
        const addFunction = (a, b, c, d) => (a + b * c) / d;
        const f = curry(addFunction);
        const g = f(12);

        expect(g(3, 6, 2)).toBe(15);
    });
});
