const MIN_K = 3;

export function computeBucketSize(n: number) {
    return Math.ceil(Math.max(MIN_K/n, MIN_K/20) * n);
}

/**
 * Bucketise sorts the list of rawScores into buckets sized by {@link #computeBucketSize}.
 * If the length of the list of scores is less than the number of items per bucket, undefined is returned.
 *
 * @param rawScores is the unsorted list of scores.
 * @returns a list of sorted buckets, each of size k.
 */
export function bucketise(rawScores: number[]): number[][] | undefined {
    const k = computeBucketSize(rawScores.length);
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
 * Normalise reorganises the sorted buckets created with Bucketise to ensure that there are no overlap of scores
 * between buckets.
 *
 * @param buckets is the buckets created by Bucketise.
 */
export function normalise(buckets: number[][] | undefined) {
    // if the buckets are undefined, undefined is returned
    if (buckets === undefined) return undefined;

    const normalisedBuckets: number[][] = [];

    for (let i = 0; i < buckets.length - 1; i++) {
        const bucket = buckets[i];
        const nextBucket = buckets[i + 1];

        // compare current bucket to next bucket
        // to see if the last item in the bucket matches the first item in the next bucket.
        const lastItemCurrentBucket = bucket[bucket.length - 1];
        const firstItemNextBucket = nextBucket[0];

        if (lastItemCurrentBucket === firstItemNextBucket) {
            // if yes:
            // push items from bucket with less to bucket with more.
            let normalisedBucket: number[] = [];

            // For every entry in the bucket, check if it is not equal to the last item in the current bucket.
            // If it's not equal, push it into the normalized bucket.
            // Otherwise, add it to the start of the next bucket.
            for (let entry of bucket) {
                if (entry != lastItemCurrentBucket) {
                    normalisedBucket.push(entry);
                } else {
                    nextBucket.unshift(entry);
                }
            }

            if (normalisedBucket.length >= MIN_K) {
                normalisedBuckets.push(normalisedBucket);
            } else {
                nextBucket.unshift(...normalisedBucket);
            }
        } else {
            // if no:
            // push bucket as is and move onto next set of buckets.
            normalisedBuckets.push(bucket);
        }
    }

    if (buckets.length >= 1) {
        normalisedBuckets.push(buckets[buckets.length - 1]);
    }

    return normalisedBuckets;
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
