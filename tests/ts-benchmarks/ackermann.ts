function ackermann(M: number, N: number): number {
    if (M === 0) {
        return N + 1;
    }
    if (N === 0) {
        return ackermann(M - 1, 1);
    }
    return ackermann(M - 1, ackermann(M, N - 1));
}

export function main() {
    const res: number = ackermann(3, 12);
    console.log('##ackerman(3, 12) = ' + res);
}
