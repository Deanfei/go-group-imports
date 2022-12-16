"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const utils_1 = require("../utils");
suite('GetImportsRange Test', () => {
    test('should return file lines count for file without imports', () => {
        const documentText = `
    package main

    func main() {}
    `;
        const range = (0, utils_1.getImportsRange)(documentText);
        assert.equal(range.start, documentText.split('\n').length + 1);
        assert.equal(range.end, documentText.split('\n').length + 1);
    });
    test('should return file lines count if no multiline imports in file', () => {
        const documentText = `
    package main

    import "fmt"

    func main() {
      fmt.Println("Hello!")
    }
    `;
        const range = (0, utils_1.getImportsRange)(documentText);
        assert.equal(range.start, documentText.split('\n').length + 1);
        assert.equal(range.end, documentText.split('\n').length + 1);
    });
    test('should return proper range on import statements in file', () => {
        const documentText = `
    package main

    import (
      "fmt"
      "strings"
      "github.com/blackdahila/package"
    )

    func main() {
      fmt.Println("Hello!")
      package.FindAllIds(strings.Split("1, 2, 3, 4", ","))
    }
    `;
        const range = (0, utils_1.getImportsRange)(documentText);
        assert.equal(range.start, 4);
        assert.equal(range.end, 7);
    });
    test('should return proper range on import statements in file regaridng empty lines', () => {
        const documentText = `
    package main

    import (
      "fmt"

      "strings"

      "github.com/blackdahila/package"
    )

     func main() {
       fmt.Println("Hello!")
       package.FindAllIds(strings.Split("1, 2, 3, 4", ","))
     }
     `;
        const range = (0, utils_1.getImportsRange)(documentText);
        assert.equal(range.start, 4);
        assert.equal(range.end, 9);
    });
});
//# sourceMappingURL=getImportsRange.test.js.map