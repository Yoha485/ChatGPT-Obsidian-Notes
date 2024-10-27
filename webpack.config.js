const path = require('path');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/content.js',
        output: {
            filename: 'content.js',
            path: path.resolve(__dirname, 'dist/unpacked'),
        },
        mode: argv.mode || 'development',
        optimization: {
            minimize: isProduction,
        },
    };
};
