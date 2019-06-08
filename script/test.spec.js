let { initialSort } = require("./ManberMyersDivided");
const {assert, expect} = require('chai');

describe("SimpleSortTesting", () => {
    it("simple testing", () => {
        let initText = "abracadabra";
        let result = initialSort(initText);

        let expected = [initText.length, 0, 3, 5, 7, 10, 1, 8, 4, 6, 2, 9];

        expect(expected).to.eql(result);
    })
})