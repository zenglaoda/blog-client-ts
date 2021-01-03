const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function generatorReport(config) {
    // 删除webpack-dev-server服务
    if (config.devServer) delete config.devServer;
    
    // 开启bundle分析报告服务
    config.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: '8081',
            defaultSizes: 'stat',
        }),
    );    
}