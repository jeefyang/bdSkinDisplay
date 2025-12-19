const JSZip = require('./jszip.min.js')
const fs = require('fs');
const path = require('path');

async function zipFolder(sourceDir, outputZipPath) {
    const zip = new JSZip();

    // 递归添加文件（目录由路径自动创建，不手动 folder()）
    function addFilesRecursively(currentDir) {
        const entries = fs.readdirSync(currentDir);

        for (const entry of entries) {
            // 可选：跳过隐藏文件和目录
            if (entry.startsWith('.')) continue;

            const fullPath = path.join(currentDir, entry);
            const stats = fs.statSync(fullPath);

            if (stats.isFile()) {
                const data = fs.readFileSync(fullPath);
                // 计算相对路径并统一使用 /
                let relativePath = path.relative(sourceDir, fullPath);
                relativePath = relativePath.replace(/\\/g, '/');

                zip.file(relativePath, data);
                console.log(`添加: ${relativePath}`);
            } else if (stats.isDirectory()) {
                addFilesRecursively(fullPath);
            }
        }
    }

    addFilesRecursively(sourceDir);

    // 生成 zip 内容
    const content = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
    });

    // ============ 输出文件存在时自动加序号 ============
    let finalOutputPath = outputZipPath;
    let counter = 1;

    const dir = path.dirname(outputZipPath);
    const ext = path.extname(outputZipPath);
    const baseName = path.basename(outputZipPath, ext);

    while (fs.existsSync(finalOutputPath)) {
        finalOutputPath = path.join(dir, `${baseName} (${counter})${ext}`);
        counter++;
    }

    // 写入文件
    fs.writeFileSync(finalOutputPath, content);

    if (finalOutputPath !== outputZipPath) {
        console.log(`\n输出文件已存在，自动重命名并保存为：${finalOutputPath}`);
    } else {
        console.log(`\n压缩完成：${finalOutputPath}`);
    }
}

// 参数处理
if (process.argv.length < 4) {
    console.error('用法: node zip-folder.js <源文件夹路径> <输出文件路径（支持任意后缀，如 .zip .cbz）>');
    process.exit(1);
}

const sourceDir = path.resolve(process.argv[2]);
let outputPath = path.resolve(process.argv[3]);

if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    console.error('错误：源路径不是一个有效的文件夹');
    process.exit(1);
}

// 如果输出路径没有后缀，自动添加 .zip
if (!path.extname(outputPath)) {
    outputPath += '.zip';
    console.log(`输出路径无后缀，自动添加 .zip → ${outputPath}`);
}

zipFolder(sourceDir, outputPath).catch(err => {
    console.error('压缩失败：', err.stack);
});