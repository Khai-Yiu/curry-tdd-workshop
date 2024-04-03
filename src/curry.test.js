import curry from './curry';
import _ from './_';
import fc from 'fast-check';

describe('curry', () => {
    it('curries a single value', () => {
        const mockedFunctionToCurry = jest.fn((a, b, c, d) => (a + b * c) / d);
        const f = curry(mockedFunctionToCurry);
        const g = f(12);

        expect(mockedFunctionToCurry.length).toEqual(4);
        expect(typeof g).toBe('function');
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
    it('allows further currying of a curried function', () => {
        const mockedFunctionToCurry = jest.fn((a, b, c, d) => (a + b * c) / d);
        const f = curry(mockedFunctionToCurry);
        const g = f(12);
        expect(g(3, 6, 2)).toEqual(15);

        const h = g(3);

        expect(h(6, 2)).toEqual(15);
        expect(g(3, 6)(2)).toEqual(15);
    });
    it('properly reports the length of the curried function', () => {
        const mockedFunctionToCurry = jest.fn((a, b, c, d) => (a + b * c) / d);
        const f = curry(mockedFunctionToCurry);
        expect(f.length).toBe(4);

        const g = f(12);
        expect(g.length).toBe(3);

        const h = g(3);
        expect(h.length).toBe(2);
        expect(typeof g(3, 6)).toEqual('function');
        expect(g(3, 6).length).toBe(1);
    });
    it('preserves context', () => {
        const ctx = { x: 10 };
        const f = function (a, b) {
            return a + b * this.x;
        };
        const g = curry(f);

        expect(g.call(ctx, 2, 4)).toEqual(42);
        expect(g.call(ctx, 2).call(ctx, 4)).toEqual(42);
    });
    it('supports _ placeholder', function () {
        const f = function (a, b, c) {
            return [a, b, c];
        };
        const g = curry(f);

        function eq(result, expected) {
            return expect(result).toEqual(expected);
        }

        eq(g(1)(2)(3), [1, 2, 3]);
        eq(g(1)(2, 3), [1, 2, 3]);
        eq(g(1, 2)(3), [1, 2, 3]);
        eq(g(1, 2, 3), [1, 2, 3]);

        eq(g(_, 2, 3)(1), [1, 2, 3]);
        eq(g(1, _, 3)(2), [1, 2, 3]);
        eq(g(1, 2, _)(3), [1, 2, 3]);

        eq(g(1, _, _)(2)(3), [1, 2, 3]);
        eq(g(_, 2, _)(1)(3), [1, 2, 3]);
        eq(g(_, _, 3)(1)(2), [1, 2, 3]);

        eq(g(1, _, _)(2, 3), [1, 2, 3]);
        eq(g(_, 2, _)(1, 3), [1, 2, 3]);
        eq(g(_, _, 3)(1, 2), [1, 2, 3]);

        eq(g(1, _, _)(_, 3)(2), [1, 2, 3]);
        eq(g(_, 2, _)(_, 3)(1), [1, 2, 3]);
        eq(g(_, _, 3)(_, 2)(1), [1, 2, 3]);

        eq(g(_, _, _)(_, _)(_)(1, 2, 3), [1, 2, 3]);
        eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3]);
    });
    it('forwards extra arguments', function () {
        const f = function (a, b, c) {
            void c;
            return Array.prototype.slice.call(arguments);
        };
        const g = curry(f);

        function eq(result, expected) {
            return expect(result).toEqual(expected);
        }

        eq(g(1, 2, 3), [1, 2, 3]);
        eq(g(1, 2, 3, 4), [1, 2, 3, 4]);
        eq(g(1, 2)(3, 4), [1, 2, 3, 4]);
        eq(g(1)(2, 3, 4), [1, 2, 3, 4]);
        eq(g(1)(2)(3, 4), [1, 2, 3, 4]);
    });
    it('handles arguments beyond function arity when called with placeholder', function () {
        const f = function (a, b, c) {
            return [a, b, c];
        };
        const g = curry(f);

        function eq(result, expected) {
            return expect(result).toEqual(expected);
        }

        eq(g(1)(_, _, _)(2, _, _)(3)(4), [1, 2, 3]);
        eq(g(_, 2, 3, 4)(1), [1, 2, 3]);
        eq(g(1, 2, 3, _)(4), [1, 2, 3]);
        eq(g(1)(_, 3, 4)(2), [1, 2, 3]);
        eq(g(_)(_, 2, 3, 4)(1), [1, 2, 3]);
        eq(g(_)(_, 2, _, 4, 5)(_, 3, 4)(1), [1, 2, 3]);
        eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3]);
        eq(g(_)(_, 2, _, 4, 5)(1, 3), [1, 2, 3]);
    });
    it('passes along all arguments from previous calls including placeholder', function () {
        const f = function () {
            return [...arguments];
        };
        const g = curry(f);

        function eq(result, expected) {
            return expect(result).toEqual(expected);
        }

        eq(g(_)(_, 2, _, 4, 5)(1, 3), [1, 2, 3, 4, 5]);
        eq(
            g(_, 2, 3, 4)(_, 5, 6)(_, 7, 8, 9)(1, 10),
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        );
        eq(g(1), [1]);
        eq(g(), []);
    });
    describe('curry properties', () => {
        it('curries multiple values', () => {
            fc.assert(
                fc.property(
                    fc.func(fc.anything()),
                    fc.anything(),
                    fc.anything(),
                    fc.anything(),
                    fc.anything(),
                    function (f, a, b, c, d) {
                        const f4 = function (a, b, c, d) {
                            return f(a, b, c, d);
                        };
                        const g = curry(f4);

                        expect(g(a, b, c, d)).toEqual(f4(a, b, c, d));
                        expect(g(a)(b)(c)(d)).toEqual(f4(a, b, c, d));
                        expect(g(a)(b, c, d)).toEqual(f4(a, b, c, d));
                        expect(g(a, b)(c, d)).toEqual(f4(a, b, c, d));
                        expect(g(a, b, c)(d)).toEqual(f4(a, b, c, d));
                    }
                )
            );
        });
        it('curries with placeholder', () => {
            fc.assert(
                fc.property(
                    fc.func(fc.anything()),
                    fc.anything(),
                    fc.anything(),
                    fc.anything(),
                    function (f, a, b, c) {
                        const f3 = function (a, b, c) {
                            return f(a, b, c);
                        };
                        const g = curry(f3);

                        expect(g(_, _, c)(a, b)).toEqual(f3(a, b, c));
                        expect(g(a, _, c)(b)).toEqual(f3(a, b, c));
                        expect(g(_, b, c)(a)).toEqual(f3(a, b, c));
                        expect(g(a, _, _)(_, c)(b)).toEqual(f3(a, b, c));
                        expect(g(a, b, _)(c)).toEqual(f3(a, b, c));
                    }
                )
            );
        });
    });
});
