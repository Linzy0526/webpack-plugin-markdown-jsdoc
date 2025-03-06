# webpack-plugin-markdown-jsdoc 

> 基于 JSDoc 注释自动生成 Markdown 格式 API 文档的 Webpack 插件，支持函数/对象的多维度文档生成，完美适配现代前端工程化流程

## ✨ 功能特性
1. ​**智能注释解析**​  
  通过 @README 标记自动识别文档块，支持： 
    - 参数类型声明 @param {type}
    - 返回值说明 @return {type}
    - 代码示例嵌入 @example
    - 自定义名称描述 @name
2. ​**零配置开箱即用**​  
   默认自动扫描 .js 文件，排除 node_modules 目录，输出标准化文档结构
3. ​**灵活过滤机制**​  
    ```javascript
    // 支持正则表达式和字符串匹配
    include: ['src'],
    exclude: ['node_modules']
    ```
4. ​**​工程化深度集成**​  
   在 Webpack 构建流程的 transform 阶段解析代码，writeBundle 阶段生成最终文档


## 配置示例

#### 配置参数
| 参数        | 类型               | 默认值               | 说明                          |
|------------|--------------------|----------------------|-------------------------------|
| outputPath | string             | `./dist/api-docs.md` | 文档输出路径                  |
| exclude    | Array<string/RegExp> | `['node_modules']`  | 排除目录/文件的正则匹配规则   |
| include    | Array<string/RegExp> | `[]`                 | 包含目录/文件的正则匹配规则   |

#### 配置示例
```javascript
// webpack.config.js
const MarkdownJsdocPlugin = require('webpack-plugin-markdown-jsdoc');
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
```


## 🧩 使用方法
#### 代码注释规范
```javascript
// index.js
/**
 * @README
 * @name fetchData 核心数据获取方法
 * @param {string} url API地址
 * @param {Object} config 请求配置
 * @return {Promise} 携带数据的Promise对象
 * @example fetchData('/api/user', { timeout: 5000 })
 */
export function fetchData(url, config) {
  // ...实现代码
}
```

#### 输出文档示例
```markdown
## fetchData
核心数据获取方法

### 参数列表
| 参数名 | 类型    | 描述       |
|--------|---------|------------|
| url    | `string` | API地址    |
| config | `Object` | 请求配置   |

### 返回值
- 类型：`Promise`
- 描述：携带数据的Promise对象

### 代码示例
```javascript
fetchData('/api/user', { timeout: 5000 })
```
