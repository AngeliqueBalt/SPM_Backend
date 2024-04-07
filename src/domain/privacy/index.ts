/**
 * Bucketise sorts the list of rawScores into buckets of size k.
 * If the length of the list of scores is less than the number of items per bucket, undefined is returned.
 *
 * @param k is the number of items in a single bucket.
 * @param rawScores is the unsorted list of scores.
 * @returns a list of sorted buckets, each of size k.
 */
export function bucketise(rawScores: number[], k: number): number[][] | undefined {
    if (rawScores.length < k) {
        return undefined;
    }

    const n = Math.floor(rawScores.length / k);

    const remainder = rawScores.length % k;

    // sort scores from lowest to highest
    const scores = rawScores.sort((a, b) => a - b);

    const buckets: number[][] = [];


    // make n buckets
    for(let i = 0; i < n; i++) {
        // make bucket
        let bucket: number[] = [];

        // fill bucket
        for (let index = 0; index < k; index++){
            // k * i is the offset to move along the list of scores
            bucket.push(scores[index + k*i]);

        }

        // add to list of buckets
        buckets.push(bucket);
    }

    if (remainder > 0) {
        for (let index = 0; index < remainder; index++){
            buckets[n -1].push(scores[index + k * n]);
        }
    }

    return buckets;
}


/**
 * Anonymise takes the buckets from the bucketise function and creates a new array with the first and last item of the bucket.
 *
 * @param buckets a list of sorted buckets, each of size k.
 * @returns a new bucket only containing the first and last item in each bucket.
 */

export function anonymise(buckets: number[][] | undefined) {
    // if the buckets are undefined, undefined is returned
    if (buckets === undefined) return undefined;

    const anonymised = buckets
        // the buckets are filtered to only include buckets where the length is greater than 0
        .filter((bucket) => bucket.length > 0)
        // the bucket is then mapped to include only the first item and then last item in the bucket
        .map((bucket) => ({
            minScore: bucket[0] ,
            maxScore: bucket[bucket.length - 1],
            proportion: ((bucket.length)/(buckets.flat(1).length))
        }));

    // if the length of anonymised is greater than 0 return the value of anonymised else return undefined
    return anonymised.length > 0 ? anonymised : undefined;
}
