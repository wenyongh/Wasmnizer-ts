function stringToNumber(str: string): number {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
        const charCode: number = str.charCodeAt(i);
        if (charCode >= 48 && charCode <= 57) {
            // '0' to '9'
            result = result * 10 + (charCode - 48);
        }
    }
    return result;
}

function nested_loop(args: string): number {
    const u: number = stringToNumber(args);
    const r: number = (u * 5678) % 10000;
    const a: number[] = new Array<number>(10000).fill(0);

    for (let i = 0; i < 10000; i++) {
        for (let j = 0; j < 100000; j++) {
            a[i] = a[i] + (j % u);
        }
        a[i] += r;
    }

    console.log(a[r]);
    return 0;
}

export function main() {
    const arg = '1234';
    nested_loop(arg);
}
