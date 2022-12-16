"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const group_1 = require("../group");
const ROOT = 'github.com/blackdahila';
suite('Group Test', () => {
    test('should return the same list if all imports are from the same group', () => {
        const imports = [
            'fmt',
            'math',
            'errors',
        ];
        const groupedImports = (0, group_1.group)(imports, ROOT);
        assert.deepEqual(groupedImports.stdlib, imports);
        assert.deepEqual(groupedImports.own, []);
        assert.deepEqual(groupedImports.thirdParty, []);
    });
    test('should return group imports for two different groups', () => {
        const imports = ['fmt', 'math', 'errors', 'github.com/package/package'];
        const groupedImports = (0, group_1.group)(imports, ROOT);
        assert.deepEqual(groupedImports.stdlib, imports.slice(0, 3));
        assert.deepEqual(groupedImports.thirdParty, imports.slice(3));
        assert.deepEqual(groupedImports.own, []);
    });
    test('should return separated third party imports from own imports', () => {
        const imports = ['github.com/blackdahila/package', 'github.com/package/package'];
        const groupedImports = (0, group_1.group)(imports, ROOT);
        assert.deepEqual(groupedImports.thirdParty, [imports[1]]);
        assert.deepEqual(groupedImports.own, [imports[0]]);
        assert.deepEqual(groupedImports.stdlib, []);
    });
    test('should return grouped mixed imports', () => {
        const imports = [
            'github.com/blackdahila/package',
            'github.com/package/package',
            'math',
            'fmt',
            'err "errors"',
            'database/sql',
            'github.com/jmoiron/sqlx',
            'test "github.com/blackdahila/testing"',
        ];
        const groupedImports = (0, group_1.group)(imports, ROOT);
        assert.deepEqual(groupedImports.thirdParty, [
            'github.com/package/package',
            'github.com/jmoiron/sqlx',
        ]);
        assert.deepEqual(groupedImports.own, [
            'github.com/blackdahila/package',
            'test "github.com/blackdahila/testing"',
        ]);
        assert.deepEqual(groupedImports.stdlib, [
            'math',
            'fmt',
            'err "errors"',
            'database/sql',
        ]);
    });
});
//# sourceMappingURL=group.test.js.map