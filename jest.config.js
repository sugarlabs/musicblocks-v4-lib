/* eslint-disable no-undef */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'src',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
};
