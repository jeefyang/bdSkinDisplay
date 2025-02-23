type childDomType<K extends string = string> = {
    key?: K
    type?: "normal" | "select" | "style" | "color" | "offset" | "key" | "fn"
    title: string
    tip?: string
    fn?: (v: string) => void
    select?: { name: string, value: string }[]
}

/** 创建子元素 */
function createChildDom<K extends string = string>(this: JMain, op: {
    data: childDomType<K>,
    baseData: any
    type: string
    saveUrl: string
}) {
    if (!op.type) {
        return
    }
    if (!op.data.type) {
        op.data.type = "normal"
    }
    let styleOrOffsetDiv: HTMLDivElement = document.createElement("div")
    let div = document.createElement("div")
    let p = document.createElement("label")
    p.title = op.data.key
    p.innerHTML = op.data.title
    div.append(p)
    let styleBtnDiv: HTMLDivElement
    let offsetBtnDiv: HTMLDivElement
    let styleFunc = (v: string) => {
        styleBtnDiv.innerHTML = ""
        let styleList = v.split(",")
        let curStyleName: string = ""
        for (let i = 0; i < styleList.length; i++) {
            if (!styleList[i]) {
                continue
            }
            let btn = document.createElement("button")
            btn.innerHTML = styleList[i]
            btn.onclick = () => {
                if (styleOrOffsetDiv.innerHTML && styleList[i] == curStyleName) {
                    styleOrOffsetDiv.innerHTML = ""
                    styleOrOffsetDiv.setAttribute("class", "")
                    return
                }
                curStyleName = styleList[i]
                styleOrOffsetDiv.setAttribute("class", "childStyleBox")
                styleOrOffsetDiv.innerHTML = ""
                let child = this.createStyleDom({ styleCount: styleList[i] })
                styleOrOffsetDiv.append(child)
            }
            styleBtnDiv.append(btn)
        }
    }
    let offsetFunc = (v: string) => {
        offsetBtnDiv.innerHTML = ""
        let offsetList = v.split(",")
        let curOffsetName: string = ""
        for (let i = 0; i < offsetList.length; i++) {
            if (!offsetList[i]) {
                continue
            }
            let btn = document.createElement("button")
            btn.innerHTML = offsetList[i]
            btn.onclick = () => {
                if (styleOrOffsetDiv.innerHTML && offsetList[i] == curOffsetName) {
                    styleOrOffsetDiv.innerHTML = ""
                    styleOrOffsetDiv.setAttribute("class", "")
                    return
                }

                curOffsetName = offsetList[i]
                styleOrOffsetDiv.setAttribute("class", "childOffsetBox")
                styleOrOffsetDiv.innerHTML = ""
                let child = this.createOffsetDom({ offsetCount: offsetList[i] })
                child && styleOrOffsetDiv.append(child)
            }
            offsetBtnDiv.append(btn)
        }
    }
    if (op.data.type == "select") {
        let select = document.createElement("select")
        select.title = op.data.tip || ""
        select.value = op.baseData[op.type][op.data.key] || ""
        for (let i = 0; i < op.data.select.length; i++) {
            let c = op.data.select[i]
            let o = document.createElement("option")
            o.innerHTML = c.name
            o.value = c.value
            select.append(o)
        }
        select.addEventListener("change", () => {
            op.baseData[op.type][op.data.key] = select.value
            saveJson(op.saveUrl, op.baseData)
            this.reFreshPhoneSkin()
        })
        div.append(select)
    }
    else if (op.data.type == "fn") {
        let input = document.createElement("input")
        div.append(input)
        let button = document.createElement("button")
        button.innerHTML = "执行"
        button.onclick = () => {
            op.data.fn(input.value)
        }
        div.append(input, button)
    }
    else {
        let input = document.createElement("input")
        let colorInput: HTMLInputElement
        let keyBtn: HTMLButtonElement
        input.title = op.data.tip || ""
        input.value = op.baseData[op.type][op.data.key] || ""
        div.append(input)
        input.addEventListener("change", (e) => {
            op.baseData[op.type][op.data.key] = input.value
            colorInput && (colorInput.value = "#" + input.value)
            saveJson(op.saveUrl, op.baseData)
            if (styleBtnDiv) {
                styleFunc(input.value)
            }
            if (offsetBtnDiv) {
                offsetFunc(input.value)
            }
            this.reFreshPhoneSkin()
        })
        if (op.data.type == "key") {
            keyBtn = document.createElement("button")
            keyBtn.innerHTML = "特殊按键"
            div.append(keyBtn)
            let keyList: { v: string, d: string }[] = [
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
            ]
            keyBtn.onclick = () => {
                console.log("特殊按键")
                let backDiv = document.createElement("div")
                document.body.append(backDiv)
                backDiv.setAttribute("class", "specialKey")
                backDiv.onclick = () => {
                    backDiv.remove()
                }
                let formDiv = document.createElement("div")
                backDiv.append(formDiv)
                let count = 30
                let table: HTMLTableElement
                let tr: HTMLTableRowElement
                for (let i = 0; i < keyList.length; i++) {
                    if (i % count == 0) {
                        table = document.createElement("table")
                        formDiv.append(table)
                    }
                    let tr = document.createElement("tr")
                    let tdV = document.createElement("td")
                    tdV.innerHTML = `<a class="form_a" href="#">${keyList[i].v}</a>`
                    let tdD = document.createElement("td")
                    tdD.innerHTML = `<a class="form_a" href="#">${keyList[i].d}</a>`
                    tdV.onclick = tdD.onclick = () => {
                        input.value = keyList[i].v
                        op.baseData[op.type][op.data.key] = input.value
                        saveJson(op.saveUrl, op.baseData)
                        this.saveOPJson()
                        this.reFreshPhoneSkin()
                    }
                    tr.append(tdV, tdD)
                    table.append(tr)
                }
            }
        }
        if (op.data.type == "color") {
            colorInput = document.createElement("input")
            colorInput.setAttribute("type", "color")
            colorInput.value = "#" + input.value
            colorInput.addEventListener("change", () => {
                console.log(colorInput.value)
                op.baseData[op.type][op.data.key] = colorInput.value.slice(1)
                saveJson(op.saveUrl, op.baseData)
                this.reFreshPhoneSkin()
            })
            div.append(colorInput)
        }
        if (op.data.type == "style") {
            styleBtnDiv = document.createElement("div")
            styleFunc(input.value)
            div.append(styleBtnDiv)
        }
        if (op.data.type == "offset") {
            offsetBtnDiv = document.createElement("div")
            offsetFunc(input.value)
            div.append(offsetBtnDiv)
        }
        if (op.data.type == "style" || op.data.type == "offset") {
            div.append(styleOrOffsetDiv)
        }
    }
    return div
}