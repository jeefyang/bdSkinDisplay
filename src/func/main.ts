class JMain {

    /** 移动模块div */
    moveDiv: HTMLDivElement;
    /** 总操作div */
    cmdDiv: HTMLDivElement;
    /** 手机div */
    phoneDiv: HTMLDivElement;
    /** 手机候选栏div */
    phoneCandDiv: HTMLDivElement;
    /** 手机键盘div */
    phoneBoardDiv: HTMLDivElement;
    /** 手机数据操作div */
    phoneCmdDiv: HTMLDivElement;
    /** 手机配置div */
    phoneOPDiv: HTMLDivElement;
    /** 手机文件div */
    phoneFileDiv: HTMLDivElement;
    /** 手机配置key,用于保存 */
    phoneOPKey = "phoneOP";
    /** 配置 */
    op = {
        /** 缩放 */
        phoneScale: 0.3,
        /** 皮肤框右距边距 */
        skinBoxMarginRight: 10,
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
        /** 当前状态 */
        curStatus: "",
        /** 按键是否切换状态模式 */
        isStatus: false,
        /** 配置切换key */
        opSwitchKey: <"list" | "key" | "multiKey" | "cand">"list",
        /** 单选key */
        selectSingleKey: "",
        selectSingleType: <"icon" | "key">"key",
        /** 多选键 */
        selectMultiKeyList: <string[]>[],
        /** 多选自加 */
        multiAdd: <string>"1,1,1,1",
        /** 选中高亮key颜色 */
        selecthlKeyColor: "#00ff00",
        /** 候选框名,这个不能更改,只能由其他数据决定 */
        candName: <string>null,
        /** 冒泡名,这个不能更改,只能由其他数据决定 */
        hintName: <string>null
    };

    /** 样式数据 */
    cssData: any;
    /** 键盘数据 */
    boardData: any;
    /** 资料数据 */
    genData: any;
    /** 候选框数据 */
    candData: any;
    /** 冒泡数据 */
    hintData: any;
    /** 图片数据 */
    imageData: {
        [propName: string]: JImgData;
    } = {};
    /** 键盘元素集合 */
    keyDomList: { [propName: string]: { name: string, dom: HTMLElement, handlerDom: HTMLElement, type: "key" | "icon"; }; } = {};

    /** 状态描述列表 */
    readonly statusDescList: { v: string, d: string; }[] = [
        { v: "S1", d: "英文首字母大写" },
        { v: "S2", d: "英文锁定大写" },
        { v: "S3", d: "英文联想状态（默认状态是无联想,无需补丁）" },
        { v: "S4", d: "有输入码状态（默认是无输入码状态,无需补丁）" },
        { v: "S5", d: "中文更多候选字单字状态（默认为全部状态无补丁）" },
        { v: "S6", d: "符号面板锁定状态（默认是无锁定状态,不需补丁）" },
        { v: "S7", d: "翻页面板(sel_cn,sel_en,symbol)处于页顶" },
        { v: "S8", d: "翻页面板(sel_cn,sel_en,symbol)处于页底" },
        { v: "S9", d: "当前是否是中文联想状态" },
        { v: "S10", d: "当前输入码中存在模糊输入（默认为不满足条件,无补丁）" },
        { v: "S11", d: "当前输入码都是精确输入（默认为不满足条件,无补丁） " },
        { v: "S12", d: "当前的输入语言类型是英文（默认为非英文状态,无补丁）" },
        { v: "S13", d: "当前有多媒体输入结果上屏(默认为无上屏,无)" },
        { v: "S14", d: "当前是否是中文下的临时英文输入状态(默认为非,无补丁) " },
        { v: "S16", d: "表单不可跳转至下一项 " },
        { v: "S17", d: "表单可以跳转至下一项" },
        { v: "S18", d: "表单不可提交" },
        { v: "S19", d: "表单可以提交" },
        { v: "S20", d: "搜索框不可进行搜索" },
        { v: "S21", d: "搜索框可以进行搜索" },
        { v: "S22", d: "页面跳转行为输入框不可跳转" },
        { v: "S23", d: "页面跳转行为输入框可以跳转" },
        { v: "S24", d: "用于加入特殊环境的输入框不满足条件" },
    ];

    /** 快捷键描述列表 */
    readonly shortKeyDescList: { v: string, d: string; }[] = [
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
        this.init();
    }

    /** 获取最终的key */
    getFinalKey(key: string) {
        if (!this.op.isStatus || !this.op.curStatus) {
            return key;
        }
        // 键盘按钮
        if (key.startsWith("KEY")) {
            const c: BoardKeyType = this.boardData[key];
            if (!c.STAT_STYLE) {
                return key;
            }
            const list = c.STAT_STYLE.split('|');
            for (let i = 0; i < list.length; i++) {
                if (!list[i].startsWith(this.op.curStatus)) {
                    continue;
                }
                const newKey = 'TIP' + list[i].split('_')[1];
                return this.boardData[newKey] ? newKey : key;
            }
        }
        // 候选框
        else if (key.startsWith("ICON")) {
            const c: CndIconType = this.candData[key];
            if (!c.STAT_STYLE) {
                return key;
            }
            const list = c.STAT_STYLE.split('|');
            for (let i = 0; i < list.length; i++) {
                if (!list[i].startsWith(this.op.curStatus)) {
                    continue;
                }
                const newKey = 'TIP' + list[i].split('_')[1];
                return this.candData[newKey] ? newKey : key;
            }
        }
        return key;
    }

}