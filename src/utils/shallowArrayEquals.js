export default function shallowArrayEquals(a, b) {
    var l = a.length;
    if (l !== b.length) { return false; }

    for (var i = 0; i < l; i++) {
        if (a[i] !== b[i]) { return false; }
    }

    return true;
}
