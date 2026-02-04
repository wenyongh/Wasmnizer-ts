const ITERATIONS = 100;
const LENGTH = 100;

const x: number[] = new Array<number>(LENGTH).fill(0);

function switch_body(): void {
    const length: number = LENGTH;

    for (let i = 0; i < length; i++) {
        x[i] = i;
    }

    for (let j = 0; j < ITERATIONS; j++) {
        for (let i = 0; i < length; i++) {
            switch (x[i] % 10) {
                case 0:
                    x[i] ^= 399;
                    break;
                case 1:
                    x[i] ^= 694;
                    break;
                case 2:
                    x[i] ^= 3492;
                    break;
                case 3:
                    x[i] ^= 178;
                    break;
                case 4:
                    x[i] ^= 2502;
                    break;
                case 5:
                    x[i] ^= 3860;
                    break;
                case 6:
                    x[i] ^= 3571;
                    break;
                case 7:
                    x[i] ^= 2405;
                    break;
                case 8:
                    x[i] ^= 1111;
                    break;
                case 9:
                    x[i] ^= 3855;
                    break;
            }
        }
    }

    const str = '';
    let i = 0;
    for (i = 0; i < 20; i++) {
        console.log(x[i]);
    }
}

export function main() {
    switch_body();
}
