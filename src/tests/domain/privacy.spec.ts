import assert from 'node:assert';
import { anonymise, bucketise, normalise } from '../../domain/privacy';

describe('Privacy Enhancing Technologies Tests', () => {

    describe('bucketise', () => {

        it('should return undefined if the number of scores is less than the bucket size', () => {
            assert.deepStrictEqual(bucketise([1, 2]), undefined);
        });

        it('should return a single bucket if the number of scores is equal to the bucket size', () => {
            assert.deepStrictEqual(bucketise([1, 2, 3]), [[1, 2, 3]]);
        });

        it('should return buckets of the size k, adding the remainder to the last bucket', () => {
            assert.deepStrictEqual(bucketise([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), [[1, 2, 3], [4, 5, 6], [7, 8, 9, 10]]);
        });
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

        it('should return undefined if no buckets are undefined', () => {
            assert.deepStrictEqual(anonymise([]), undefined);
        });

        it('should anonymise buckets correctly', () => {
            assert.deepStrictEqual(anonymise([[1, 2, 3], [4, 5, 6]]), [
                { minScore: 1, maxScore: 3, proportion: 0.5 },
                { minScore: 4, maxScore: 6, proportion: 0.5 }
            ]);
            assert.deepStrictEqual(anonymise([[1, 2, 3], [4, 5, 6], [7, 8, 9, 10]]), [
                { minScore: 1, maxScore: 3, proportion: 0.3 },
                { minScore: 4, maxScore: 6, proportion: 0.3 },
                { minScore: 7, maxScore: 10, proportion: 0.4 }
            ]);
        });

        it("should return undefined if the anonymised bucket's length is less than or equal to 0", () => {
            assert.deepStrictEqual(anonymise([[]]), undefined);
        });

    });

});
