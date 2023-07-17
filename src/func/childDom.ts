type childDomType<K extends string = string> = {
    key: K
    type?: "normal" | "select" | "style" | "color" | "offset"
    title: string
    tip?: string
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
    else {
        let input = document.createElement("input")
        let colorInput: HTMLInputElement
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