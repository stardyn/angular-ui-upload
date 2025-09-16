const path = require('path');
const webpack = require('webpack');

// Read package.json version dynamically
const packageJson = require('./package.json');

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const buildMode = process.env.STRDYN_BUILD_MODE || (isProduction ? 'live' : 'dev');

console.log(`Build Configuration:
  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}
  STRDYN_BUILD_MODE: ${buildMode}
  Production: ${isProduction}
  Package: ${packageJson.name}
  Version: ${packageJson.version}`);

module.exports = {
    mode: isProduction ? 'production' : 'development',

    entry: './src/main.ts',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'core.js',
        library: {
            name: 'StardynAngularUIUpload',
            type: 'umd'
        },
        globalObject: 'this',
        clean: {
            keep: /\.d\.ts$/,  // Keep .d.ts files
        }
    },

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.app.json',
                        transpileOnly: true
                    }
                },
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            '__VERSION__': JSON.stringify(packageJson.version),
            '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
            '__BUILD_ENV__': JSON.stringify(buildMode === 'live' ? 'live' : 'dev'),
            '__STRDYN_BUILD_MODE__': JSON.stringify(buildMode),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),

        new webpack.BannerPlugin({
            banner: `@stardyn/angular-ui-upload v${packageJson.version}
Built: ${new Date().toISOString()}
Environment: ${buildMode}
© Stardyn Team - MIT License`,
            entryOnly: true
        })
    ],

    externals: {
        '@angular/core': {
            commonjs: '@angular/core',
            commonjs2: '@angular/core',
            amd: '@angular/core',
            root: 'ng.core'
        },
        '@angular/common': {
            commonjs: '@angular/common',
            commonjs2: '@angular/common',
            amd: '@angular/common',
            root: 'ng.common'
        },
        'fine-uploader': {
            commonjs: 'fine-uploader',
            commonjs2: 'fine-uploader',
            amd: 'fine-uploader',
            root: 'qq'
        },
        'fine-uploader/lib/core': {
            commonjs: 'fine-uploader/lib/core',
            commonjs2: 'fine-uploader/lib/core',
            amd: 'fine-uploader/lib/core',
            root: 'qq'
        }
    },

    optimization: {
        minimize: isProduction,
        usedExports: true,
        sideEffects: false,

        // Production-only optimizations
        ...(isProduction && {
            splitChunks: false, // Keep everything in one bundle
            concatenateModules: true,
            providedExports: true,
            mangleExports: 'size',
            // Add aggressive minification
            minimizer: [
                new (require('terser-webpack-plugin'))({
                    terserOptions: {
                        compress: {
                            drop_console: false,
                            drop_debugger: true,
                            pure_funcs: [],
                            unused: true,
                            dead_code: true
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            comments: false
                        }
                    },
                    extractComments: false
                })
            ]
        })
    },

    devtool: isProduction ? false : 'source-map',

    performance: {
        hints: isProduction ? 'warning' : false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};