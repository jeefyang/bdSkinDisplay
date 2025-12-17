
/** ini转json */
function iniToJson(data: string) {
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value: any = {};
    var lines = data.split(/\r\n|\r|\n/);
    var section: string = null;
    lines.forEach(function (line) {
        if (!line) {
            return;
        }
        else if (regex.comment.test(line)) {
            return;
        } else if (regex.param.test(line)) {
            var match = line.match(regex.param);
            if (section) {
                value[section][match[1]] = match[2];
            } else {
                value[match[1]] = match[2];
            }
        } else if (regex.section.test(line)) {
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        } else if (line.length == 0 && section) {
            section = null;
        };
    });
    return value;
}

/** json转ini */
function jsonToIni(data: any) {
    let str = "";
    for (let key1 in data) {
        str += `[${key1}]\n`;
        let c = data[key1];
        for (let key2 in c) {
            str += `${key2}=${c[key2] || ""}\n`;
        }
        str += '\n';
    }
    return str;
}

/** 获取ini文件数据 */
async function getIniFileData(url: string) {
    let str = await fetch(url).then(res => res.text());
    let val = iniToJson(str);
    return val;
}

async function getImageDataB64(url: string): Promise<{ b64: string, w: number, h: number; }> {
    return new Promise((res, rej) => {
        let img = new Image();
        img.src = url;
        let canvas = document.createElement("canvas");
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let b64 = canvas.toDataURL("png");
            res({ b64, w: img.width, h: img.height });
        };
    });
}

async function getTilImageB64(b64: string, x: number, y: number, w: number, h: number): Promise<string> {

    return new Promise((res, rej) => {
        let img = new Image();
        let canvas = document.createElement("canvas");
        img.onload = () => {
            canvas.width = w;
            canvas.height = h;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
            let newB64 = canvas.toDataURL("png");
            canvas.remove();
            res(newB64);
            // document.body.append(canvas)
        };
        img.src = b64;
    });
}

/** 保存json */
function saveJson(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
}

/** 读取json */
function loadJson(key: string) {
    let str = localStorage.getItem(key);
    if (!str) {
        return;
    }
    return JSON.parse(str);
}

/**
    * 保存文本文件
    * @param text 文本内容
    * @param fileName 保存的文件名
    */
function saveStrFile(text: string, fileName: string) {
    var blob = new Blob([text]);
    saveBlobFile(blob, fileName);
}

function copyStr(text: string) {
    navigator.clipboard.writeText(text);
}

/**
   * 保存二进制文件
   * @param blob 二进制内容
   * @param fileName 保存的文件名
   */
function saveBlobFile(blob: Blob, fileName: string) {
    saveBase64File(window.URL.createObjectURL(blob), fileName);
}

/**
   * 保存base64文件
   * @param base64 base64字符串内容
   * @param fileName 保存的文件名
   */
function saveBase64File(base64: string, fileName: string) {
    let a = document.createElement("a");
    a.href = base64;
    a.download = fileName;
    a.click();
}