/** 创建样式的元素 */
function createStyleDom(this: JMain, op: {
    styleCount: string
}) {
    let div = document.createElement("div")
    let styleName = `STYLE${op.styleCount}`
    if (!this.cssData[styleName]) {
        let check = window.confirm(`样式 ${styleName} 数据并不存在,需要创建吗`)
        if (check) {
            this.cssData[styleName] = {}
            let g: CssGlobalType = this.cssData["GLOBAL"]
            g.STYLE_NUM = (Number(g.STYLE_NUM) + 1).toString()
            saveJson(this.cssUrl, this.cssData)
            return this.createStyleDom({ styleCount: op.styleCount })
        }
        return
    }
    let list: childDomType<keyof CssStyleType>[] = [
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
        }
    ]
    for (let i = 0; i < list.length; i++) {
        let childDiv = this.createChildDom({ data: list[i], type: styleName, baseData: this.cssData, saveUrl: this.cssUrl })
        div.append(childDiv)
    }
    return div
}

/** 创建偏移的元素 */
function createOffsetDom(this: JMain, op: {
    offsetCount: string
}) {
    let div = document.createElement("div")
    let offsetName = `OFFSET${op.offsetCount}`
    if (!this.genData[offsetName]) {
        let check = window.confirm(`偏移 ${offsetName} 数据并不存在,需要创建吗`)
        if (check) {
            this.genData[offsetName] = {}
            let g: BoardPanelType = this.genData["PANEL"]
            g.OFFSET_NUM = (Number(g.OFFSET_NUM) + 1).toString()
            saveJson(this.genUrl, this.genData)
            return this.createOffsetDom({ offsetCount: op.offsetCount })
        }
        return
    }
    let list: childDomType<keyof BoardOffsetType>[] = [
        { key: "POS", title: "偏移坐标:", tip: "自身矩阵中心点相对目标矩阵中心点的偏移量.（针对按键前景生效）目标矩阵的中心点：按键的正中心在主面板调用时,由属性 POS_TYPE 调用\n自身矩阵中心点相对目标矩阵中心点的偏移量.（针对按键前景生效）目标矩阵的中心点：按键的正中心" }
    ]
    for (let i = 0; i < list.length; i++) {
        let childDiv = this.createChildDom({ data: list[i], type: offsetName, baseData: this.genData, saveUrl: this.genUrl })
        div.append(childDiv)
    }
    return div
}