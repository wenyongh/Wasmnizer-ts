const LENGTH = 10000;
const ITERATIONS = 1000;
const IM = 139968;
const IA = 3877;
const IC = 29573;

let last = 42;
const buf: number[] = new Array<number>(LENGTH + 2).fill(0);

function gen_random(max: number): number {
    last = (last * IA + IC) % IM;
    return Math.floor((max * last) / IM);
}

function my_heapsort(ra: number[], n: number): void {
    let i: number, j: number;
    let ir: number = n;
    let l: number = Math.floor(n / 2) + 1;
    let rra: number;
    let loop = true;

    while (loop) {
        console.log('##my_heapsort 1');
        if (l > 1) {
            rra = ra[--l];
        } else {
            rra = ra[ir];
            ra[ir] = ra[1];
            if (--ir === 1) {
                ra[1] = rra;
                loop = false;
                return;
            }
        }

        console.log('##my_heapsort 2');
        i = l;
        j = l * 2;
        while (j <= ir) {
            console.log('##my_heapsort, j: ' + j);
            if (j < ir && ra[j] < ra[j + 1]) {
                j++;
                console.log('##my_heapsort 2 2');
            }
            if (rra < ra[j]) {
                console.log('##my_heapsort 2 3');
                ra[i] = ra[j];
                console.log('##my_heapsort 2 4');
                i = j;
                j += i;
            } else {
                j = ir + 1;
            }
        }
        console.log('##my_heapsort 3');
        ra[i] = rra;
        console.log('##my_heapsort 4');
    }
}

function heapsort_body(array: number[], n: number): void {
    for (let i = 0; i < ITERATIONS; i++) {
        console.log('##i: ' + i);
        for (let j = 1; j <= n; j++) {
            array[j] = gen_random(1000000);
        }
        console.log('##i : ' + i + ', end');
        my_heapsort(array, n);
    }
}

export function main(): void {
    console.log('##1');
    heapsort_body(buf, LENGTH);
    console.log('##2');

    console.log(
        'buf[0]: ' +
            buf[0] +
            ', buf[1]: ' +
            buf[1] +
            ', buf[2]: ' +
            buf[2] +
            ', buf[100]: ' +
            buf[100] +
            ', buf[200]: ' +
            buf[200] +
            ', buf[10000]: ' +
            buf[10000],
    );
}

main();
