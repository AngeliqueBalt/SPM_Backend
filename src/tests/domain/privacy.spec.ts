import assert from 'node:assert';
import { normalise } from '../../domain/privacy';

describe('Privacy Enhancing Technologies Tests', () => {

    describe('bucketise', () => {
        // TODO
    });

    describe('normalise', () => {

        it('should return an empty array if no buckets are provided', () => {
            assert.deepStrictEqual(normalise([]), []);
        });

        it('should leave a bucket as-is when there is only one bucket', () => {
            assert.deepStrictEqual(normalise([[1, 2, 3]]), [[1, 2, 3]]);
        });

        it('should leave the buckets as-is when there are no overlapping items', () => {
            assert.deepStrictEqual(normalise([[1, 2, 3], [4, 5, 6]]), [[1, 2, 3], [4, 5, 6]]);
            assert.deepStrictEqual(normalise([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        });

        it("should shift items up a bucket if there's an overlap", () => {
            assert.deepStrictEqual(normalise([[1, 2, 2, 3], [3, 4, 5]]), [[1, 2, 2], [3, 3, 4, 5]]);
            assert.deepStrictEqual(normalise([[1, 2, 2, 3, 3], [3, 4, 5]]), [[1, 2, 2], [3, 3, 3, 4, 5]]);
        });

        it('should remove redundant buckets', () => {
            assert.deepStrictEqual(normalise([[2, 2, 2], [2, 3, 4]]), [[2, 2, 2, 2, 3, 4]]);
            assert.deepStrictEqual(normalise([[1, 2, 2], [2, 2, 2], [2, 3, 4]]), [[1, 2, 2, 2, 2, 2, 2, 3, 4]]);
        });

    });

    describe('anonymise', () => {
        // TODO
    });

});
