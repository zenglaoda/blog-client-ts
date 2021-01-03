const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/*
    namedChunksPlugin:
        即使使用了NamedChunksPlugin, 一个chunk的改动还是会影响其它chunk，主要还是moduleIds里面包含了
        空字符串，空字符串有时在moduleIds数组的前面有时跑到后面

    runtimeChunk:
        namedChunksPlugin 根据每个chunk里面依赖的所有模块id，生成一个hash,用以命名文件前部分(后部分是contenthash)
        这样只有当chunk依赖的模块id发生改变(如:模块id的增加，删除)或者内容发生改变，才会生成一个新的文件名
        optimization.runtimeChunk 用于将chunk list列表抽取出来，此时Chunk B发生改变，只要Chunk A里面引用的Chunk B
        里面的模块名没发生改变那么， ChunkA就不会应为Chunk B的改变而改变


    hashedModulesIdsPlugin:
        存在的问题,hashedModulesIdsPlugin默认使用base64编码模块id，base64有可能产生"/"字符
        导致webpack生成文件时，会生成一个额外的路径，hash-sum是否也会生成这样的问题

*/


function resolvePath(url) {
    return path.resolve(__dirname, '../', url);
}

function getNamedChunks() {
    const hash = require("hash-sum");
    const chunkHashSet = new Set();
    const nameLength = 4;
    return function namedChunks(chunk) {
        if (chunk.name) {
            return chunk.name;
        }
        const modules = Array.from(chunk.modulesIterable);
        if (modules.length < 2) {
            return modules[0].id;
        }
        
        const joinedHash = hash(modules.map(m => m.id).join("_"));
        let len = nameLength;
        while (chunkHashSet.has(joinedHash.substr(0, len))) len++;
        chunkHashSet.add(joinedHash.substr(0, len));
        return `chunk-${joinedHash.substr(0, len)}`;
    }
}

const loadCSS = [
    {
        loader: MiniCssExtractPlugin.loader,
    },
    'css-loader',
    'postcss-loader'
];

const webpackConfig = {
    target: 'web',
    mode: 'production',
    devtool: 'source-map', // hidden-source-map

    entry: {
        app: resolvePath('src/app.js'),
    },
    output: {
        path: resolvePath('dist/'),
        publicPath: '/',
        filename: 'js/[name].[contentHash:8].js',
        chunkFilename: 'js/chunk/[name].[contentHash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'font/[contenthash:8].[ext]',
                },
            },
            {
                test: /\.(jpe?g|png)$/,
                loader: 'url-loader',
                options: {
                    limit: 8912,
                    name: 'img/[contenthash:8].[ext]',
                },
            },
            {
                test: /\.css$/,
                use: loadCSS,
            },
            {
                test: /\.less$/,
                use: [
                    ...loadCSS,
                    {
                        loader: 'less-loader',
                        options: { javascriptEnabled: true }
                    }
                ],
            },
            {
                test: /\.(js|ts|tsx)$/,
                include: resolvePath('src'),
                loader: 'babel-loader',
            },
        ]
    },
    resolve: {
        extensions: [
            '.js',
        ],
        alias: {
            '@': resolvePath('src')
        },
    },
    plugins: [
        new CleanWebpackPlugin(),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolvePath('static'),
                    to: resolvePath('dist')
                }
            ]
        }),

        new HtmlWebpackPlugin({
            title: 'blog-admin',
            filename: 'index.html',
            template: resolvePath('index.html'),
            inject: true,
        }),

        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:].css',
            chunkFilename: 'css/[name].[contenthash:].css'
        }),

        new Webpack.NamedChunksPlugin(getNamedChunks()),

        new Webpack.HashedModuleIdsPlugin()

        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial'   // 将页面初始加载中引入的node_modules模块进行拆分
                },
                antdUI: {
                    name: 'chunk-antdUI',
                    priority: 20, 
                    test: /[\\/]node_modules[\\/](antd|@ant-design)/ 
                }
            }
        },
        runtimeChunk: 'single',
        minimize: false,
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin()
        ]
    }
};

module.exports = webpackConfig;