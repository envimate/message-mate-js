import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

const env = process.env.NODE_ENV;
const config = {
    input: 'src/index.js',
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        resolve({
            preferBuiltins: false,
        }),
    ],
    external:['react'],
};

if (env === 'es') {
    config.output = {...config.output, format: 'es', name: 'message-mate-js', indent: false, file: 'es/message-mate-js.js'};
}

if (env === 'cjs') {
    config.output = {...config.output, format: 'cjs', name: 'message-mate-js', indent: false, file: 'lib/message-mate-js.js'};
}
/*
if (env === 'umd') {
    config.output = {...config.output, format: 'umd', name: 'message-mate-js', indent: false, file: 'dist/message-mate-js.umd.js'}
}

if (env === 'umd-min') {
    config.output = {...config.output, format: 'umd', name: 'message-mate-js', indent: false, file: 'dist/message-mate-js.umd.min.js'};
    /*config.plugins.push(
        uglify({
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            }
        })
    )
}*/

export default config