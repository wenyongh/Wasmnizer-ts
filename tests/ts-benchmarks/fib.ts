function fib(n: number): number {
    if (n < 2) {
        return 1;
    }
    return fib(n - 2) + fib(n - 1);
}

export function main() {
    const res: number = fib(42);
    console.log('fib2(42) = ' + res);
}
