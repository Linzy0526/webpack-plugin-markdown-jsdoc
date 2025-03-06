const MarkdownJsdocPlugin = require('../index.js');
const path = require('path');

module.exports = {
    entry: './test/index.js',
    output: {
        path: path.resolve(__dirname, './test/dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new MarkdownJsdocPlugin({
            outputPath: './test/dist/api-docs.md',
            exclude: ['node_modules'],
        })
    ]
}