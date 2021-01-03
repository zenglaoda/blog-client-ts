const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 解析路径
function resolvePath(url) {
    return path.resolve(__dirname, '../', url);
}

// 加载并处理css文件
const loadCSS = [
    'style-loader',
    'css-loader',
    'postcss-loader',
];

// 配置
const webpackConfig = {
    target: 'web',
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',

    entry: {
        app: resolvePath('src/app.js'),
    },
    output: {
        path: resolvePath('dist/'),
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename:'js/chunk/[name].[id].js'
    },
    module: {
        rules: [
            // 字体
            {
                test: /\.(ttf|eot|woff2?)$/,
                loader: 'file-loader',
                options: {
                    name: 'font/[name].[ext]',
                },
            },
            // 图片转base 64
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 8912,
                    name: 'img/[name].[ext]',
                    fallback: 'file-loader'
                },
            },
            // css
            {
                test: /\.css$/,
                use: loadCSS,
            },
            // less
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
            // js
            {
                test: /\.(js|ts|tsx)$/,
                include: [
                    resolvePath('src')
                ],
                use: [
                    {
                        loader: 'babel-loader',
                    }
                ],
            },
        ]
    },
    plugins: [
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
        
        // 热更新插件
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: [
            '.js',
            '.ts',
            '.tsx',
        ],
        alias: {
            '@': resolvePath('src')
        },
    },
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        hot: true,
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: '/' },
            ]
        },
        // publicPath: '/',
        // contentBase: resolvePath('src'),
        // contentBase: resolvePath('dist')
    },
};

module.exports = webpackConfig;