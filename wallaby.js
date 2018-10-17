module.exports = () => {
    return {
        files: [
            {pattern: 'node_modules/chai/chai.js', instrument: false, load: true},
            'index.js'
        ],
        tests: ['test/*.test.js'],

        env: {
            type: 'node'
        },

        testFramework: 'mocha',

        debug: true,

        setup() {
            global.expect = chai.expect;
        }
    };
};
