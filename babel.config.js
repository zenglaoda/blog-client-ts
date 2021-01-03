const production = {
    presets: [
        [
            '@babel/preset-typescript'
        ],
        [
            '@babel/preset-react',
        ],
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                modules: 'false',
            }
        ],
    ],
    plugins: [
        [
            'babel-plugin-import',
            {
                "libraryName": "antd",
                "libraryDirectory": "es",
                "style": true
            },
        ],
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true
            }
        ],
        // 体验类样式语法
        [
            '@babel/plugin-proposal-class-properties', 
        ],
        // 转换import()函数
        [
            '@babel/plugin-syntax-dynamic-import'
        ],
        // 将辅助函数合并到一个文件中
        [
            "@babel/plugin-transform-runtime",
        ],
    ],
};

const development = {
    presets: [
        [
            '@babel/preset-typescript'
        ],
        [
            '@babel/preset-react',
        ],
    ],
    plugins: [
        // 按需加载组件和样式，通过按需加载的组件js，自动加载对应的样式
        [
            'babel-plugin-import',
            {
                "libraryName": "antd",
                "libraryDirectory": "es",   // default: lib
                "style": true // 使用less样式
            },
        ],
        // 转换修饰器
        [
            '@babel/plugin-proposal-decorators',
            { legacy: true }
        ],
        // 体验类样式语法
        [
            '@babel/plugin-proposal-class-properties', 
        ],
        // 转换import()函数
        [
            '@babel/plugin-syntax-dynamic-import'
        ],
    ],
};
module.exports = process.env.NODE_ENV === 'development' ? development : production;

/*
presets：
    preset-env预设只包含了转换已经纳入ECMAScripti规范的插件，
    但是修饰器还未纳入规范，故preset-env预设中没有转换修饰器的插件

    @babel/preset-typescript
        如何使用babel-loader与babel/preset-typescript替换ts-loader


plugins: babel官方插件，预设可以省略@babel前缀，后者加上该前缀，非官方的
    必须严格书写。

    babel-plugin-react-require:
        判断文件中是否需要自动添加引入react-dom文件的声明

    babel-plugin-import:
        按需引入文件，对import声明进行转化为更详细的引入，达到按需引入
        的目的，用于antd库时可以做到根据引入的组件自动引入相应的less或css

    babel-plugin-component:
        按需引入文件，对import声明进行转化为更详细的引入，达到按需引入
        的目的，用于element-ui库时可以做到根据引入的组件自动引入相应的less或css

    babel-plugin-react-css-modules:
        react-css-modules的替代产品    

    babel-plugin-dynamic-import-webpack:
        转换动态导入函数import()。webpack自身内置import()函数,
        执行该函数之后返回一个promise, 但是当使用babel-loader去转换
        使用了import函数的js文件时，由于babel-loader不认识该import函数，
        故babel-loader转换js失败，此时需要该插件去处理该函数.

    babel-plugin-proposal-decorators:
        转换修饰器

    babel-plugin-transform-runtime:
        在转换 ES2015 语法为 ECMAScript 5 的语法时，babel 会需要一些辅
        助函数，例如 _extend。babel 默认会将这些辅助函数内联到每一个
        js 文件里，这样文件多的时候，项目就会很大。
        所以 babel 提供了 transform-runtime 来将这些辅助函数“搬”到一
        个单独的模块 babel-runtime 中，这样做能减小项目文件的大小
        https://www.jianshu.com/p/7bc7b0fadfc2
        https://www.jianshu.com/p/cbd48919a0cc

    babel-plugin-transform-react-jsx:
        解析jsx语法，通过调用React.createElement函数转化jsx语法

    babel-plugin-transform-react-remove-prop-types：
        删除react的类型校验属性,propTypes，因为该库的校验只会在开发
        环境下执行，生产环境并不会校验，所以可以考虑在生产环境时删除
        这些校验。

    transform-react-jsx-source
        映射jsx文件源码，这易于在开发环境调试，但是在生产环境应该关闭

    eslint-plugin-react-hooks:
        hook书写规则校验

    babel-plugin-webpack-alias:
        解决babel编译使用了resolve.alias别名路径时导致解析失败的问题，  
        https://www.npmjs.com/package/babel-plugin-webpack-alias

        
*/