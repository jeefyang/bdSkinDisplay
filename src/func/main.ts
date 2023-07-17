class JMain {

    /** 移动模块div */
    moveDiv: HTMLDivElement
    /** 总操作div */
    cmdDiv: HTMLDivElement
    /** 手机div */
    phoneDiv: HTMLDivElement
    /** 手机候选栏div */
    phoneCandDiv: HTMLDivElement
    /** 手机键盘div */
    phoneBoardDiv: HTMLDivElement
    /** 手机数据操作div */
    phoneCmdDiv: HTMLDivElement
    /** 手机配置div */
    phoneOPDiv: HTMLDivElement
    /** 手机文件div */
    phoneFileDiv: HTMLDivElement
    /** 手机配置key,用于保存 */
    phoneOPKey = "phoneOP"
    /** 配置 */
    op = {
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
        opSwitchKey: <"list" | "key" | "multiKey">"list",
        /** 单选key */
        selectSingleKey: "",
        selectSingleType: <"icon" | "key">"key",
        /** 多选键 */
        selectMultiKeyList: <string[]>[],
        /** 多选自加 */
        multiAdd: <string>"1,1,1,1",
        /** 选中高亮key颜色 */
        selecthlKeyColor: "#00ff00"
    }
    /** 候选框名 */
    candName: string = null
    /** 样式数据 */
    cssData: any
    /** 键盘数据 */
    boardData: any
    /** 资料数据 */
    genData: any
    /** 候选框数据 */
    candData: any
    /** 图片数据 */
    imageData: {
        [propName: string]: JImgData
    } = {}
    /** 键盘元素集合 */
    keyDomList: { [propName: string]: { name: string, dom: HTMLElement, handlerDom: HTMLElement, type: "key" | "icon" } } = {}


    /** 样式路径 */
    get cssUrl() {
        return `${this.op.dirBase}/${this.op.resDir}/${this.op.cssName}`
    }

    /** 键盘路径 */
    get boardUrl() {
        return `${this.op.dirBase}/${this.op.boardDir}/${this.op.boardName}`
    }

    /** 资料路径 */
    get genUrl() {
        return `${this.op.dirBase}/${this.op.boardDir}/${this.op.genName}`
    }

    /** 候选框路径 */
    get candUrl() {
        return `${this.op.dirBase}/${this.op.boardDir}/${this.candName}.cnd`
    }

    constructor() {
        this.init()
    }

}