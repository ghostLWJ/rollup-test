const rollup = require ('rollup');
const json = require ('rollup-plugin-json');
const banner = require ('bannerjs');
const nodeResolve = require ('rollup-plugin-node-resolve');
const commonjs = require ('rollup-plugin-commonjs');
const babel = require ('rollup-plugin-babel');

const watchOptions = {
    input: 'src/main.js',
    plugins: [
        json (),
        nodeResolve (),
        commonjs (),
        babel ({ exclude: 'node_modules/**' })
    ],
    output: [
        {
            file: 'dist/bundle.js',
            name: 'bundle',
            format: 'umd'
        },
        {
            file: 'dist/bundle.common.js',
            name: 'bundle',
            format: 'cjs'
        },
        {
            file: 'dist/bundle.esm.js',
            name: 'bundle',
            format: 'es',
            banner: banner.multibanner ()
        }
    ]
}

const watcher = rollup.watch (watchOptions);

watcher.on ('event', event => {
    
})
