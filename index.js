const fs = require('fs');

function generateDoc(data, outputPath = './dist/api-docs.md') {
    // 创建Markdown头部
    let mdContent = `# API Documentation\n\n`;
    mdContent += `> 自动生成时间：${new Date().toLocaleDateString()}\n\n`;

    // 遍历数据结构
    data.forEach((item, index) => {
        // 函数/接口标题
        mdContent += `## ${item.name.name}\n`;
        mdContent += `${item.name.description || '暂无描述'}\n\n`;

        // 参数表格
        if (item.params && item.params.length > 0) {
            mdContent += `### 参数列表\n`;
            mdContent += `| 参数名 | 类型 | 描述 |\n`;
            mdContent += `|--------|------|------|\n`;
            item.params.forEach(param => {
                mdContent += `| ${param.name} | \`${param.type}\` | ${param.description || '-'} |\n`;
            });
            mdContent += '\n';
        }

        // 返回值
        mdContent += `### 返回值\n`;
        mdContent += `- 类型：\`${item.return.type}\`\n`;
        mdContent += `- 描述：${item.return.description || '无返回说明'}\n\n`;

        // 代码示例
        if (item.example) {
            mdContent += `### 代码示例\n\`\`\`javascript\n${item.example}\n\`\`\`\n\n`;
        }
    });

    // 写入文件
    fs.writeFileSync(outputPath, mdContent);
    console.log(`文档已生成：${outputPath}`);
}

function checkPath(path, regx) {
    if (typeof regx === 'string') {
        return path.includes(regx);
    } else if (regx instanceof RegExp) {
        return regx.test(path);
    } else {
        return false;
    }
}


class MarkdownJsdocWebpackPlugin {
    constructor(options = {}) {
        // 参数校验（新增）
        if (!(options !== null && typeof options === 'object' && !Array.isArray(options))) throw new Error('options must be an object');
        this.options = {
            outputPath: options.outputPath || './dist/api-docs.md',
            exclude: options.exclude || ['node_modules'],
            include: options.include || [],
        };
        this.results = [];
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('MarkdownJsdocWebpackPlugin', (compilation) => {
            compilation.hooks.finishModules.tap('MarkdownJsdocWebpackPlugin', (modules) => {
                modules.forEach(module => {
                    const fileResource = module.resource;
                    const isExcluded = this.options.exclude.some(pattern => checkPath(fileResource, pattern));
                    const isIncluded = this.options.include.length === 0 || this.options.include.some(pattern => checkPath(fileResource, pattern));
                    if (isExcluded || !isIncluded) return

                    const code = module._source?.source() || '';

                    const defineJsRegex = /\/\*\*(\s*[\r\n\*]+\s*@README(?:[^*\/]|(?:\*(?!\/)|(?<!\/)\*)|(?:\/(?!\*)))*?)\*\/\s*[\r\n]+\s*(const|let|var|function|class)\s+([^\s=()]+)/g;
                    const exportJsRegex = /\/\*\*(\s*[\r\n\*]+\s*@README(?:[^*\/]|(?:\*(?!\/)|(?<!\/)\*)|(?:\/(?!\*)))*?)\*\/\s*[\r\n]+\s*(?:export|export\s+default|export\s+async|export\s+default\s+async)\s+(const|let|var|function|class)\s+([^\s=()]+)/g;
                    const objectJsRegex = /\/\*\*(\s*[\r\n\*]+\s*@README(?:[^*\/]|(?:\*(?!\/)|(?<!\/)\*)|(?:\/(?!\*)))*?)\*\/\s*[\r\n]+\s*([a-zA-Z_$][\w$]*)\s*(?::\s*function\s*\(|\()/g;
                    const paramRegex = /@param\s*{\s*(\w+)\s*}\s*(\w+)\s*(.*)/g;
                    const nameRegex = /@name\s*(\w+)\s*(.*)/;
                    const returnRegex = /@return\s*{\s*(\w+)\s*}\s*(.*)/;
                    const exampleRegex = /@example\s*(.*)/;

                    const matches = [...code.matchAll(defineJsRegex), ...code.matchAll(exportJsRegex), ...[...code.matchAll(objectJsRegex)].map(match => [match[0], match[1], 'function', match[2]])];

                    for (const match of matches) {
                        const [_, commentBlock, varType, defaultName] = match;
                        let result = {}

                        // 提取名称
                        const nameMatch = commentBlock.match(nameRegex);
                        result.name = { name: nameMatch ? nameMatch[1] : defaultName, description: nameMatch ? nameMatch[2] : "" }

                        // 提取参数
                        let paramMatch;
                        while ((paramMatch = paramRegex.exec(commentBlock)) !== null) {
                            if (result.params === undefined) result.params = [];

                            result.params.push({
                                type: paramMatch[1],
                                name: paramMatch[2],
                                description: paramMatch[3],
                            });
                        }

                        // 提取返回值
                        const returnMatch = commentBlock.match(returnRegex);
                        result.return = { type: returnMatch ? returnMatch[1] : "void", description: returnMatch ? returnMatch[2] : "" }

                        // 示例代码
                        const exampleMatch = commentBlock.match(exampleRegex);
                        if (exampleMatch) {
                            result.example = exampleMatch[1];
                        }
                        this.results.push(result);
                    }
                });
            });
        });

        compiler.hooks.emit.tapAsync('MarkdownJsdocWebpackPlugin', (compilation, callback) => {
            generateDoc(this.results, this.options.outputPath);
            callback();
        });
    }
}

module.exports = MarkdownJsdocWebpackPlugin;