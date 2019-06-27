const rollup = require ('rollup');
const json = require ('rollup-plugin-json');
const nodeResolve = require ('rollup-plugin-node-resolve');
const commonjs = require ('rollup-plugin-commonjs');
const babel = require ('rollup-plugin-babel');
const banner = require ('bannerjs');
const zlib = require ('zlib');
const uglify = require ('uglify-js');

const fs = require ('fs');
const path = require ('path');

const inputOptions = {
    input: 'src/main.js',
    plugins: [
        json (),
        nodeResolve (),
        commonjs (),
        babel ( { exclude: 'node_modules/**' } )
    ]
};

const umdOutputOptions = {
    format: 'umd',
    name: 'bundle',
    banner: banner.multibanner ()
}

const commonOutputOptions = {
    format: 'cjs',
    name: 'bundle',
    banner: banner.multibanner ()
}

const esOutputOptions = {
    format: 'es',
    name: 'bundle',
    banner: banner.multibanner ()
}

const uglifyOption = {
    compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
      output: {
        ascii_only: true,
      },
}

async function build () {
    const bundle = await rollup.rollup (inputOptions);

    // console.log (bundle.imports);
    // console.log (bundle.exports);
    // console.log (bundle.modules);

    const umd = await bundle.generate (umdOutputOptions);

    const es = await bundle.generate (esOutputOptions);

    const common = await bundle.generate (commonOutputOptions);

    await write ('dist/bundle.js', umd.output[0].code);
    write ('dist/bundle.min.js', banner.onebanner() + '\n' + uglify.minify (umd.output[0].code, uglifyOption).code);
    write ('dist/bundle.common.js', common.output[0].code);
    write ('dist/bundle.common.min.js', banner.onebanner() + '\n' + uglify.minify (common.output[0].code, uglifyOption).code);
    write ('dist/bundle.esm.js', es.output[0].code);
}

function write (dest, code, zip) {
    return new Promise ( (resolve, reject) => {
        function report (extra) { 
            console.log ( `${path.relative (process.cwd (), dest)} ${getSize(code) + (extra || '')}` )  
            resolve();
        }

        if (!fs.existsSync (path.dirname (dest))) {
            fs.mkdirSync (path.dirname (dest));
        }

        fs.writeFile (dest, code, err => {
            if (err) { return reject (err); }
            if (zip) { 
                zlib.gzip (code, (_err, zipped) => {
                    if (_err) { return reject (_err); }
                    report (`(gzipped: ${getSize (zipped)})`);     
                });
            } else { report (); }
        });
    });
}

function getSize (code) {
    if (code) { return `${(code.toString().length / 1024).toFixed(2)}kb` }
    return '';
}

build ();