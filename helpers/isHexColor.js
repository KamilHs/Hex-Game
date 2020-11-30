module.exports = (hex = "") => {
    if (hex.length != 7) return false;
    if (hex[0] != "#") return false;
    let letters = [
        "a", "b", "c", "d",
        "e", "f", "0", "1",
        "2", "3", "4", "5",
        "6", "7", "8", "9"];
    return [...(hex).slice(1)].every(c => letters.indexOf(c.toLowerCase()) != -1)
}   