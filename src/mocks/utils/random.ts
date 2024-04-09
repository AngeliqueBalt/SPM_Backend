import { randomInt } from 'node:crypto';

export enum Skew {
    veryLow,
    low,
    none,
    high,
    veryHigh
}

/**
 * skewExponent returns an exponent that can be used to skew a random distribution in the intended manner.
 *
 * @param skew The direction and extent to which the random distribution should be skewed.
 */
function skewExponent(skew: Skew): number {
    let exponent: number;

    switch (skew) {
        case Skew.veryLow:
            exponent = 8;
            break;
        case Skew.low:
            exponent = 4;
            break;
        case Skew.none:
            exponent = 1;
            break;
        case Skew.high:
            exponent = 1/4;
            break;
        case Skew.veryHigh:
            exponent = 1/8;
            break;
    }

    return exponent;
}

/**
 * uniformRandomDouble obtains a cryptographically-secure random floating point number between [0, 1).
 */
export function uniformRandomDouble(): number {
    return randomInt(0xffffffffffff)/0xffffffffffff;
}

/**
 * gaussianRandomDouble computes a normal distribution of random numbers from a source of uniform random numbers using
 * the Box-Muller transformation.
 *
 * Adapted from source: https://stackoverflow.com/a/36481059/2872279
 *
 * @param mean The mean of the transformed distribution
 * @param standardDeviation The standard deviation of the transformed distribution
 */
export function gaussianRandomDouble(mean: number = 0, standardDeviation: number = 1) {
    const u = 1 - uniformRandomDouble();
    const v = uniformRandomDouble();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    // Transform the normal distribution.
    return z * standardDeviation + mean;
}

export function computeTrimodalWeightedSkew(
    extreme: number = 0.1,
    skew: number = 0.5,
) {
    let direction = randomInt(2);
    let weight = uniformRandomDouble();

    if (weight < extreme) {
        switch (direction) {
            case 0: return Skew.veryLow;
            case 1: return Skew.veryHigh;
        }
    }

    if (weight < skew) {
        switch (direction) {
            case 0: return Skew.low;
            case 1: return Skew.high;
        }
    }

    return Skew.none;
}

export function skewedRandomDouble(skew: Skew): number {
    return Math.pow(uniformRandomDouble(), skewExponent(skew));
}

export function weightedRandomDouble(): number {
    return skewedRandomDouble(computeTrimodalWeightedSkew());
}

export function hybridWeightedRandomDouble(): number {
    const skew = computeTrimodalWeightedSkew();

    if (skew == Skew.none) {
        return Math.min(Math.max(gaussianRandomDouble(50, 10), 0), 100)/100;
    }

    return skewedRandomDouble(skew);
}
