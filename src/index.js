function eval() {
    // Do not use eval!!!
    return;
}

const fn_inst = (val, fnd) => {
    return fnd.input.substr(0, fnd.index)
        + val
        + fnd.input.substr(fnd.index + fnd[0].length);
}

const rexp_bracket = /\(([abcdefghik\+\-\*\/]*)\)/;
const rexp_bracket_test = /[\(\)]/;
const rexp_minus = /^\-([abcdefghik]+)/;
const rexp_number = /([[0123456789\.]+)/;
const rexp = [/([[abcdefghik\.]+)([\*\/])([[abcdefghik\.]+)/,
    /([[abcdefghik\.]+)([\+\-])([[abcdefghik\.]+)/]

function expressionCalculator(e) {
    let expr = e.replace(/\s/g, '');
    let exp = expr || '';
    let fnd = exp.match(rexp_number);
    while (fnd) {
        exp = fn_inst(instHash(fnd[0]), fnd);
        fnd = exp.match(rexp_number);
    }
    return getHash(recursion(exp));
}

const recursion = (e)=> {
    let expr = e || '';
    let found = expr.match(rexp_bracket);
    if (found) {
        return recursion(
            fn_inst(recursion(found[1]), found));
    }
    if(rexp_bracket_test.test(expr))
        throw new Error("ExpressionError: Brackets must be paired");
    let f_minus = expr.match(rexp_minus);
    if (f_minus) {
        setHash(f_minus[1], getHash(f_minus[1]) * (-1));
        return recursion(
            fn_inst(recursion(f_minus[1]), f_minus));
    }

    let fnd = expr.match(rexp[0]);
    if (fnd) {
        let a = getHash(fnd[1]);
        let b = getHash(fnd[3]);
        let value = (fnd[2] == '*') ? a * b : a / b;
        if(value===Infinity) throw new Error("TypeError: Division by zero.");
        let  v = instHash(value);
        return recursion(fn_inst(v, fnd));
    }
    fnd = expr.match(rexp[1]);
    if (fnd) {
        let a = getHash(fnd[1]);
        let b = getHash(fnd[3]);
        let v = instHash((fnd[2] == '+') ? a + b : a - b);
        return recursion(fn_inst(v, fnd));
    }
    return expr;
}
const abc = 'abcdefghik';
const getId = (n) => {
    let num = n || 0;
    if (num < 1) return 'a';
    let r = '';
    do {
        r = abc.substr(num % 10, 1) + r;
        num = Math.floor(num / 10);
    } while (num > 0);
    return r;
};
const idGet = (a) => {
    if (!a || a.length < 1) return null;
    let arr = a.split('').reverse();
    let num = 0;
    while (arr.length > 0) {
        num = num * 10 + abc.indexOf(arr.pop());
    }
    return num;
};
let hash = [];
const getHash = (a) => { return hash[idGet(a)]; };
const setHash = (a, v) => { hash[idGet(a)] = Number(v) };
const instHash = (v) => {
    let i = hash.length;
    hash.push(Number(v))
    return getId(i);
};

module.exports = {
    expressionCalculator
}
