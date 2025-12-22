class JBoardChildDom {

    /** 创建列表模式下元素 */
    createBoardListDom(this: JMain) {
        this.phoneCmdDiv.innerHTML = "";
        const type = "LIST";
        if (!this.boardData[type]) {
            return;
        }

        const title = document.createElement("h3");
        title.innerHTML = "列表数据";
        title.style.textAlign = "center";
        this.phoneCmdDiv.append(title);
        let inputList: childDomType<keyof BoardListType>[] = [
            { key: "BACK_STYLE", title: "列表背景边框样式:", tip: "只能一个", type: "style" },
            { key: "CELL_STYLE", title: "列表单元格样式:", tip: "", type: "style" },
            { key: "FORE_STYLE", title: "列表内文字显示样式:", tip: "", type: "style" },
            { key: "SCROLL_STYLE", title: "滚动条需要的混合颜色样式:", tip: "", type: "style" },
            { key: "CELL_SIZE", title: "单元格的宽和高:", tip: "" },
            {
                key: "POS", title: "列表起始位置 X,Y:", tip:
                    `POS=2,2\n在 PANAL 面板的（2,2）处绘制\nLIST`
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
殊功能后,LIST 将不再允许添加列表项（新版）`},
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

    /** 创建候选模式下元素 */
    createBoradCandDom(this: JMain) {
        this.phoneCmdDiv.innerHTML = "";
        const type = "CAND";
        if (!this.boardData[type]) {
            return;
        }

        const title = document.createElement("h3");
        title.innerHTML = "候选框数据";
        title.style.textAlign = "center";
        this.phoneCmdDiv.append(title);
        let inputList: childDomType<keyof CndCandType>[] = [
            { key: "BACK_STYLE", title: "候选栏背景样式:", tip: "只能一个", type: "style" },
            { key: "FORE_STYLE", title: "候选字前景样式:", tip: "候选字字体,颜色样式", type: "style" },
            { key: "CELL_STYLE", title: "候选条单元格样式:", tip: "分隔线,按下效果通过这个参数实现", type: "style" },
            {
                key: "PADDING", title: "候选内容显示与外边框的间距:", tip: `
                4 个值分别代表示左边距,上边距,右边距,下边距\n@example PADDING=0,0,65,0 表示候选内容与外边框间距为：左边距 0,上边距 0,右边距 65,下边距 0,用于给 ICON留空间放置或优化候选内容显示
                `
            },
            { key: "FIRST_GAP", title: "第一个候选字比其它候选字多的间隔:", tip: `第一个候选字仍距中显示` },
            {
                key: "FIRST_FORE", title: "第一个候选字前景（字体及颜色）样式:", tip: ``
            },
            {
                key: "FIRST_BACK", title: "第一个候选字背景样式:", tip: ``
            },
            {
                key: "ICON_NUM", title: "图标的数量:", tip: ``
            },
            {
                key: "CELL_W", title: "候选字间距:", tip: ``
            },
            {
                key: "MORE_W", title: "进入更多候选字的按钮空间:", tip: `为 0 则不需要此键`
            },
            {
                key: "TIP_NUM", title: "补丁数量:", tip: `注：CAND 中的 ICON 同样支持状态补丁`
            }
        ];
        for (let i = 0; i < inputList.length; i++) {
            let div = this.createChildDom({ data: inputList[i], baseData: this.candData, saveUrl: this.candUrl, type: type });
            if (!div) {
                continue;
            }
            this.phoneCmdDiv.append(div, document.createElement('br'));
        }
    }

    /** 创建单键模式下按键元素 */
    createBoardSingleKeyDom(this: JMain) {
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
                    let p: BoardPanelType = this.boardData["PANAL"];
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
        const curKeyLabel = document.createElement("label");
        curKeyLabel.innerHTML = "当前按键:" + this.getFinalKey(this.op.selectSingleKey);
        titleDiv.append(titleDiv_Label, titleDiv_Input, curKeyLabel);
        this.phoneCmdDiv.append(titleDiv);
        let inputList: childDomType<keyof BoardKeyType>[] = [
            { key: "BACK_STYLE", title: "按键背景指定样式:", type: "style" },
            { key: "FORE_STYLE", title: "按键前景指定样式:", tip: "允许多个前景,前景间用英文逗号分隔\nFORE_STYLE=1,88,200\n表示此键有 1,88,200 三个前景", type: "style" },
            { key: "POS_TYPE", title: "偏移:", tip: "此参数和前景对应,一个参数对应一个前景,同样以英文逗号分隔,表示前景的偏移类型,序号和 gen.ini 中的[OFFSET*]的序号对应,如果无对应值则为 0,表示不偏移,居中对齐(下面的表格会提到 OFFSET 属性,已用阴影填充加强显示)\nFORE_STYLE=1,88,200\nPOS_TYPE=0,2,10\n表示前景 1,距中显示；前景 88 使用2 号偏移；前景 200 使用 10 号偏移（序号由 gen.ini 生成）", type: "offset" },
            { key: "VIEW_RECT", title: "坐标:", tip: "按键绘制时的坐标 X,Y 及宽 W,高 H\nVIEW_RECT=45,3,60,70\n在 PANAL 面板(45,3)处绘制一个宽60 高 70 的键", isNotTipAttr: true },
            { key: "TOUCH_RECT", title: "按键点击范围补丁:", tip: "控制该键的实际点击位置X,Y 和宽 W,高 H\n当 TOUCH_RECT=0,0,0,0 或宽,高为 0 时,表示此键不可点击（常用做背景显示功能）\nVIEW_RECT=45,3,60,70\nTOUCH_RECT=43,0,66,72\n表示此键的实际点击范围是(43,0)处宽 66 高 72 的矩阵." },
            { key: "UP", title: "向上划:", type: "key" },
            { key: "DOWN", title: "向下划:", type: "key" },
            { key: "LEFT", title: "向左划:", type: "key" },
            { key: "RIGHT", title: "向右划:", type: "key" },
            { key: "CENTER", title: "直接点击:", type: "key" },
            { key: "SHOW", title: "直接点击后传给内核的键值:", tip: "SHOW 的作用：向内核反馈点击此键后的键值,供内核判断该键类型.能在输入码上回馈键值." },
            { key: "HOLD", title: "长按:", tip: "长按后对应的字符或功能\n注：HOLD 与 HOLDSYM 不能共存,两者只能选一个.\n当一个键没有 HOLD 和 HOLDSYM 属性时,默认按住效是弹出的气泡显示该键的所有字符.\nHOLD=F1\n按住为 F1 打开符号面板\n注：HOLD=字符时,此字符会参与输入码." },
            { key: "HOLDSYM", title: "长按后对应的字符集:", tip: "（字符之间无分隔符）,以字符形式直接输出\n注：HOLD 与 HOLDSYM 不能共存,两者只能选一个.\n当一个键没有 HOLD 和 HOLDSYM 属性时,默认按住效是弹出的气泡显示该键的所有字符.\nHOLDSYM=ABCD@#\n表示长按对应的字符集是 ABCD@#\n然后通过手势选择字符,字符间无间隔.\n当 HOLDSYM=单字符时,表示此字符直接上屏." },
            { key: "STAT_STYLE", title: "针对特殊状态时的显示及样式及功能:", tip: "（状态补丁）\nS 代表状态类型,_后的数字表示 TIP 序号\n（详见 S 状态定义）\n当有多个状态时,状态之间用“|”间隔\nSTAT_STYLE=S4_1|S14_2\n表示 S4（有输入码状态）时,执行[TIP1]补丁,使该键在显示或功能上发生改变.在 S14（中文临时英文输入状态）时,执行[TIP2]", type: "speicalKey", isNotTipAttr: true },
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
    createBoardSingleIconDom(this: JMain) {
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
                    let p: CndCandType = this.candData["CAND"];
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
        const curKeyLabel = document.createElement("label");
        curKeyLabel.innerHTML = "当前按键:" + this.getFinalKey(this.op.selectSingleKey);
        titleDiv.append(titleDiv_Label, titleDiv_Input, curKeyLabel);
        this.phoneCmdDiv.append(titleDiv);
        if (!this.op.selectSingleKey) {
            return;
        }
        let inputList: childDomType<keyof CndIconType>[] = [
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
            { key: "STAT_STYLE", title: "状态补丁:", tip: "针对特殊状态时的显示及样式及功能\nS 代表状态类型,_后的数字表示 TIP序号（详见 S 状态定义）\n当有多个状态时,状态之间用“|”间隔\nSTAT_STYLE=S9_1\n当处在 S9（中文联想状态）时,执行[TIP1]", type: "speicalKey", isNotTipAttr: true }
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
    createBoardMultiKeyListDom(this: JMain) {
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
                    let keyData: BoardKeyType = this.boardData[key];
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