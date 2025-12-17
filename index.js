class JAction {
    /** 设置手机尺寸 */
    setPhoneDivSize(w, h, scale) {
        !w && (w = this.op.phoneWidth);
        !h && (h = this.op.phoneHeight);
        !scale && (scale = this.op.phoneScale);
        this.phoneDiv.style.width = w + "px";
        this.phoneDiv.style.height = h + "px";
        this.cmdDiv.style.height = (h * scale) + "px";
        //@ts-ignore
        this.phoneDiv.style.zoom = scale.toString();
        this.op.phoneWidth = w;
        this.op.phoneHeight = h;
        this.op.phoneScale = scale;
    }
    /** 设置手机移动 */
    setMoveDivPos(x, y) {
        !x && (x = this.op.phoneWidth);
        !y && (y = this.op.phoneHeight);
        this.moveDiv.style.left = (x * this.op.phoneScale) + 'px';
        this.moveDiv.style.top = (y * this.op.phoneScale) + 'px';
    }
    /** 设置移动事件 */
    setMoveDivEvent() {
        let isDown = 0;
        let x = 0;
        let y = 0;
        this.moveDiv.onmousedown = (e) => {
            isDown = -1;
        };
        document.addEventListener("mousemove", (e) => {
            if (!isDown) {
                return;
            }
            if (isDown == -1) {
                x = e.clientX;
                y = e.clientY;
                isDown = 1;
            }
            this.op.phoneWidth += (e.clientX - x) / this.op.phoneScale;
            this.op.phoneHeight += (e.clientY - y) / this.op.phoneScale;
            x = e.clientX;
            y = e.clientY;
            this.setMoveDivPos(this.op.phoneWidth, this.op.phoneHeight);
            this.setPhoneDivSize(this.op.phoneWidth, this.op.phoneHeight, this.op.phoneScale);
        });
        document.addEventListener("mouseup", () => {
            if (isDown == 1) {
                this.saveOPJson();
            }
            isDown = 0;
        });
    }
    async getImageData(name) {
        if (this.imageData[name]) {
            return this.imageData[name];
        }
        let pngUrl = `${this.op.dirBase}/${this.op.resDir}/${name}.png`;
        let imageData = await getImageDataB64(pngUrl);
        let tilUrl = `${this.op.dirBase}/${this.op.resDir}/${name}.til`;
        let tilData = await getIniFileData(tilUrl);
        this.imageData[name] = {
            b64: imageData.b64,
            w: imageData.w,
            h: imageData.h,
            til: tilData
        };
        return this.imageData[name];
    }
    async getImgEle(op) {
        let SOURCE_RECT = op.til.SOURCE_RECT.split(",").map(c => Number(c));
        let sRectX = SOURCE_RECT[0];
        let sRectY = SOURCE_RECT[1];
        let sRectW = SOURCE_RECT[2];
        let sRectH = SOURCE_RECT[3];
        op.w = op.w || sRectW;
        op.h = op.h || sRectH;
        let INNER_RECT_STR = op.til.INNER_RECT;
        if (op.isBack && !INNER_RECT_STR) {
            INNER_RECT_STR = op.til.SOURCE_RECT;
        }
        if (!INNER_RECT_STR) {
            let b64 = await getTilImageB64(op.imgData.b64, sRectX, sRectY, sRectW, sRectH);
            let img = document.createElement("img");
            img.src = b64;
            img.style.width = sRectW + 'px';
            img.style.height = sRectH + 'px';
            return {
                e: img, offsetX: (op.w - sRectW) / 2, offsetY: (op.h - sRectH) / 2
            };
        }
        let INNER_RECT = INNER_RECT_STR.split(",").map(c => Number(c));
        let iRectX = INNER_RECT[0];
        let iRectY = INNER_RECT[1];
        let iRectW = INNER_RECT[2];
        let iRectH = INNER_RECT[3];
        let curW = op.w - (sRectW - iRectW);
        let curH = op.h - (sRectH - iRectH);
        let div = document.createElement("div");
        let list = [
            //1
            [sRectX, sRectY, iRectX - sRectX, iRectY - sRectY,
                0, 0],
            //2
            [iRectX, sRectY, iRectW, iRectY - sRectY,
                iRectX - sRectX, 0, curW, iRectY - sRectY],
            //3
            [iRectX + iRectW, sRectY, sRectX + sRectW - iRectX - iRectW, iRectY - sRectY,
                curW + iRectX - sRectX, 0],
            //4
            [sRectX, iRectY, iRectX - sRectX, iRectH,
                0, iRectY - sRectY, 0, curH],
            //5
            [iRectX, iRectY, iRectW, iRectH,
                iRectX - sRectX, iRectY - sRectY, curW, curH],
            //6
            [iRectX + iRectW, iRectY, sRectX + sRectW - iRectX - iRectW, iRectH,
                curW + iRectX - sRectX, iRectY - sRectY, 0, curH],
            //7
            [sRectX, iRectY + iRectH, iRectX - sRectX, sRectY + sRectH - iRectY - iRectH,
                0, iRectY - sRectY + curH],
            //8
            [iRectX, iRectY + iRectH, iRectW, sRectY + sRectH - iRectY - iRectH,
                iRectX - sRectX, iRectY - sRectY + curH, curW, 0],
            //9
            [iRectX + iRectW, iRectY + iRectH, sRectX + sRectW - iRectX - iRectW, sRectY + sRectH - iRectY - iRectH,
                curW + iRectX - sRectX, iRectY - sRectY + curH]
        ];
        for (let i = 0; i < list.length; i++) {
            let c = list[i];
            let capX = c[0];
            let capY = c[1];
            let capW = c[2];
            let capH = c[3];
            let imgX = c[4];
            let imgY = c[5];
            let imgW = c[6] || capW;
            let imgH = c[7] || capH;
            let b64 = await getTilImageB64(op.imgData.b64, capX, capY, capW, capH);
            let img = document.createElement('img');
            img.src = b64;
            img.style.position = "absolute";
            img.style.left = imgX + 'px';
            img.style.top = imgY + 'px';
            img.style.width = imgW + 'px';
            img.style.height = imgH + 'px';
            img.setAttribute("class", `img${i + 1}`);
            div.append(img);
        }
        div.style.width = op.w + 'px';
        div.style.height = op.h + 'px';
        return { e: div, offsetX: 0, offsetY: 0 };
    }
    getPEle(op) {
        let box = document.createElement("div");
        box.style.display = "table";
        box.style.position = "absolute";
        box.style.left = '0px';
        box.style.top = "0px";
        box.style.width = op.viewW + 'px';
        box.style.height = op.viewH + 'px';
        let p = document.createElement("div");
        p.innerHTML = op.show;
        // p.style.position = "absolute"
        op.color && (p.style.color = "#" + op.color);
        op.fontSize && (p.style.fontSize = op.fontSize + 'px');
        p.style.transform = `translate(${op.pos[0]}px,${op.pos[1]}px)`;
        p.style.display = "table-cell";
        p.style.textAlign = "center";
        p.style.verticalAlign = "middle";
        box.append(p);
        return box;
    }
    async checkCss() {
        for (let key in this.cssData) {
            let css = this.cssData[key];
            let imgTagList = [css.NM_IMG, css.HL_IMG];
            for (let i = 0; i < imgTagList.length; i++) {
                if (!imgTagList[i]) {
                    continue;
                }
                let nm = imgTagList[i].split(',');
                let imageData = await this.getImageData(nm[0]);
                let imgName = `IMG${nm[1]}`;
                let imgTil = imageData.til[imgName];
                if (!imgTil) {
                    console.log(key);
                    console.log(css);
                }
            }
        }
    }
    /** 保存配置json */
    saveOPJson() {
        saveJson(this.phoneOPKey, this.op);
    }
    /** 读取配置json */
    loadOPJson() {
        return loadJson(this.phoneOPKey);
    }
    /** 触发键盘key的事件 */
    dispatchKeyEvent(op) {
        if (this.op.opSwitchKey == "key") {
            this.op.selectSingleKey = op.key;
            this.op.selectSingleType = op.type;
            for (let key in this.keyDomList) {
                this.setKeySelectHL(key, this.keyDomList[key].handlerDom);
            }
            this.saveOPJson();
            this.initCmdDiv();
        }
        if (this.op.opSwitchKey == "multiKey" && op.type == "key") {
            let index = this.op.selectMultiKeyList.findIndex(c => c == op.key);
            if (index != -1) {
                this.op.selectMultiKeyList.splice(index, 1);
            }
            else {
                this.op.selectMultiKeyList.push(op.key);
            }
            for (let key in this.keyDomList) {
                this.setKeySelectHL(key, this.keyDomList[key].handlerDom);
            }
            this.saveOPJson();
            this.initCmdDiv();
        }
    }
    /** 刷新皮肤 */
    async reFreshPhoneSkin() {
        this.phoneCandDiv.innerHTML = "";
        this.phoneBoardDiv.innerHTML = "";
        await this.initLoadData();
        await this.decodeBoard();
    }
    /** 设置多选高亮 */
    setKeySelectHL(keyName, handlerDiv) {
        if ((this.op.opSwitchKey == "multiKey" && this.op.selectMultiKeyList.includes(keyName)) ||
            (this.op.opSwitchKey == "key" && this.op.selectSingleKey == keyName)) {
            handlerDiv.style.border = `2px solid ${this.op.selecthlKeyColor}`;
        }
        else {
            handlerDiv.style.border = "";
        }
    }
    getNewNum(prevKey, baseData, count = 1) {
        let name = prevKey + count;
        while (baseData[name]) {
            count++;
            name = prevKey + count;
        }
        return name;
    }
    createNewBoardKey() {
    }
}
class JBoardChildDom {
    /** 创建列表模式下元素 */
    createBoardListDom() {
        this.phoneCmdDiv.innerHTML = "";
        let type = "LIST";
        if (!this.boardData[type]) {
            return;
        }
        let title = document.createElement("h3");
        title.innerHTML = "列表数据";
        title.style.textAlign = "center";
        this.phoneCmdDiv.append(title);
        let inputList = [
            { key: "BACK_STYLE", title: "列表背景边框样式:", tip: "只能一个", type: "style" },
            { key: "CELL_STYLE", title: "列表单元格样式:", tip: "", type: "style" },
            { key: "FORE_STYLE", title: "列表内文字显示样式:", tip: "", type: "style" },
            { key: "SCROLL_STYLE", title: "滚动条需要的混合颜色样式:", tip: "", type: "style" },
            { key: "CELL_SIZE", title: "单元格的宽和高:", tip: "" },
            {
                key: "POS", title: "列表起始位置 X,Y:", tip: `POS=2,2\n在 PANAL 面板的（2,2）处绘制\nLIST`
            },
            {
                key: "TYPE", title: "列表类型", type: "select", select: [
                    { name: "标准类型,处于面板内,永久显示", value: "0" },
                    { name: "处于面板内,有列表项时显示", value: "1" },
                    { name: "处于面板上方,始终显示", value: "2" },
                    { name: "处于面板上方,有列表项时显示", value: "3" }
                ]
            },
            { key: "LIST_NUM", title: "指定列表显示的单元格数:", tip: `LIST_NUM=5\n此数目表示显示的单元格数,如果列\n表项很多,需要滚动显示.` },
            {
                key: "LIST_ORDER", title: "排列:", type: "select", select: [
                    { name: "竖排", value: "0" },
                    { name: "横排", value: "1" }
                ]
            },
            { key: "NAMES", title: "列表中需要显示的内容:", tip: `每个单元格间用半角空格隔开\nNAMES=, . 全选 « »\n仅供显示,实际输出行为由 VALUE 决定` },
            {
                key: "VALUES", title: "列表内容按下后的对应行为:", tip: `每个单元格间用半角空格隔开\nVALUES=, . F47 F51 F52\n不仅支持符号,也支持功能.当加特
殊功能后,LIST 将不再允许添加列表项（新版）`
            },
            { key: "PADDING", title: "单元格距离列表边框的间距", tip: "4 个值分别表示左边距,上边距,右边距,下边距\nPADDING=2,2,2,4\n此参数可以使 LIST 与面板中按键对齐,达到预定效果" },
            {
                key: "SCROLL_SIDE", title: "滚动条安放位置:", type: "select", select: [
                    { name: "默认,对应向内", value: "0" },
                    { name: "对应向外", value: "1" }
                ]
            }
        ];
        for (let i = 0; i < inputList.length; i++) {
            let div = this.createChildDom({ data: inputList[i], baseData: this.boardData, saveUrl: this.boardUrl, type: type });
            if (!div) {
                continue;
            }
            this.phoneCmdDiv.append(div, document.createElement('br'));
        }
    }
    /** 创建单键模式下按键元素 */
    createBoardSingleKeyDom() {
        this.phoneCmdDiv.innerHTML = "";
        let title = document.createElement("h3");
        title.innerHTML = `单键数据\n${this.op.selectSingleKey}`;
        title.style.textAlign = "center";
        this.phoneCmdDiv.append(title);
        if (!this.op.selectSingleKey) {
            return;
        }
        let titleDiv = document.createElement("div");
        let titleDiv_Label = document.createElement("label");
        titleDiv_Label.innerHTML = "单键:KEY";
        let titleDiv_Input = document.createElement("input");
        titleDiv_Input.value = this.op.selectSingleKey.replace("KEY", "");
        titleDiv_Input.type = "number";
        titleDiv_Input.addEventListener("change", () => {
            let name = "KEY" + (titleDiv_Input.value);
            if (!this.keyDomList[name]) {
                let check = window.confirm("不存在,需要创建吗?");
                if (check) {
                    this.boardData[name] = {};
                    let p = this.boardData["PANAL"];
                    p.KEY_NUM = (Number(p.KEY_NUM) + 1).toString();
                    this.op.selectSingleKey = name;
                    saveJson(this.boardUrl, this.boardData);
                    this.saveOPJson();
                }
                new JMain();
                return;
            }
            this.op.selectSingleKey = name;
            this.saveOPJson();
            new JMain();
        });
        titleDiv.append(titleDiv_Label, titleDiv_Input);
        this.phoneCmdDiv.append(titleDiv);
        let inputList = [
            { key: "BACK_STYLE", title: "按键背景指定样式:", type: "style" },
            { key: "FORE_STYLE", title: "按键前景指定样式:", tip: "允许多个前景,前景间用英文逗号分隔\nFORE_STYLE=1,88,200\n表示此键有 1,88,200 三个前景", type: "style" },
            { key: "POS_TYPE", title: "偏移:", tip: "此参数和前景对应,一个参数对应一个前景,同样以英文逗号分隔,表示前景的偏移类型,序号和 gen.ini 中的[OFFSET*]的序号对应,如果无对应值则为 0,表示不偏移,居中对齐(下面的表格会提到 OFFSET 属性,已用阴影填充加强显示)\nFORE_STYLE=1,88,200\nPOS_TYPE=0,2,10\n表示前景 1,距中显示；前景 88 使用2 号偏移；前景 200 使用 10 号偏移（序号由 gen.ini 生成）", type: "offset" },
            { key: "VIEW_RECT", title: "坐标:", tip: "按键绘制时的坐标 X,Y 及宽 W,高 H\nVIEW_RECT=45,3,60,70\n在 PANAL 面板(45,3)处绘制一个宽60 高 70 的键" },
            { key: "TOUCH_RECT", title: "按键点击范围补丁:", tip: "控制该键的实际点击位置X,Y 和宽 W,高 H\n当 TOUCH_RECT=0,0,0,0 或宽,高为 0 时,表示此键不可点击（常用做背景显示功能）\nVIEW_RECT=45,3,60,70\nTOUCH_RECT=43,0,66,72\n表示此键的实际点击范围是(43,0)处宽 66 高 72 的矩阵." },
            { key: "UP", title: "向上划:", type: "key" },
            { key: "DOWN", title: "向下划:", type: "key" },
            { key: "LEFT", title: "向左划:", type: "key" },
            { key: "RIGHT", title: "向右划:", type: "key" },
            { key: "CENTER", title: "直接点击:", type: "key" },
            { key: "SHOW", title: "直接点击后传给内核的键值:", tip: "SHOW 的作用：向内核反馈点击此键后的键值,供内核判断该键类型.能在输入码上回馈键值." },
            { key: "HOLD", title: "长按:", tip: "长按后对应的字符或功能\n注：HOLD 与 HOLDSYM 不能共存,两者只能选一个.\n当一个键没有 HOLD 和 HOLDSYM 属性时,默认按住效是弹出的气泡显示该键的所有字符.\nHOLD=F1\n按住为 F1 打开符号面板\n注：HOLD=字符时,此字符会参与输入码." },
            { key: "HOLDSYM", title: "长按后对应的字符集:", tip: "（字符之间无分隔符）,以字符形式直接输出\n注：HOLD 与 HOLDSYM 不能共存,两者只能选一个.\n当一个键没有 HOLD 和 HOLDSYM 属性时,默认按住效是弹出的气泡显示该键的所有字符.\nHOLDSYM=ABCD@#\n表示长按对应的字符集是 ABCD@#\n然后通过手势选择字符,字符间无间隔.\n当 HOLDSYM=单字符时,表示此字符直接上屏." },
            { key: "STAT_STYLE", title: "针对特殊状态时的显示及样式及功能:", tip: "（状态补丁）\nS 代表状态类型,_后的数字表示 TIP 序号\n（详见 S 状态定义）\n当有多个状态时,状态之间用“|”间隔\nSTAT_STYLE=S4_1|S14_2\n表示 S4（有输入码状态）时,执行[TIP1]补丁,使该键在显示或功能上发生改变.在 S14（中文临时英文输入状态）时,执行[TIP2]" },
            { key: "SPACE_VOICE_XY", title: "空格_语音_坐标:", tip: "(5.15+版新功能)\n长按空格语音图标的坐标定位,原点在空格按键矩阵的左上角\nSPACE_VOICE_XY=200,40" }
        ];
        for (let i = 0; i < inputList.length; i++) {
            let div = this.createChildDom({ data: inputList[i], baseData: this.boardData, saveUrl: this.boardUrl, type: this.op.selectSingleKey });
            if (!div) {
                continue;
            }
            this.phoneCmdDiv.append(div, document.createElement('br'));
        }
    }
    /** 创建单键模式下图标元素 */
    createBoardSingleIconDom() {
        this.phoneCmdDiv.innerHTML = "";
        let title = document.createElement("h3");
        title.innerHTML = `图标数据\n${this.op.selectSingleKey}`;
        title.style.textAlign = "center";
        this.phoneCmdDiv.append(title);
        let titleDiv = document.createElement("div");
        let titleDiv_Label = document.createElement("label");
        titleDiv_Label.innerHTML = "图标:ICON";
        let titleDiv_Input = document.createElement("input");
        titleDiv_Input.value = this.op.selectSingleKey.replace("ICON", "");
        titleDiv_Input.type = "number";
        titleDiv_Input.addEventListener("change", () => {
            let name = "ICON" + (titleDiv_Input.value);
            if (!this.keyDomList[name]) {
                let check = window.confirm("不存在,需要创建吗?");
                if (check) {
                    this.candData[name] = {};
                    let p = this.candData["CAND"];
                    p.ICON_NUM = (Number(p.ICON_NUM) + 1).toString();
                    saveJson(this.candUrl, this.candData);
                    this.saveOPJson();
                }
                new JMain();
                return;
            }
            this.op.selectSingleKey = name;
            this.saveOPJson();
            new JMain();
        });
        titleDiv.append(titleDiv_Label, titleDiv_Input);
        this.phoneCmdDiv.append(titleDiv);
        if (!this.op.selectSingleKey) {
            return;
        }
        let inputList = [
            { key: "BACK_STYLE", title: "图标背景样式:", type: "style" },
            { key: "FORE_STYLE", title: "图标前景样式:", type: "style" },
            { key: "SIZE", title: "图标大小:", tip: "（宽,高）\nSIZE=45,60\n自己测试过,这里一般不指拉伸,指居中" },
            { key: "KEY", title: "按下后执行的操作", tip: "注：ICON 不支持点划操作,不支持输出字符和输入码（1,2,3,4 除外,会自动转换成光标移动功能,例 KEY=1）\nKEY=F31\n按下后执行 F31（logo 菜单）", type: "key" },
            {
                key: "ANCHOR_TYPE", title: "锚点类型", tip: "1～9 分别代表 CAND 矩阵内的 9 个点,以这些点为原点.\nANCHOR_TYPE=5\n以 CAND 正中心为原点(0,0),之所以附加这么多的锚点类型是为了 ICON 的精确定位", type: "select", select: [
                    { name: "1 左上角", value: 1 },
                    { name: "2 中上", value: 2 },
                    { name: "3 右上角", value: 3 },
                    { name: "4 中左", value: 4 },
                    { name: "5 正中心", value: 5 },
                    { name: "6 中右", value: 6 },
                    { name: "7 左下角", value: 7 },
                    { name: "8 中下", value: 8 },
                    { name: "9 右下角", value: 9 },
                ]
            },
            { key: "POS", title: "偏移", tip: "以 ANCHOR_TYPE 锚点类型为原点\n（0,0）,ICON 左上角相对此点的偏移\nANCHOR_TYPE=5\nPOS=-60,-20\n以类型 5 为原点,向左偏移 60,向上偏移 20（向右向下为增）" },
            {
                key: "PERSIST", title: "此图标是否在有候选字时显示:", type: "select", select: [
                    { name: "都不显示", value: "0" },
                    { name: "无候选字时显示", value: "1" },
                    { name: "有候选字时显示", value: "2" },
                    { name: "有无候选字时都显示", value: "3" },
                ]
            },
            { key: "STAT_STYLE", title: "状态补丁", tip: "针对特殊状态时的显示及样式及功能\nS 代表状态类型,_后的数字表示 TIP序号（详见 S 状态定义）\n当有多个状态时,状态之间用“|”间隔\nSTAT_STYLE=S9_1\n当处在 S9（中文联想状态）时,执行[TIP1]" }
        ];
        for (let i = 0; i < inputList.length; i++) {
            let div = this.createChildDom({ data: inputList[i], baseData: this.candData, saveUrl: this.candUrl, type: this.op.selectSingleKey });
            if (!div) {
                continue;
            }
            this.phoneCmdDiv.append(div, document.createElement('br'));
        }
    }
    /** 创建多选模式下元素 */
    createBoardMultiKeyListDom() {
        this.phoneCmdDiv.innerHTML = "";
        let title = document.createElement("h3");
        title.innerHTML = "多键数据";
        title.style.textAlign = "center";
        this.phoneCmdDiv.append(title);
        let div = document.createElement("div");
        let p = document.createElement("label");
        p.innerHTML = "按键集合:";
        let input = document.createElement("textarea");
        input.value = this.op.selectMultiKeyList.join(",");
        input.addEventListener("change", () => {
            this.op.selectMultiKeyList = input.value.split(',');
            this.saveOPJson();
            this.reFreshPhoneSkin();
        });
        div.append(p, input);
        this.phoneCmdDiv.append(div);
        let moveList = this.op.multiAdd.split(',').map(c => Number(c));
        let moveTilte = ["x:", "y:", "w:", "h:"];
        for (let i = 0; i < moveList.length; i++) {
            let div = document.createElement("div");
            let p = document.createElement("label");
            p.innerHTML = moveTilte[i];
            let input = document.createElement("input");
            input.value = moveList[i].toString();
            let btn = document.createElement('button');
            btn.innerHTML = "叠加";
            btn.onclick = () => {
                moveList[i] = Number(input.value);
                for (let key in this.keyDomList) {
                    if (!this.op.selectMultiKeyList.includes(key)) {
                        continue;
                    }
                    let keyData = this.boardData[key];
                    if (!keyData.VIEW_RECT) {
                        continue;
                    }
                    let rect = keyData.VIEW_RECT.split(',').map(c => Number(c));
                    console.log(rect.toString());
                    rect[i] += moveList[i];
                    console.log(rect.toString());
                    keyData.VIEW_RECT = rect.join(",");
                }
                saveJson(this.boardUrl, this.boardData);
                this.op.multiAdd = moveList.join(',');
                this.saveOPJson();
                this.reFreshPhoneSkin();
            };
            div.append(p, input, btn);
            this.phoneCmdDiv.append(div);
        }
    }
}
/** 创建子元素 */
function createChildDom(op) {
    if (!op.type) {
        return;
    }
    if (!op.data.type) {
        op.data.type = "normal";
    }
    let styleOrOffsetDiv = document.createElement("div");
    let div = document.createElement("div");
    let p = document.createElement("label");
    p.title = op.data.key;
    p.innerHTML = op.data.title;
    div.append(p);
    let styleBtnDiv;
    let offsetBtnDiv;
    let styleFunc = (v) => {
        styleBtnDiv.innerHTML = "";
        let styleList = v.split(",");
        let curStyleName = "";
        for (let i = 0; i < styleList.length; i++) {
            if (!styleList[i]) {
                continue;
            }
            let btn = document.createElement("button");
            btn.innerHTML = styleList[i];
            btn.onclick = () => {
                if (styleOrOffsetDiv.innerHTML && styleList[i] == curStyleName) {
                    styleOrOffsetDiv.innerHTML = "";
                    styleOrOffsetDiv.setAttribute("class", "");
                    return;
                }
                curStyleName = styleList[i];
                styleOrOffsetDiv.setAttribute("class", "childStyleBox");
                styleOrOffsetDiv.innerHTML = "";
                let child = this.createStyleDom({ styleCount: styleList[i] });
                styleOrOffsetDiv.append(child);
            };
            styleBtnDiv.append(btn);
        }
    };
    let offsetFunc = (v) => {
        offsetBtnDiv.innerHTML = "";
        let offsetList = v.split(",");
        let curOffsetName = "";
        for (let i = 0; i < offsetList.length; i++) {
            if (!offsetList[i]) {
                continue;
            }
            let btn = document.createElement("button");
            btn.innerHTML = offsetList[i];
            btn.onclick = () => {
                if (styleOrOffsetDiv.innerHTML && offsetList[i] == curOffsetName) {
                    styleOrOffsetDiv.innerHTML = "";
                    styleOrOffsetDiv.setAttribute("class", "");
                    return;
                }
                curOffsetName = offsetList[i];
                styleOrOffsetDiv.setAttribute("class", "childOffsetBox");
                styleOrOffsetDiv.innerHTML = "";
                let child = this.createOffsetDom({ offsetCount: offsetList[i] });
                child && styleOrOffsetDiv.append(child);
            };
            offsetBtnDiv.append(btn);
        }
    };
    if (op.data.type == "select") {
        let select = document.createElement("select");
        select.title = op.data.tip || "";
        for (let i = 0; i < op.data.select.length; i++) {
            let c = op.data.select[i];
            let o = document.createElement("option");
            o.innerHTML = c.name;
            o.value = c.value;
            select.append(o);
        }
        select.value = op.baseData[op.type][op.data.key] || "";
        select.addEventListener("change", () => {
            op.baseData[op.type][op.data.key] = select.value;
            saveJson(op.saveUrl, op.baseData);
            this.reFreshPhoneSkin();
        });
        div.append(select);
    }
    else if (op.data.type == "fn") {
        let input = document.createElement("input");
        div.append(input);
        let button = document.createElement("button");
        button.innerHTML = "执行";
        button.onclick = () => {
            op.data.fn(input.value);
        };
        div.append(input, button);
    }
    else {
        let input = document.createElement("input");
        let colorInput;
        let keyBtn;
        input.title = op.data.tip || "";
        input.value = op.baseData[op.type][op.data.key] || "";
        div.append(input);
        input.addEventListener("change", (e) => {
            op.baseData[op.type][op.data.key] = input.value;
            colorInput && (colorInput.value = "#" + input.value);
            saveJson(op.saveUrl, op.baseData);
            if (styleBtnDiv) {
                styleFunc(input.value);
            }
            if (offsetBtnDiv) {
                offsetFunc(input.value);
            }
            this.reFreshPhoneSkin();
        });
        if (op.data.type == "key") {
            keyBtn = document.createElement("button");
            keyBtn.innerHTML = "特殊按键";
            div.append(keyBtn);
            let keyList = [
                { v: "F1", d: "切换到符号面板" },
                { v: "F2", d: "" },
                { v: "F3", d: "切换拇指,全键盘" },
                { v: "F4", d: "返回" },
                { v: "F5", d: "切换到软键盘" },
                { v: "F6", d: "切换到数字面板" },
                { v: "F7", d: "切换到表情面板" },
                { v: "F8", d: "隐藏面板" },
                { v: "F9", d: "查看更多候选字" },
                { v: "F10", d: "切换小写和首字母大写" },
                { v: "F11", d: "切换小写和大写锁定" },
                { v: "F12", d: "切换到网络面板" },
                { v: "F13", d: "一键换皮肤" },
                { v: "F14", d: "面板切换功能容器" },
                { v: "F15", d: "切换到中文输入状态" },
                { v: "F16", d: "切换到英文输入状态" },
                { v: "F17", d: "切换到拨号界面" },
                { v: "F18", d: "" },
                { v: "F19", d: "" },
                { v: "F20", d: "" },
                { v: "F21", d: "菜单" },
                { v: "F22", d: "候选字上翻" },
                { v: "F23", d: "候选字下翻" },
                { v: "F24", d: "中文输入方式选择菜单" },
                { v: "F25", d: "切换字母、联想 " },
                { v: "F26", d: "候选字 单字/全部 切换" },
                { v: "F27", d: "锁定符号面板" },
                { v: "F28", d: "修改英文排序" },
                { v: "F29", d: "候选条上翻页" },
                { v: "F30", d: "候选条下翻页" },
                { v: "F31", d: "logo 菜单" },
                { v: "F32", d: "弹出预备的列表" },
                { v: "F33", d: "" },
                { v: "F34", d: "" },
                { v: "F35", d: "" },
                { v: "F36", d: "退格" },
                { v: "F37", d: "删除" },
                { v: "F38", d: "空格" },
                { v: "F39", d: "回车" },
                { v: "F40", d: "清除输入码" },
                { v: "F41", d: "Tab" },
                { v: "F42", d: "Home" },
                { v: "F43", d: "End" },
                { v: "F44", d: "剪切" },
                { v: "F45", d: "复制" },
                { v: "F46", d: "粘贴" },
                { v: "F47", d: "全选" },
                { v: "F48", d: "清空" },
                { v: "F49", d: "光标上移" },
                { v: "F50", d: "光标下移" },
                { v: "F51", d: "光标左移" },
                { v: "F52", d: "光标右移" },
                { v: "F53", d: "手写区" },
                { v: "F54", d: "结束联想" },
                { v: "F55", d: "候选字在所在区域" },
                { v: "F56", d: "遮罩效果的键值" },
                { v: "F57", d: "" },
                { v: "F58", d: "" },
                { v: "F59", d: "" },
                { v: "F60", d: "" },
                { v: "F61", d: "启动选字模式" },
                { v: "F62", d: "切换其他输入法(地球)" },
                { v: "F63", d: "输入法选择菜单" },
                { v: "F64", d: "点击右上角 x 或 ok" },
                { v: "F65", d: "Win" },
                { v: "F66", d: "恢复" },
                { v: "F67", d: "撤销" },
                { v: "F68", d: "应用 1(搜索)" },
                { v: "F69", d: "应用 2(短信)" },
                { v: "F70", d: "应用 3(EMAIN)" },
                { v: "F71", d: "启用表情符号功能" },
                { v: "F72", d: "启动语音" },
                { v: "F73", d: "启动多媒体" },
                { v: "F74", d: "" },
                { v: "F75", d: "" },
                { v: "F76", d: "" },
                { v: "F77", d: "" },
                { v: "F78", d: "" },
                { v: "F79", d: "" },
                { v: "F80", d: "" },
                { v: "F81", d: "" },
                { v: "F82", d: "" },
                { v: "F83", d: "" },
                { v: "F84", d: "" },
                { v: "F85", d: "" },
                { v: "F86", d: "" },
                { v: "F87", d: "" },
                { v: "F88", d: "" },
                { v: "F89", d: "" },
                { v: "F90", d: "" },
            ];
            keyBtn.onclick = () => {
                console.log("特殊按键");
                let backDiv = document.createElement("div");
                document.body.append(backDiv);
                backDiv.setAttribute("class", "specialKey");
                backDiv.onclick = () => {
                    backDiv.remove();
                };
                let formDiv = document.createElement("div");
                backDiv.append(formDiv);
                let count = 30;
                let table;
                let tr;
                for (let i = 0; i < keyList.length; i++) {
                    if (i % count == 0) {
                        table = document.createElement("table");
                        formDiv.append(table);
                    }
                    let tr = document.createElement("tr");
                    let tdV = document.createElement("td");
                    tdV.innerHTML = `<a class="form_a" href="#">${keyList[i].v}</a>`;
                    let tdD = document.createElement("td");
                    tdD.innerHTML = `<a class="form_a" href="#">${keyList[i].d}</a>`;
                    tdV.onclick = tdD.onclick = () => {
                        input.value = keyList[i].v;
                        op.baseData[op.type][op.data.key] = input.value;
                        saveJson(op.saveUrl, op.baseData);
                        this.saveOPJson();
                        this.reFreshPhoneSkin();
                    };
                    tr.append(tdV, tdD);
                    table.append(tr);
                }
            };
        }
        if (op.data.type == "color") {
            colorInput = document.createElement("input");
            colorInput.setAttribute("type", "color");
            colorInput.value = "#" + input.value;
            colorInput.addEventListener("change", () => {
                console.log(colorInput.value);
                op.baseData[op.type][op.data.key] = colorInput.value.slice(1);
                saveJson(op.saveUrl, op.baseData);
                this.reFreshPhoneSkin();
            });
            div.append(colorInput);
        }
        if (op.data.type == "style") {
            styleBtnDiv = document.createElement("div");
            styleFunc(input.value);
            div.append(styleBtnDiv);
        }
        if (op.data.type == "offset") {
            offsetBtnDiv = document.createElement("div");
            offsetFunc(input.value);
            div.append(offsetBtnDiv);
        }
        if (op.data.type == "style" || op.data.type == "offset") {
            div.append(styleOrOffsetDiv);
        }
    }
    return div;
}
class JFlow {
    /** 初始化 */
    async init() {
        this.keyDomList = {};
        this.initData();
        await this.initLoadData();
        this.creatFileDiv();
        this.createOPDiv();
        this.setPhoneDivSize(this.op.phoneWidth, this.op.phoneHeight, this.op.phoneScale);
        this.setMoveDivPos(this.op.phoneWidth, this.op.phoneHeight);
        await this.decodeBoard();
        this.initCmdDiv();
        this.checkCss();
    }
    /** 初始化数据 */
    initData() {
        this.op = this.loadOPJson() || this.op;
        this.moveDiv = document.getElementsByClassName("moveDiv")[0];
        this.cmdDiv = document.getElementsByClassName("cmd")[0];
        this.phoneDiv = document.getElementsByClassName("phoneDisplay")[0];
        // this.phoneDiv.innerHTML = ""
        this.phoneCandDiv = this.phoneDiv.getElementsByClassName("phoneCand")[0];
        this.phoneCandDiv.innerHTML = "";
        this.phoneBoardDiv = this.phoneDiv.getElementsByClassName("phoneBoard")[0];
        this.phoneBoardDiv.innerHTML = "";
        this.phoneOPDiv = document.getElementsByClassName("phoneOP")[0];
        this.phoneOPDiv.innerHTML = "";
        this.phoneFileDiv = document.getElementsByClassName("phoneFile")[0];
        this.phoneFileDiv.innerHTML = "";
        this.phoneCmdDiv = document.getElementsByClassName("phoneCmd")[0];
        this.phoneCmdDiv.innerHTML = "";
        this.setMoveDivEvent();
    }
    /** 初始加载数据 */
    async initLoadData() {
        this.cssData = loadJson(this.cssUrl);
        if (!this.cssData) {
            this.cssData = await getIniFileData(this.cssUrl);
        }
        this.boardData = loadJson(this.boardUrl);
        if (!this.boardData) {
            this.boardData = await getIniFileData(this.boardUrl);
        }
        this.genData = loadJson(this.genUrl);
        if (!this.genData) {
            this.genData = await getIniFileData(this.genUrl);
        }
        console.log(this.genData);
        // 装入默认数据
        ["PANEL", "INPUT", "CAND", "HINT", "MORE", "LIST"].forEach(key => {
            if (!this.genData[key] || !this.boardData[key]) {
                return;
            }
            for (let childKey in this.genData[key]) {
                if (!this.boardData[key]) {
                    this.boardData[key] = {};
                }
                if (this.boardData[key][childKey] != null) {
                    continue;
                }
                this.boardData[key][childKey] = this.genData[key][childKey];
            }
        });
        this.op.candName = this.boardData?.['CAND']?.['LAYOUT_NAME'];
        if (this.op.candName) {
            this.candData = loadJson(this.candUrl);
            if (!this.candData) {
                this.candData = await getIniFileData(this.candUrl);
            }
            console.log(this.candData);
        }
        this.op.hintName = this.boardData?.['HINT']?.["LAYOUT_NAME"];
        if (this.op.hintName) {
            this.hintData = loadJson(this.hintData);
            if (!this.hintData) {
                this.hintData = await getIniFileData(this.hintUrl);
            }
            console.log(this.hintData);
        }
        console.log(this.boardData);
        return;
    }
    /** 解析键盘 */
    async decodeBoard() {
        let listName = "";
        let candName = "";
        let panelName = "PANEL";
        if (this.boardData[panelName]) {
            await this.decodeBoard_Panel(this.boardData[panelName], panelName);
        }
        for (let key in this.boardData) {
            if (key.includes("KEY")) {
                await this.decodeBoard_Key(this.boardData[key], key);
            }
            if (key == "LIST") {
                listName = key;
            }
            if (key == "CAND") {
                candName = key;
            }
        }
        if (listName) {
            await this.decodeBoard_List(this.boardData[listName], listName);
        }
        if (candName) {
            await this.decodeBoard_Cand(this.boardData[candName], candName);
        }
    }
    /** 解析键盘面板 */
    async decodeBoard_Panel(data, keyName) {
        let styleTagList = [data.BACK_STYLE, ...(data.FORE_STYLE || "").split(",")];
        let size = data.SIZE.split(",").map(c => Number(c));
        let div = document.createElement("div");
        div.setAttribute("class", `panel ${keyName}`);
        div.style.position = "absolute";
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.width = size[0] + "px";
        div.style.height = size[1] + 'px';
        this.phoneBoardDiv.append(div);
        for (let i = 0; i < styleTagList.length; i++) {
            let tag = styleTagList[i];
            if (!tag) {
                continue;
            }
            await this.decodeBoard_ImgStyle({ viewRectW: size[0], viewRectH: size[1], w: size[0], h: size[1], style: tag, div, keyName });
        }
        return;
    }
    /** 解析键盘图标样式 */
    async decodeBoard_IconStyle(op) {
        // 无候选
        if (op.data.PERSIST == "1" && this.op.isPersist) {
            return;
        }
        // 有候选
        if (op.data.PERSIST == "2" && !this.op.isPersist) {
            return;
        }
        // 都不显示
        if (op.data.PERSIST == "0") {
            return;
        }
        let size = (op.data.SIZE || "").split(",").map(c => Number(c));
        let styleList = [op.data.BACK_STYLE, ...(op.data.FORE_STYLE || "").split(",")];
        let pos = (op.data.POS || "").split(",").map(c => Number(c));
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < styleList.length; i++) {
            let style = styleList[i];
            if (!style) {
                continue;
            }
            let styleName = `STYLE${style}`;
            let css = this.cssData[styleName];
            if (!css) {
                continue;
            }
            let imgList = [];
            let imgTagList = [css.NM_IMG, css.HL_IMG];
            for (let i = 0; i < imgTagList.length; i++) {
                if (!imgTagList[i]) {
                    if (i == 0) {
                        let div = document.createElement("div");
                        div.setAttribute("calss", i == 0 ? `nm_img ${styleName} ${op.keyName}` : `hl_img ${styleName} ${op.keyName}`);
                        div.style.position = "absolute";
                        div.style.left = "0px";
                        div.style.top = "0px";
                        console.log(op.rectH, op.rectW);
                        div.style.width = op.rectW + "px";
                        div.style.height = op.rectH + "px";
                        op.div.append(div);
                        imgList.push(div);
                        continue;
                    }
                    imgList.push(undefined);
                    continue;
                }
                let nm = imgTagList[i].split(',');
                let imageData = await this.getImageData(nm[0]);
                let imgName = `IMG${nm[1]}`;
                let imgTil = imageData.til[imgName];
                let rect = imgTil.SOURCE_RECT.split(",");
                let rectX = Number(rect[0]);
                let rectY = Number(rect[1]);
                let rectW = Number(rect[2]);
                let rectH = Number(rect[3]);
                let b64 = await getTilImageB64(imageData.b64, rectX, rectY, rectW, rectH);
                let img = document.createElement("img");
                img.setAttribute("calss", i == 0 ? `nm_img ${op.keyName} ${styleName}` : `hl_img ${op.keyName} ${styleName}`);
                img.setAttribute("memo", imgTagList[i]);
                img.src = b64;
                img.style.position = "absolute";
                let w = rectW;
                let h = rectH;
                // if (size) {
                //     w = size[0]
                //     h = size[1]
                // }
                let offsetX = 0;
                let offsetY = 0;
                if (size) {
                    offsetX += (size[0] - w) / 2;
                    offsetY += (size[1] - h) / 2;
                }
                offsetX += (() => { return [op.rectW, 0, op.rectW / 2]; })()[Number(op.data.ANCHOR_TYPE || 1) % 3];
                offsetY += (() => { return [0, op.rectH / 2, op.rectH]; })()[Math.floor((Number(op.data.ANCHOR_TYPE || 1) - 1) / 3)];
                offsetX += pos[0] || 0;
                offsetY += pos[1] || 0;
                img.style.width = w + "px";
                img.style.height = h + "px";
                img.style.left = offsetX + "px";
                img.style.top = offsetY + "px";
                minX = Math.min(offsetX, minX);
                minY = Math.min(offsetY, minY);
                maxX = Math.max(offsetX + w, maxX);
                maxY = Math.max(offsetY + h, maxY);
                op.div.append(img);
                imgList.push(img);
            }
            op.handlerDiv.addEventListener('mouseenter', () => {
                imgList[0] && (imgList[0].style.display = "none");
                imgList[1] && (imgList[1].style.display = "block");
            });
            op.handlerDiv.addEventListener("mouseleave", () => {
                imgList[0] && (imgList[0].style.display = "block");
                imgList[1] && (imgList[1].style.display = "none");
            });
            op.handlerDiv.addEventListener("click", () => {
                console.log(op.keyName);
            });
        }
        let handlerDiv = document.createElement("div");
        handlerDiv.style.position = "absolute";
        handlerDiv.style.left = minX + "px";
        handlerDiv.style.top = minY + "px";
        handlerDiv.style.width = maxX - minX + "px";
        handlerDiv.style.height = maxY - minY + "px";
        handlerDiv.setAttribute("class", "icon_handler");
        handlerDiv.addEventListener("click", () => {
            this.dispatchKeyEvent({ key: op.keyName, dom: op.div, handlerDom: handlerDiv, type: "icon" });
        });
        op.div.append(handlerDiv);
        this.keyDomList[op.keyName] = { name: op.keyName, type: "icon", handlerDom: handlerDiv, dom: op.div };
        this.setKeySelectHL(op.keyName, handlerDiv);
        return;
    }
    /** 解析键盘候选框 */
    async decodeBoard_Cand(data, keyName) {
        let rect = data.VIEW_RECT.split(",");
        let rectX = Number(rect[0]);
        let rectY = Number(rect[1]);
        let rectW = Number(rect[2]);
        let rectH = Number(rect[3]);
        let div = document.createElement("div");
        div.style.position = "relative";
        div.style.left = rectX + 'px';
        div.style.top = rectY + 'px';
        div.style.width = rectW + 'px';
        div.style.height = rectH + "px";
        // div.style.backgroundColor = "red"
        this.phoneCandDiv.append(div);
        let handlerDiv = document.createElement("div");
        let cand = this.candData["CAND"];
        if (cand.BACK_STYLE) {
            await this.decodeBoard_ImgStyle({ viewRectW: rectW, viewRectH: rectH, div, w: rectW, h: rectH, style: cand.BACK_STYLE, handlerDiv, keyName, isBack: true, isCand: true });
        }
        if (cand.FORE_STYLE) {
            let list = cand.FORE_STYLE.split(',');
            for (let i = 0; i < list.length; i++) {
                await this.decodeBoard_ImgStyle({ viewRectW: rectW, viewRectH: rectH, div, style: list[i], handlerDiv, keyName });
            }
        }
        for (let key in this.candData) {
            if (key.includes("ICON")) {
                let icon = this.candData[key];
                await this.decodeBoard_IconStyle({ data: icon, div, handlerDiv, rectW, rectH, keyName: key });
            }
        }
        this.phoneCandDiv.append(handlerDiv);
        handlerDiv.dispatchEvent(new Event("mouseleave"));
        return;
    }
    /** 解析键盘列表 */
    async decodeBoard_List(data, keyName) {
        let padding = (data.PADDING || "").split(",").map(c => Number(c));
        let names = data.NAMES.split(" ");
        let num = Number(data.LIST_NUM);
        let startX = null;
        let startY = null;
        let size = (data.CELL_SIZE || "").split(',').map(c => Number(c));
        let pos = data.POS.split(',').map(c => Number(c));
        let fontCss = this.cssData[`STYLE${data.FORE_STYLE}`];
        if (!fontCss) {
            return;
        }
        for (let i = 0; i < num; i++) {
            let div = document.createElement("div");
            if (startX == null) {
                startX = pos[0];
                startX += padding[0] || 0;
            }
            if (startY === null) {
                startY = pos[1];
                startY += padding[1] || 0;
            }
            if (i) {
                startX += data.LIST_ORDER == "1" ? size[0] : 0;
                startY += data.LIST_ORDER == "0" ? size[1] : 0;
            }
            div.style.position = "absolute";
            div.style.left = startX + 'px';
            div.style.top = startY + 'px';
            div.style.width = (size[0] - padding[0] - padding[2]) + 'px';
            div.style.height = (size[1] - padding[1] - padding[3]) + 'px';
            this.phoneBoardDiv.append(div);
            let handlerDiv = document.createElement("div");
            let styleName = `STYLE${data.CELL_STYLE}`;
            let css = this.cssData[styleName];
            if (!css) {
                continue;
            }
            let imgList = [];
            let imgTagList = [css.NM_IMG, css.HL_IMG];
            for (let j = 0; j < imgTagList.length; j++) {
                if (!imgTagList[j]) {
                    imgList.push(undefined);
                    continue;
                }
                let nm = imgTagList[j].split(',');
                let imageData = await this.getImageData(nm[0]);
                let imgName = `IMG${nm[1]}`;
                let imgTil = imageData.til[imgName];
                let edata = await this.getImgEle({ til: imgTil, imgData: imageData, w: size[0], h: size[1] });
                edata.e.setAttribute("calss", j == 0 ? `nm_img ${styleName} ${keyName}` : `hl_img ${styleName} ${keyName}`);
                edata.e.style.position = "absolute";
                edata.e.style.left = edata.offsetX + "px";
                edata.e.style.top = edata.offsetY + "px";
                div.append(edata.e);
                imgList.push(edata.e);
            }
            if (names[i]) {
                let colorList = [fontCss.NM_COLOR, fontCss.HL_COLOR];
                let boxList = [];
                for (let j = 0; j < colorList.length; j++) {
                    if (!colorList[j]) {
                        boxList.push(undefined);
                        continue;
                    }
                    let p = this.getPEle({ pos: [0, 0], show: names[i], color: colorList[j], fontSize: fontCss.FONT_SIZE, viewW: size[0], viewH: size[1] });
                    div.append(p);
                    boxList.push(p);
                }
                handlerDiv.addEventListener('mouseenter', () => {
                    boxList[0] && (boxList[0].style.display = "none");
                    boxList[1] && (boxList[1].style.display = "table");
                });
                handlerDiv.addEventListener("mouseleave", () => {
                    boxList[0] && (boxList[0].style.display = "table");
                    boxList[1] && (boxList[1].style.display = "none");
                });
            }
            handlerDiv.style.position = "absolute";
            handlerDiv.style.left = startX + 'px';
            handlerDiv.style.top = startY + 'px';
            handlerDiv.style.width = size[0] + 'px';
            handlerDiv.style.height = size[1] + 'px';
            this.phoneBoardDiv.append(handlerDiv);
            handlerDiv.addEventListener('mouseenter', () => {
                imgList[0] && (imgList[0].style.display = "none");
                imgList[1] && (imgList[1].style.display = "block");
            });
            handlerDiv.addEventListener("mouseleave", () => {
                imgList[0] && (imgList[0].style.display = "block");
                imgList[1] && (imgList[1].style.display = "none");
            });
            handlerDiv.dispatchEvent(new Event("mouseleave"));
        }
    }
    /** 解析键值key的样式 */
    async decodeBoard_ImgStyle(op) {
        let styleName = `STYLE${op.style}`;
        let css = this.cssData[styleName];
        if (!css) {
            return;
        }
        let pos = undefined;
        if (op.pos_Type) {
            let offset = this.genData[`OFFSET${op.pos_Type}`];
            if (offset?.POS) {
                pos = offset.POS.split(',').map(c => Number(c));
            }
        }
        let imgList = [];
        let imgTagList = [css.NM_IMG, css.HL_IMG];
        if (op.isCand && !imgTagList[0]) {
            console.log(css.HL_IMG);
            imgTagList[0] = css.HL_IMG;
        }
        for (let i = 0; i < imgTagList.length; i++) {
            if (!imgTagList[i]) {
                if (i == 0) {
                    let div = document.createElement("div");
                    div.setAttribute("calss", i == 0 ? `nm_img ${styleName} ${op.keyName}` : `hl_img ${styleName} ${op.keyName}`);
                    div.style.position = "absolute";
                    div.style.left = "0px";
                    div.style.top = "0px";
                    div.style.width = op.viewRectW + "px";
                    div.style.height = op.viewRectH + "px";
                    op.div.append(div);
                    imgList.push(div);
                    continue;
                }
                imgList.push(undefined);
                continue;
            }
            let nm = imgTagList[i].split(',');
            let imageData = await this.getImageData(nm[0]);
            let imgName = `IMG${nm[1]}`;
            let imgTil = imageData.til[imgName];
            let edata = await this.getImgEle({ til: imgTil, imgData: imageData, w: op.viewRectW, h: op.viewRectH, isBack: op.isBack });
            edata.e.setAttribute("calss", i == 0 ? `nm_img ${styleName} ${op.keyName}` : `hl_img ${styleName} ${op.keyName}`);
            edata.e.setAttribute("memo", imgTagList[i]);
            edata.e.style.position = "absolute";
            let offsetX = edata.offsetX;
            let offsetY = edata.offsetY;
            if (op.size) {
                offsetX += (op.viewRectW - op.size[0]) / 2;
                offsetY += (op.viewRectH - op.size[1]) / 2;
            }
            if (pos) {
                offsetX += pos[0];
                offsetY += pos[1];
            }
            edata.e.style.left = offsetX + "px";
            edata.e.style.top = offsetY + "px";
            op.div.append(edata.e);
            imgList.push(edata.e);
        }
        op.handlerDiv && op.handlerDiv.addEventListener('mouseenter', () => {
            imgList[0] && imgList[1] && (imgList[0].style.display = "none");
            imgList[1] && (imgList[1].style.display = "block");
        });
        op.handlerDiv && op.handlerDiv.addEventListener("mouseleave", () => {
            imgList[0] && (imgList[0].style.display = "block");
            imgList[1] && (imgList[1].style.display = "none");
        });
        let colorList = [css.NM_COLOR || css.HL_COLOR, css.HL_COLOR];
        let boxList = [];
        for (let i = 0; i < colorList.length; i++) {
            if (!colorList[i] || !css.SHOW) {
                boxList.push(undefined);
                continue;
            }
            let p = this.getPEle({ pos: pos || [0, 0], show: css.SHOW, color: colorList[i], fontSize: css.FONT_SIZE, viewW: op.viewRectW, viewH: op.viewRectH });
            op.div.append(p);
            boxList.push(p);
        }
        op.handlerDiv && op.handlerDiv.addEventListener('mouseenter', () => {
            boxList[0] && (boxList[0].style.display = "none");
            boxList[1] && (boxList[1].style.display = "table");
        });
        op.handlerDiv && op.handlerDiv.addEventListener("mouseleave", () => {
            boxList[0] && (boxList[0].style.display = "table");
            boxList[1] && (boxList[1].style.display = "none");
        });
        return;
    }
    /** 解析键盘key */
    async decodeBoard_Key(data, keyName) {
        if (!data.VIEW_RECT) {
            return;
        }
        let rect = data.VIEW_RECT.split(",");
        let rectX = Number(rect[0]);
        let rectY = Number(rect[1]);
        let rectW = Number(rect[2]);
        let rectH = Number(rect[3]);
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = `${rectX}px`;
        div.style.top = `${rectY}px`;
        div.style.width = `${rectW}px`;
        div.style.height = `${rectH}px`;
        div.style.textAlign = "center";
        let handlerDiv = document.createElement("div");
        if (data.BACK_STYLE) {
            await this.decodeBoard_ImgStyle({ viewRectW: rectW, viewRectH: rectH, w: rectW, h: rectH, div, style: data.BACK_STYLE, handlerDiv, keyName, isBack: true });
        }
        if (data.FORE_STYLE) {
            let pos = (data.POS_TYPE || "").split(",");
            let list = data.FORE_STYLE.split(',');
            for (let i = 0; i < list.length; i++) {
                await this.decodeBoard_ImgStyle({ viewRectW: rectW, viewRectH: rectH, div, style: list[i], pos_Type: pos[i], handlerDiv, keyName });
            }
        }
        // div.style.background = "red"
        this.phoneBoardDiv.append(div);
        handlerDiv.style.position = "absolute";
        handlerDiv.style.left = `${rect[0]}px`;
        handlerDiv.style.top = `${rect[1]}px`;
        handlerDiv.style.width = `${rect[2]}px`;
        handlerDiv.style.height = `${rect[3]}px`;
        this.phoneBoardDiv.append(handlerDiv);
        handlerDiv.addEventListener("click", () => {
            this.dispatchKeyEvent({ key: keyName, dom: div, handlerDom: handlerDiv, type: "key" });
        });
        handlerDiv.dispatchEvent(new Event("mouseleave"));
        this.keyDomList[keyName] = {
            name: keyName, dom: div, handlerDom: handlerDiv, type: "key"
        };
        this.setKeySelectHL(keyName, handlerDiv);
    }
    initCmdDiv() {
        switch (this.op.opSwitchKey) {
            case "list":
                this.createBoardListDom();
                break;
            case "key":
                if (this.op.selectSingleType == "key") {
                    this.createBoardSingleKeyDom();
                }
                else if (this.op.selectSingleType == "icon") {
                    this.createBoardSingleIconDom();
                }
                break;
            case "multiKey":
                this.createBoardMultiKeyListDom();
                break;
        }
    }
}
class JMain {
    /** 样式路径 */
    get cssUrl() {
        return `${this.op.dirBase}/${this.op.cssDir}/${this.op.cssName}`;
    }
    /** 键盘路径 */
    get boardUrl() {
        return `${this.op.dirBase}/${this.op.boardDir}/${this.op.boardName}`;
    }
    /** 资料路径 */
    get genUrl() {
        return `${this.op.dirBase}/${this.op.boardDir}/${this.op.genName}`;
    }
    /** 候选框路径 */
    get candUrl() {
        return `${this.op.dirBase}/${this.op.boardDir}/${this.op.candName}.cnd`;
    }
    /** 冒泡路径 */
    get hintUrl() {
        return `${this.op.dirBase}/${this.op.boardDir}/${this.op.hintName}.pop`;
    }
    constructor() {
        /** 手机配置key,用于保存 */
        this.phoneOPKey = "phoneOP";
        /** 配置 */
        this.op = {
            /** 缩放 */
            phoneScale: 0.3,
            /** 手机宽度 */
            phoneWidth: 1414,
            /** 手机高度 */
            phoneHeight: 2160,
            /** 基础文件夹 */
            dirBase: "./public",
            /** 资源文件夹 */
            resDir: "res",
            /** 样式文件夹 */
            cssDir: "res",
            /** 样式表名 */
            cssName: "default.css",
            /** 键盘文件夹 */
            boardDir: "port",
            /** 键盘表名 */
            boardName: "py_9.ini",
            /** 资料名 */
            genName: "gen.ini",
            /** 是否在有候选字时显示 */
            isPersist: false,
            /** 配置切换key */
            opSwitchKey: "list",
            /** 单选key */
            selectSingleKey: "",
            selectSingleType: "key",
            /** 多选键 */
            selectMultiKeyList: [],
            /** 多选自加 */
            multiAdd: "1,1,1,1",
            /** 选中高亮key颜色 */
            selecthlKeyColor: "#00ff00",
            /** 候选框名,这个不能更改,只能由其他数据决定 */
            candName: null,
            /** 冒泡名,这个不能更改,只能由其他数据决定 */
            hintName: null
        };
        /** 图片数据 */
        this.imageData = {};
        /** 键盘元素集合 */
        this.keyDomList = {};
        this.init();
    }
}
class JOPDiv {
    /** 创建配置div */
    createOPDiv() {
        this.createScaleDiv();
        this.createSelectHLKeyDiv();
        this.createCandSelectDiv();
        let btnDiv = document.createElement("button");
        btnDiv.setAttribute("class", "btnDiv");
        let btnList = [
            {
                name: "单键设置", func: () => {
                    this.op.opSwitchKey = "key";
                    this.op.selectSingleKey = "";
                    this.saveOPJson();
                    new JMain();
                }
            },
            {
                name: "多键设置", func: () => {
                    this.op.opSwitchKey = "multiKey";
                    this.op.selectSingleKey = "";
                    this.op.selectMultiKeyList = [];
                    this.saveOPJson();
                    new JMain();
                }
            },
            {
                name: "列表设置", func: () => {
                    this.op.opSwitchKey = "list";
                    this.saveOPJson();
                    new JMain();
                }
            },
            {
                name: "强制保存", func: () => {
                    this.saveOPJson();
                    saveJson(this.cssUrl, this.cssData);
                    saveJson(this.genUrl, this.genData);
                    saveJson(this.candUrl, this.candData);
                    saveJson(this.hintUrl, this.hintData);
                    saveJson(this.boardUrl, this.boardData);
                    console.log("保存成功");
                }
            },
            {
                name: "清空缓存", func: () => {
                    localStorage.clear();
                }
            },
            {
                name: "重载", func: () => {
                    new JMain();
                }
            }
        ];
        for (let i = 0; i < btnList.length; i++) {
            let c = btnList[i];
            let btn = document.createElement("button");
            btn.innerHTML = c.name;
            btn.onclick = c.func;
            btnDiv.append(btn);
            btn.setAttribute("class", "opBtn");
        }
        this.phoneOPDiv.append(btnDiv);
    }
    /** 创建候选框选择div */
    createCandSelectDiv() {
        let div = document.createElement("div");
        let p = document.createElement("label");
        p.innerHTML = "候选框切换:";
        let input = document.createElement("input");
        input.type = "checkbox";
        input.checked = this.op.isPersist;
        input.addEventListener("change", () => {
            this.op.isPersist = input.checked;
            this.saveOPJson();
            new JMain();
        });
        div.append(p, input);
        this.phoneOPDiv.append(div);
    }
    /** 创建多选高亮色的div */
    createSelectHLKeyDiv() {
        let div = document.createElement("div");
        let p = document.createElement("label");
        p.innerHTML = "多选高亮色:";
        let input = document.createElement("input");
        let colorInput = document.createElement("input");
        input.value = this.op.selecthlKeyColor;
        input.addEventListener("change", () => {
            this.op.selecthlKeyColor = input.value;
            colorInput.value = input.value;
            this.saveOPJson();
            this.reFreshPhoneSkin();
        });
        colorInput.value = input.value;
        colorInput.type = "color";
        colorInput.addEventListener("change", () => {
            this.op.selecthlKeyColor = colorInput.value;
            input.value = colorInput.value;
            this.saveOPJson();
            this.reFreshPhoneSkin();
        });
        div.append(p, input, colorInput);
        this.phoneOPDiv.append(div);
    }
    /** 创建缩放div */
    createScaleDiv() {
        let div = document.createElement("div");
        div.setAttribute("class", "scaleDiv");
        let p = document.createElement("label");
        p.innerHTML = "缩放倍数:";
        let scroll = document.createElement("input");
        scroll.setAttribute("type", "range");
        scroll.min = (0.003).toString();
        scroll.max = (2).toString();
        scroll.step = (0.01).toString();
        scroll.value = this.op.phoneScale.toString();
        let input = document.createElement("input");
        input.value = this.op.phoneScale.toString();
        input.style.width = 100 + 'px';
        scroll.addEventListener("input", (e) => {
            input.value = scroll.value;
            let oldScale = this.op.phoneScale;
            this.op.phoneScale = Number(scroll.value);
            this.op.phoneWidth *= oldScale / this.op.phoneScale;
            this.op.phoneHeight *= oldScale / this.op.phoneScale;
            this.setPhoneDivSize();
            this.setMoveDivPos();
            this.saveOPJson();
        });
        input.addEventListener("change", (e) => {
            scroll.value = input.value;
            let oldScale = this.op.phoneScale;
            this.op.phoneScale = Number(scroll.value);
            this.op.phoneWidth *= oldScale / this.op.phoneScale;
            this.op.phoneHeight *= oldScale / this.op.phoneScale;
            this.setPhoneDivSize();
            this.setMoveDivPos();
            this.saveOPJson();
        });
        div.append(p, scroll, input);
        this.phoneOPDiv.append(div);
    }
    /** 创建文件div */
    creatFileDiv() {
        this.createChildFileDiv({ title: "基础文件夹:", getUrlFn: () => { return this.op.dirBase; }, value: this.op.dirBase, inputFunc: (s) => { this.op.dirBase = s; } });
        this.createChildFileDiv({ title: "资源文件夹:", getUrlFn: () => { return `${this.op.dirBase}/${this.op.resDir}`; }, value: this.op.resDir, inputFunc: (s) => { this.op.resDir = s; } });
        this.createChildFileDiv({ title: "键盘文件夹:", getUrlFn: () => { return `${this.op.dirBase}/${this.op.boardDir}`; }, value: this.op.boardDir, inputFunc: (s) => { this.op.boardDir = s; } });
        this.createChildFileDiv({ title: "样式文件夹:", getUrlFn: () => { return `${this.op.dirBase}/${this.op.cssDir}`; }, value: this.op.cssDir, inputFunc: (s) => { this.op.cssDir = s; } });
        this.createChildFileDiv({ title: "样式表名:", getUrlFn: () => { return this.cssUrl; }, value: this.op.cssName, inputFunc: (s) => { this.op.cssName = s; }, downloadData: () => { return this.cssData; } });
        this.createChildFileDiv({ title: "键盘表名:", getUrlFn: () => { return this.boardUrl; }, value: this.op.boardName, inputFunc: (s) => { this.op.boardName = s; }, downloadData: () => { return this.boardData; } });
        this.createChildFileDiv({ title: "配置名:", getUrlFn: () => { return this.genUrl; }, value: this.op.genName, inputFunc: (s) => { this.op.genName = s; }, downloadData: () => { return this.genData; } });
        this.createChildFileDiv({ title: "候选框名:", getUrlFn: () => { return this.candUrl; }, value: this.op.candName, isOnlyRead: true, downloadData: () => { return this.candData; }, exName: ".cnd" });
        this.createChildFileDiv({
            title: "冒泡名:", getUrlFn: () => { return this.hintUrl; }, value: this.op.hintName, isOnlyRead: true, downloadData: () => {
                return this.hintData;
            }, exName: ".ini"
        });
        const label = document.createElement("label");
        label.innerHTML = "总操作:";
        const saveBtn = document.createElement("button");
        saveBtn.innerHTML = '保存修改文件zip';
        saveBtn.addEventListener("click", () => {
            const keys = Object.keys(localStorage);
            //@ts-expect-error
            const zip = new JSZip();
            for (let key of keys) {
                if (key.startsWith(this.op.dirBase)) {
                    zip.file(key, jsonToIni(JSON.parse(localStorage[key])));
                }
            }
            zip.generateAsync({ type: "blob" }).then(function (content) {
                const formatter = new Intl.DateTimeFormat('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                //@ts-expect-error
                saveAs(content, formatter.format(new Date()) + ".zip");
            });
        });
        this.phoneFileDiv.append(label, saveBtn);
    }
    /** 创建单个文件div */
    createChildFileDiv(op) {
        let div = document.createElement("div");
        div.setAttribute("class", "phoneChildFile");
        let p = document.createElement("label");
        p.innerHTML = op.title;
        let input = document.createElement("input");
        input.value = op.value;
        let isChange = false;
        input.addEventListener("change", (e) => {
            isChange = true;
        });
        div.append(p, input);
        if (!op.isOnlyRead) {
            let loadBtn = document.createElement("button");
            loadBtn.innerHTML = "加载";
            loadBtn.onclick = () => {
                if (!isChange) {
                    alert("没有任何修改,不用加载");
                    return;
                }
                op.inputFunc(input.value);
                this.saveOPJson();
                new JMain();
            };
            div.append(loadBtn);
        }
        else {
            input.disabled = true;
        }
        if (op.downloadData) {
            let downloadBtn = document.createElement("button");
            downloadBtn.innerHTML = "下载";
            downloadBtn.onclick = () => {
                console.log("下载");
                let str = jsonToIni(op.downloadData());
                saveStrFile(str, op.value + `${op?.exName || ""}`);
            };
            div.append(downloadBtn);
            const copyBtn = document.createElement("button");
            copyBtn.innerHTML = "复制文本";
            copyBtn.onclick = () => {
                let str = jsonToIni(op.downloadData());
                copyStr(str);
            };
            div.append(copyBtn);
            const deleteCacheBtn = document.createElement("button");
            deleteCacheBtn.innerHTML = "删除缓存";
            deleteCacheBtn.onclick = () => {
                localStorage.removeItem(op.getUrlFn());
                location.reload();
                alert("删除成功");
            };
            div.append(deleteCacheBtn);
            let readBtn = document.createElement("button");
            readBtn.innerHTML = "查看";
            readBtn.onclick = () => {
                let str = jsonToIni(op.downloadData());
                console.log(str);
            };
            div.append(readBtn);
        }
        this.phoneFileDiv.append(div);
    }
}
/** 创建样式的元素 */
function createStyleDom(op) {
    let div = document.createElement("div");
    let styleName = `STYLE${op.styleCount}`;
    if (!this.cssData[styleName]) {
        let check = window.confirm(`样式 ${styleName} 数据并不存在,需要创建吗`);
        if (check) {
            this.cssData[styleName] = {};
            let g = this.cssData["GLOBAL"];
            g.STYLE_NUM = (Number(g.STYLE_NUM) + 1).toString();
            saveJson(this.cssUrl, this.cssData);
            return this.createStyleDom({ styleCount: op.styleCount });
        }
        return;
    }
    let list = [
        {
            key: "NM_IMG",
            title: "普通状态切片",
            tip: `格式：NM_IMG=素材名,切片序号\n注：素材名不写后缀.png,也可认为是切片名,同理\nNM_IMG=fore1,3`
        },
        {
            key: "HL_IMG",
            title: "高亮状态切片",
            tip: `格式：HL_IMG=素材名,切片序号\n注：素材名不写后缀.png,也可认为是切片名,同理.\nHL_IMG=fore1,4`
        },
        {
            key: "NM_COLOR",
            title: "普通状态颜色",
            tip: "NM_COLOR=1557a4",
            type: "color"
        },
        {
            key: "HL_COLOR",
            title: "高亮状态颜色",
            tip: "HL_COLOR=FFFFFF",
            type: "color"
        },
        {
            key: "BORDER_COLOR",
            title: "边框颜色",
            tip: "BORDER_COLOR=FFFFFF",
            type: "color"
        },
        {
            key: "BORDER_SIZE",
            title: "边框的粗细",
            tip: "(4.1 版+文字前景,特指下阴影) \nBORDER_SIZE=4"
        },
        {
            key: "SHOW",
            title: "按键前景显示的文字"
        },
        {
            key: "FONT_NAME",
            title: "字体名称",
            tip: "（优化搜搜皮肤自带字体）\nFONT_NAME=luoli.ttf"
        },
        {
            key: "FONT_SIZE",
            title: "默认字体大小"
        },
        {
            key: "FONT_WEIGHT",
            title: "默认字体宽度",
        },
        {
            title: "复制样式",
            type: "fn",
            fn: (v) => {
                let otherStyleName = `STYLE${v}`;
                if (!this.cssData[otherStyleName]) {
                    let g = this.cssData["GLOBAL"];
                    g.STYLE_NUM = (Number(g.STYLE_NUM) + 1).toString();
                }
                this.cssData[otherStyleName] = JSON.parse(JSON.stringify(this.cssData[styleName]));
                saveJson(this.cssUrl, this.cssData);
                new JMain();
            }
        }
    ];
    for (let i = 0; i < list.length; i++) {
        let childDiv = this.createChildDom({ data: list[i], type: styleName, baseData: this.cssData, saveUrl: this.cssUrl });
        div.append(childDiv);
    }
    return div;
}
/** 创建偏移的元素 */
function createOffsetDom(op) {
    let div = document.createElement("div");
    let offsetName = `OFFSET${op.offsetCount}`;
    if (!this.genData[offsetName]) {
        let check = window.confirm(`偏移 ${offsetName} 数据并不存在,需要创建吗`);
        if (check) {
            this.genData[offsetName] = {};
            let g = this.genData["PANEL"];
            g.OFFSET_NUM = (Number(g.OFFSET_NUM) + 1).toString();
            saveJson(this.genUrl, this.genData);
            return this.createOffsetDom({ offsetCount: op.offsetCount });
        }
        return;
    }
    let list = [
        { key: "POS", title: "偏移坐标:", tip: "自身矩阵中心点相对目标矩阵中心点的偏移量.（针对按键前景生效）目标矩阵的中心点：按键的正中心在主面板调用时,由属性 POS_TYPE 调用\n自身矩阵中心点相对目标矩阵中心点的偏移量.（针对按键前景生效）目标矩阵的中心点：按键的正中心" }
    ];
    for (let i = 0; i < list.length; i++) {
        let childDiv = this.createChildDom({ data: list[i], type: offsetName, baseData: this.genData, saveUrl: this.genUrl });
        div.append(childDiv);
    }
    return div;
}
/** ini转json */
function iniToJson(data) {
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/\r\n|\r|\n/);
    var section = null;
    lines.forEach(function (line) {
        if (!line) {
            return;
        }
        else if (regex.comment.test(line)) {
            return;
        }
        else if (regex.param.test(line)) {
            var match = line.match(regex.param);
            if (section) {
                value[section][match[1]] = match[2];
            }
            else {
                value[match[1]] = match[2];
            }
        }
        else if (regex.section.test(line)) {
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }
        else if (line.length == 0 && section) {
            section = null;
        }
        ;
    });
    return value;
}
/** json转ini */
function jsonToIni(data) {
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
async function getIniFileData(url) {
    let str = await fetch(url).then(res => res.text());
    let val = iniToJson(str);
    return val;
}
async function getImageDataB64(url) {
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
async function getTilImageB64(b64, x, y, w, h) {
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
function saveJson(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
/** 读取json */
function loadJson(key) {
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
function saveStrFile(text, fileName) {
    var blob = new Blob([text]);
    saveBlobFile(blob, fileName);
}
function copyStr(text) {
    navigator.clipboard.writeText(text);
}
/**
   * 保存二进制文件
   * @param blob 二进制内容
   * @param fileName 保存的文件名
   */
function saveBlobFile(blob, fileName) {
    saveBase64File(window.URL.createObjectURL(blob), fileName);
}
/**
   * 保存base64文件
   * @param base64 base64字符串内容
   * @param fileName 保存的文件名
   */
function saveBase64File(base64, fileName) {
    let a = document.createElement("a");
    a.href = base64;
    a.download = fileName;
    a.click();
}
console.log("hello");
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}
function applyFuncs(derivedCtor, baseCtors) {
    baseCtors.forEach(c => {
        c.name;
        derivedCtor.prototype[c.name] = c;
    });
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}
applyMixins(JMain, [JFlow, JAction, JOPDiv, JBoardChildDom]);
applyFuncs(JMain, [createChildDom, createStyleDom, createOffsetDom]);
new JMain();
//# sourceMappingURL=index.js.map