// 通过颜色矩阵与原始颜色，映射出新的色值
export function transformColor(color, ...matrix){
    const [r, g, b, a] = color;
    matrix = matrix.reduce((a, b) => multiply(a, b));

    color[0] = matrix[0] * r + matrix[1] * g + matrix[2] * b + matrix[3] * a + matrix[4];
    color[1] = matrix[5] * r + matrix[6] * g + matrix[7] * b + matrix[8] * a + matrix[9];
    color[2] = matrix[10] * r + matrix[11] * g + matrix[12] * b + matrix[13] * a + matrix[14];
    color[3] = matrix[15] * r + matrix[16] * g + matrix[17] * b + matrix[18] * a + matrix[19];

  return color;
}

// 像素矩阵乘法运算（ 4 * 5，省略了第五行，应该是 5 * 5的方阵 ）
export function multiply(a, b){
    // a * b
    const output = [];

    // 按照行序计算结果的第1行
    const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4];
    const b0 = b[0], b5 = b[5], b10 = b[10], b15 = b[15];
    output[0] = a0*b0 + a1*b5 + a2*b10 + a3*b15;

    const b1 = b[1], b6 = b[6], b11 = b[11], b16 = b[16];
    output[1] = a0*b1 + a1*b6 + a2*b11 + a3*b16;

    const b2 = b[2], b7 = b[7], b12 = b[12], b17 = b[17];
    output[2] = a0*b2 + a1*b7 + a2*b12 + a3*b17;

    const b3 = b[3], b8 = b[8], b13 = b[13], b18 = b[18];
    output[3] = a0*b3 + a1*b8 + a2*b13 + a3*b18;

    const b4 = b[4], b9 = b[9], b14 = b[14], b19 = b[19];
    output[4] = a0*b4 + a1*b9 + a2*b14 + a3*b19 + a4;

    // 计算结果的第2行
    const a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8], a9 = a[9];
    output[5] = a5*b0 + a6*b5 + a7*b10 + a8*b15;
    output[6] = a5*b1 + a6*b6 + a7*b11 + a8*b16;
    output[7] = a5*b2 + a6*b7 + a7*b12 + a8*b17;
    output[8] = a5*b3 + a6*b8 + a7*b13 + a8*b18;
    output[9] = a5*b4 + a6*b9 + a7*b14 + a8*b19 + a9;
    // 计算结果的第3行
    const a10 = a[10], a11 = a[11], a12 = a[12], a13 = a[13], a14 = a[14];
    output[10] = a10*b0 + a11*b5 + a12*b10 + a13*b15;
    output[11] = a10*b1 + a11*b6 + a12*b11 + a13*b16;
    output[12] = a10*b2 + a11*b7 + a12*b12 + a13*b17;
    output[13] = a10*b3 + a11*b8 + a12*b13 + a13*b18;
    output[14] = a10*b4 + a11*b9 + a12*b14 + a13*b19 + a14;
    // 计算结果的第4行
    const a15 = a[15], a16 = a[16], a17 = a[17], a18 = a[18], a19 = a[19];
    output[15] = a15*b0 + a16*b5 + a17*b10 + a18*b15;
    output[16] = a15*b1 + a16*b6 + a17*b11 + a18*b16;
    output[17] = a15*b2 + a16*b7 + a17*b12 + a18*b17;
    output[18] = a15*b3 + a16*b8 + a17*b13 + a18*b18;
    output[19] = a15*b4 + a16*b9 + a17*b14 + a18*b19 + a19;

    return output;
}