const JSZip = require('./jszip.min.js')
const fs = require('fs');
const path = require('path');

async function zipFolder(sourceDir, outputZipPath) {
    const zip = new JSZip();

    // 递归添加文件到 zip
    function addFilesToZip(dirPath, zipFolder) {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            const stats = fs.statSync(fullPath);

            if (stats.isFile()) {
                const fileData = fs.readFileSync(fullPath);
                const relativePath = path.relative(sourceDir, fullPath).replace(/\\/g, '/'); // 使用 / 作为 zip 内路径分隔符
                zipFolder.file(relativePath, fileData);
            } else if (stats.isDirectory()) {
                const subFolder = zipFolder.folder(file);
                addFilesToZip(fullPath, subFolder);
            }
        }
    }

    // 从源文件夹根开始添加（不包含源文件夹本身作为根目录）
    addFilesToZip(sourceDir, zip);

    // 生成 zip 文件（使用 nodebuffer 类型适合 Node.js）
    const content = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',         // 压缩方式
        compressionOptions: {
            level: 9                       // 压缩级别 1-9，9 为最高压缩
        }
    });

    // 写入输出文件
    fs.writeFileSync(outputZipPath, content);
    console.log(`压缩完成：${outputZipPath}`);
}

// 从命令行参数获取路径
if (process.argv.length < 4) {
    console.error('用法: node compareBDS.js <源文件夹路径> <输出zip路径>');
    process.exit(1);
}

const sourceDir = path.resolve(process.argv[2]);
const outputZip = path.resolve(process.argv[3]);

if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    console.error('错误：源路径不是一个有效的文件夹');
    process.exit(1);
}

zipFolder(sourceDir, outputZip).catch(err => {
    console.error('压缩失败：', err);
});