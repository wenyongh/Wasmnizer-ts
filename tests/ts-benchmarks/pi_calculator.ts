function mathRound(x: number): number {
    return Math.floor(x + 0.5);
}

function calculatePi(iterations: number): number {
    let pi = 0.0;
    const four = 4.0;

    for (let i = 0; i < iterations; i++) {
        const numerator: number = i % 2 === 0 ? 1.0 : -1.0;
        const denominator: number = 2 * i + 1;
        const term: number = numerator / denominator;
        pi += term;
    }

    pi *= four;

    pi = mathRound(pi * Math.pow(10, 10)) / Math.pow(10, 10);

    return pi;
}

export function main() {
    let pi = 0;
    for (let i = 0; i < 10; i++) {
        pi = calculatePi(100000000);
    }
    console.log('pi: ' + pi);
}
