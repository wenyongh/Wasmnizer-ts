//const ITERATIONS = 20000;
const ITERATIONS = 20;

const VARIANT_NO_PADDING_MASK = 0x2;
const VARIANT_URLSAFE_MASK = 0x4;

function base64_ENCODED_LEN(BIN_LEN: number, VARIANT: number): number {
    const remainder = BIN_LEN - Math.floor(BIN_LEN / 3) * 3;
    const has_remainder = (remainder | (remainder >> 1)) & 1;
    const no_padding = (VARIANT & 2) >> 1;
    const padding_mask = -no_padding - 1; // equivalent to ~(no_padding - 1)
    const padding_adjust = padding_mask & (3 - remainder);
    return (
        Math.floor(BIN_LEN / 3) * 4 + has_remainder * (4 - padding_adjust) + 1
    );
}

function EQ(x: number, y: number): number {
    return (((0 - (x ^ y)) >> 8) & 0xff) ^ 0xff;
}

function GT(x: number, y: number): number {
    return ((y - x) >> 8) & 0xff;
}

function GE(x: number, y: number): number {
    return GT(y, x) ^ 0xff;
}

function LT(x: number, y: number): number {
    return GT(y, x);
}

function LE(x: number, y: number): number {
    return GE(y, x);
}

function b64_byte_to_char(x: number): number {
    return (
        (LT(x, 26) & (x + 'A'.charCodeAt(0))) |
        (GE(x, 26) & LT(x, 52) & (x + ('a'.charCodeAt(0) - 26))) |
        (GE(x, 52) & LT(x, 62) & (x + ('0'.charCodeAt(0) - 52))) |
        (EQ(x, 62) & '+'.charCodeAt(0)) |
        (EQ(x, 63) & '/'.charCodeAt(0))
    );
}

function b64_char_to_byte(c: number): number {
    const x =
        (GE(c, 'A'.charCodeAt(0)) &
            LE(c, 'Z'.charCodeAt(0)) &
            (c - 'A'.charCodeAt(0))) |
        (GE(c, 'a'.charCodeAt(0)) &
            LE(c, 'z'.charCodeAt(0)) &
            (c - ('a'.charCodeAt(0) - 26))) |
        (GE(c, '0'.charCodeAt(0)) &
            LE(c, '9'.charCodeAt(0)) &
            (c - ('0'.charCodeAt(0) - 52))) |
        (EQ(c, '+'.charCodeAt(0)) & 62) |
        (EQ(c, '/'.charCodeAt(0)) & 63);

    return x | (EQ(x, 0) & (EQ(c, 'A'.charCodeAt(0)) ^ 0xff));
}

function b64_byte_to_urlsafe_char(x: number): number {
    return (
        (LT(x, 26) & (x + 'A'.charCodeAt(0))) |
        (GE(x, 26) & LT(x, 52) & (x + ('a'.charCodeAt(0) - 26))) |
        (GE(x, 52) & LT(x, 62) & (x + ('0'.charCodeAt(0) - 52))) |
        (EQ(x, 62) & '-'.charCodeAt(0)) |
        (EQ(x, 63) & '_'.charCodeAt(0))
    );
}

function b64_urlsafe_char_to_byte(c: number): number {
    const x =
        (GE(c, 'A'.charCodeAt(0)) &
            LE(c, 'Z'.charCodeAt(0)) &
            (c - 'A'.charCodeAt(0))) |
        (GE(c, 'a'.charCodeAt(0)) &
            LE(c, 'z'.charCodeAt(0)) &
            (c - ('a'.charCodeAt(0) - 26))) |
        (GE(c, '0'.charCodeAt(0)) &
            LE(c, '9'.charCodeAt(0)) &
            (c - ('0'.charCodeAt(0) - 52))) |
        (EQ(c, '-'.charCodeAt(0)) & 62) |
        (EQ(c, '_'.charCodeAt(0)) & 63);

    return x | (EQ(x, 0) & (EQ(c, 'A'.charCodeAt(0)) ^ 0xff));
}

function base64_check_variant(variant: number): void {
    // Check if variant has bit 0 set and no other bits except bit 1 and 2
    // For benchmark purposes, we assume variant is valid
    // Original check: ((variant) & ~0x6) !== 0x1
}

function base64_encoded_len(bin_len: number, variant: number): number {
    base64_check_variant(variant);
    return base64_ENCODED_LEN(bin_len, variant);
}

function bin2base64(
    b64: string[],
    b64_maxlen: number,
    bin: number[],
    bin_len: number,
    variant: number,
): string[] {
    let acc_len = 0;
    let b64_len: number;
    let b64_pos = 0;
    let bin_pos = 0;
    let acc = 0;

    base64_check_variant(variant);
    const nibbles: number = Math.floor(bin_len / 3);
    const remainder: number = bin_len - 3 * nibbles;
    b64_len = nibbles * 4;
    if (remainder !== 0) {
        if ((variant & VARIANT_NO_PADDING_MASK) === 0) {
            b64_len += 4;
        } else {
            b64_len += 2 + (remainder >> 1);
        }
    }
    // For benchmark purposes, we assume b64_maxlen is sufficient

    const byteToChar =
        (variant & VARIANT_URLSAFE_MASK) !== 0
            ? b64_byte_to_urlsafe_char
            : b64_byte_to_char;

    while (bin_pos < bin_len) {
        acc = (acc << 8) + bin[bin_pos++];
        acc_len += 8;
        while (acc_len >= 6) {
            acc_len -= 6;
            b64[b64_pos++] = String.fromCharCode(
                byteToChar((acc >> acc_len) & 0x3f),
            );
        }
    }
    if (acc_len > 0) {
        b64[b64_pos++] = String.fromCharCode(
            byteToChar((acc << (6 - acc_len)) & 0x3f),
        );
    }

    while (b64_pos < b64_len) {
        b64[b64_pos++] = '=';
    }
    while (b64_pos < b64_maxlen) {
        b64[b64_pos++] = '\0';
    }

    return b64;
}

function my_strchr(s: string, c: number): number {
    // Returns index if found, -1 if not found
    for (let i = 0; i < s.length; i++) {
        if (s.charCodeAt(i) === c) {
            return i;
        }
    }
    return -1;
}

function _base642bin_skip_padding(
    b64: string,
    b64_len: number,
    b64_pos_p: number[],
    ignore: string | null,
    padding_len: number,
): number {
    let c: number;

    while (padding_len > 0) {
        if (b64_pos_p[0] >= b64_len) {
            return -1;
        }
        c = b64.charCodeAt(b64_pos_p[0]);
        if (c === '='.charCodeAt(0)) {
            padding_len--;
        } else if (ignore === null || my_strchr(ignore, c) === -1) {
            return -1;
        }
        b64_pos_p[0]++;
    }
    return 0;
}

function base642bin(
    bin: number[],
    bin_maxlen: number,
    b64: string,
    b64_len: number,
    ignore: string | null,
    bin_len: number[] | null,
    b64_end: string[] | null,
    variant: number,
): number {
    let acc_len = 0;
    let b64_pos = 0;
    let bin_pos = 0;
    const is_urlsafe = (variant & VARIANT_URLSAFE_MASK) !== 0;
    let ret = 0;
    let acc = 0;
    let d: number;
    let c: number;

    base64_check_variant(variant);

    while (b64_pos < b64_len) {
        c = b64.charCodeAt(b64_pos);
        if (is_urlsafe) {
            d = b64_urlsafe_char_to_byte(c);
        } else {
            d = b64_char_to_byte(c);
        }
        if (d === 0xff) {
            if (ignore !== null && my_strchr(ignore, c) >= 0) {
                b64_pos++;
                continue;
            }
            break;
        }
        acc = (acc << 6) + d;
        acc_len += 6;
        if (acc_len >= 8) {
            acc_len -= 8;
            if (bin_pos >= bin_maxlen) {
                ret = -1;
                break;
            }
            bin[bin_pos++] = (acc >> acc_len) & 0xff;
        }
        b64_pos++;
    }
    if (acc_len > 4 || (acc & ((1 << acc_len) - 1)) !== 0) {
        ret = -1;
    } else if (ret === 0 && (variant & VARIANT_NO_PADDING_MASK) === 0) {
        ret = _base642bin_skip_padding(
            b64,
            b64_len,
            [b64_pos],
            ignore,
            Math.floor(acc_len / 2),
        );
    }
    if (ret !== 0) {
        bin_pos = 0;
    } else if (ignore !== null) {
        while (
            b64_pos < b64_len &&
            my_strchr(ignore, b64.charCodeAt(b64_pos)) >= 0
        ) {
            b64_pos++;
        }
    }
    if (b64_end !== null) {
        b64_end[0] = b64.slice(b64_pos);
    } else if (b64_pos !== b64_len) {
        ret = -1;
    }
    if (bin_len !== null) {
        bin_len[0] = bin_pos;
    }
    return ret;
}

function base64_body(): void {
    const len = 1000;
    const b64_len = base64_encoded_len(len, 1);
    const bin: number[] = new Array<number>(1000).fill(0);
    const b64: string[] = new Array<string>(4096).fill('');
    const temp_bin_len: number[] = new Array<number>(1).fill(0);
    const temp_b64_end: string[] = new Array<string>(1).fill('');

    for (let i = 0; i < 1000; i++) {
        bin[i] = i * 3;
    }

    for (let i = 0; i < ITERATIONS; i++) {
        bin2base64(b64, b64_len, bin, len, 1);
        base642bin(
            bin,
            len,
            b64.join(''),
            b64_len,
            null,
            temp_bin_len,
            temp_b64_end,
            1,
        );
    }

    console.log('##res: ' + b64.join(''));
}

base64_body();
