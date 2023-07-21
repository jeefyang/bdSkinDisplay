class JFlow {

    /** 初始化 */
    async init(this: JMain) {
        this.keyDomList = {}
        this.initData()
        await this.initLoadData()
        this.creatFileDiv()
        this.createOPDiv()
        this.setPhoneDivSize(this.op.phoneWidth, this.op.phoneHeight, this.op.phoneScale)
        this.setMoveDivPos(this.op.phoneWidth, this.op.phoneHeight)
        await this.decodeBoard()
        this.initCmdDiv()
        this.checkCss()
    }

    /** 初始化数据 */
    initData(this: JMain) {
        this.op = this.loadOPJson() || this.op
        this.moveDiv = <HTMLDivElement>document.getElementsByClassName("moveDiv")[0]
        this.cmdDiv = <HTMLDivElement>document.getElementsByClassName("cmd")[0]
        this.phoneDiv = <HTMLDivElement>document.getElementsByClassName("phoneDisplay")[0]
        // this.phoneDiv.innerHTML = ""
        this.phoneCandDiv = <HTMLDivElement>this.phoneDiv.getElementsByClassName("phoneCand")[0]
        this.phoneCandDiv.innerHTML = ""
        this.phoneBoardDiv = <HTMLDivElement>this.phoneDiv.getElementsByClassName("phoneBoard")[0]
        this.phoneBoardDiv.innerHTML = ""
        this.phoneOPDiv = <HTMLDivElement>document.getElementsByClassName("phoneOP")[0]
        this.phoneOPDiv.innerHTML = ""
        this.phoneFileDiv = <HTMLDivElement>document.getElementsByClassName("phoneFile")[0]
        this.phoneFileDiv.innerHTML = ""
        this.phoneCmdDiv = <HTMLDivElement>document.getElementsByClassName("phoneCmd")[0]
        this.phoneCmdDiv.innerHTML = ""
        this.setMoveDivEvent()
    }

    /** 初始加载数据 */
    async initLoadData(this: JMain) {
        this.cssData = loadJson(this.cssUrl)
        if (!this.cssData) {
            this.cssData = await getIniFileData(this.cssUrl)
        }
        this.boardData = loadJson(this.boardUrl)
        if (!this.boardData) {
            this.boardData = await getIniFileData(this.boardUrl)
        }
        this.genData = loadJson(this.genUrl)
        if (!this.genData) {
            this.genData = await getIniFileData(this.genUrl);
        }
        console.log(this.genData);
        // 装入默认数据
        ["PANEL", "INPUT", "CAND", "HINT", "MORE", "LIST"].forEach(key => {
            if (!this.genData[key] || !this.boardData[key]) {
                return
            }
            for (let childKey in this.genData[key]) {
                if (!this.boardData[key]) {
                    this.boardData[key] = {}
                }
                if (this.boardData[key][childKey] != null) {
                    continue
                }
                this.boardData[key][childKey] = this.genData[key][childKey]
            }
        });
        this.op.candName = this.boardData?.['CAND']?.['LAYOUT_NAME']
        if (this.op.candName) {
            this.candData = loadJson(this.candUrl)
            if (!this.candData) {
                this.candData = await getIniFileData(this.candUrl)
            }
            console.log(this.candData)
        }
        this.op.hintName = this.boardData?.['HINT']?.["LAYOUT_NAME"]
        if (this.op.hintName) {
            this.hintData = loadJson(this.hintData)
            if (!this.hintData) {
                this.hintData = await getIniFileData(this.hintUrl)
            }
            console.log(this.hintData)
        }
        console.log(this.boardData)
        return
    }

    /** 解析键盘 */
    async decodeBoard(this: JMain) {
        let listName = ""
        let candName = ""
        let panelName = "PANEL"
        if (this.boardData[panelName]) {
            await this.decodeBoard_Panel(this.boardData[panelName], panelName)
        }
        for (let key in this.boardData) {
            if (key.includes("KEY")) {
                await this.decodeBoard_Key(this.boardData[key], key)
            }
            if (key == "LIST") {
                listName = key
            }
            if (key == "CAND") {
                candName = key
            }
        }
        if (listName) {
            await this.decodeBoard_List(this.boardData[listName], listName)
        }
        if (candName) {
            await this.decodeBoard_Cand(this.boardData[candName], candName)
        }
    }

    /** 解析键盘面板 */
    async decodeBoard_Panel(this: JMain, data: BoardPanelType, keyName: string) {
        let styleTagList = [data.BACK_STYLE, ...(data.FORE_STYLE || "").split(",")]
        let size = data.SIZE.split(",").map(c => Number(c))
        let div = document.createElement("div")
        div.setAttribute("class", `panel ${keyName}`)
        div.style.position = "absolute"
        div.style.top = "0px"
        div.style.left = "0px"
        div.style.width = size[0] + "px"
        div.style.height = size[1] + 'px'
        this.phoneBoardDiv.append(div)
        for (let i = 0; i < styleTagList.length; i++) {
            let tag = styleTagList[i]
            if (!tag) {
                continue
            }
            await this.decodeBoard_ImgStyle({ viewRectW: size[0], viewRectH: size[1], w: size[0], h: size[1], style: tag, div, keyName })
        }
        return
    }


    /** 解析键盘图标样式 */
    async decodeBoard_IconStyle(this: JMain, op: { data: CndIconType, div: HTMLDivElement, handlerDiv: HTMLDivElement, rectW: number, rectH: number, keyName: string }) {
        // 无候选
        if (op.data.PERSIST == "1" && this.op.isPersist) {
            return
        }
        // 有候选
        if (op.data.PERSIST == "2" && !this.op.isPersist) {
            return
        }
        // 都不显示
        if (op.data.PERSIST == "0") {
            return
        }
        let size: number[] = (op.data.SIZE || "").split(",").map(c => Number(c))
        let styleList = [op.data.BACK_STYLE, ...(op.data.FORE_STYLE || "").split(",")]
        let pos = (op.data.POS || "").split(",").map(c => Number(c))
        let minX = Infinity
        let minY = Infinity
        let maxX = -Infinity
        let maxY = -Infinity
        for (let i = 0; i < styleList.length; i++) {
            let style = styleList[i]
            if (!style) {
                continue
            }
            let styleName = `STYLE${style}`
            let css: CssStyleType = this.cssData[styleName]
            if (!css) {
                continue
            }
            let imgList: HTMLImageElement[] = []
            let imgTagList: string[] = [css.NM_IMG, css.HL_IMG]

            for (let i = 0; i < imgTagList.length; i++) {
                if (!imgTagList[i]) {
                    imgList.push(undefined)
                    continue
                }
                let nm = imgTagList[i].split(',')
                let imageData = await this.getImageData(nm[0])
                let imgName = `IMG${nm[1]}`
                let imgTil: TilImgType = imageData.til[imgName]
                let rect = imgTil.SOURCE_RECT.split(",")
                let rectX = Number(rect[0])
                let rectY = Number(rect[1])
                let rectW = Number(rect[2])
                let rectH = Number(rect[3])
                let b64 = await getTilImageB64(imageData.b64, rectX, rectY, rectW, rectH)
                let img = document.createElement("img")
                img.setAttribute("calss", i == 0 ? `nm_img ${op.keyName} ${styleName}` : `hl_img ${op.keyName} ${styleName}`)
                img.setAttribute("memo", imgTagList[i])
                img.src = b64
                img.style.position = "absolute"
                let w = rectW
                let h = rectH
                // if (size) {
                //     w = size[0]
                //     h = size[1]
                // }
                let offsetX = 0
                let offsetY = 0
                if (size) {
                    offsetX += (size[0] - w) / 2
                    offsetY += (size[1] - h) / 2
                }
                offsetX += (() => { return [op.rectW, 0, op.rectW / 2] })()[Number(op.data.ANCHOR_TYPE || 1) % 3]
                offsetY += (() => { return [0, op.rectH / 2, op.rectH] })()[Math.floor((Number(op.data.ANCHOR_TYPE || 1) - 1) / 3)]
                offsetX += pos[0] || 0
                offsetY += pos[1] || 0
                img.style.width = w + "px"
                img.style.height = h + "px"
                img.style.left = offsetX + "px"
                img.style.top = offsetY + "px"
                minX = Math.min(offsetX, minX)
                minY = Math.min(offsetY, minY)
                maxX = Math.max(offsetX + w, maxX)
                maxY = Math.max(offsetY + h, maxY)
                op.div.append(img)
                imgList.push(img)
                img.addEventListener("click", () => {
                    console.log(`${op.keyName} ${styleName}`)
                })
            }
            op.handlerDiv.addEventListener('mouseenter', () => {
                imgList[0] && (imgList[0].style.display = "none")
                imgList[1] && (imgList[1].style.display = "block")
            })
            op.handlerDiv.addEventListener("mouseleave", () => {
                imgList[0] && (imgList[0].style.display = "block")
                imgList[1] && (imgList[1].style.display = "none")
            })

            op.handlerDiv.addEventListener("click", () => {
                console.log(op.keyName)
            })

        }
        let handlerDiv = document.createElement("div")
        handlerDiv.style.position = "absolute"
        handlerDiv.style.left = minX + "px"
        handlerDiv.style.top = minY + "px"
        handlerDiv.style.width = maxX - minX + "px"
        handlerDiv.style.height = maxY - minY + "px"
        handlerDiv.setAttribute("class", "icon_handler")

        handlerDiv.addEventListener("click", () => {
            this.dispatchKeyEvent({ key: op.keyName, dom: op.div, handlerDom: handlerDiv, type: "icon" })
        })
        op.div.append(handlerDiv)
        this.keyDomList[op.keyName] = { name: op.keyName, type: "icon", handlerDom: handlerDiv, dom: op.div }
        this.setKeySelectHL(op.keyName, handlerDiv)
        return
    }

    /** 解析键盘候选框 */
    async decodeBoard_Cand(this: JMain, data: BoardCandType, keyName: string) {
        let rect = data.VIEW_RECT.split(",")
        let rectX = Number(rect[0])
        let rectY = Number(rect[1])
        let rectW = Number(rect[2])
        let rectH = Number(rect[3])
        let div = document.createElement("div")
        div.style.position = "relative"
        div.style.left = rectX + 'px'
        div.style.top = rectY + 'px'
        div.style.width = rectW + 'px'
        div.style.height = rectH + "px"
        // div.style.backgroundColor = "red"
        this.phoneCandDiv.append(div)
        let handlerDiv = document.createElement("div")
        let cand: CndCandType = this.candData["CAND"]
        if (cand.BACK_STYLE) {
            await this.decodeBoard_ImgStyle({ viewRectW: rectW, viewRectH: rectH, div, w: rectW, h: rectH, style: cand.BACK_STYLE, handlerDiv, keyName, isBack: true })
        }
        if (cand.FORE_STYLE) {
            let list = cand.FORE_STYLE.split(',')
            for (let i = 0; i < list.length; i++) {
                await this.decodeBoard_ImgStyle({ viewRectW: rectW, viewRectH: rectH, div, style: list[i], handlerDiv, keyName })
            }
        }
        for (let key in this.candData) {
            if (key.includes("ICON")) {
                let icon: CndIconType = this.candData[key]
                await this.decodeBoard_IconStyle({ data: icon, div, handlerDiv, rectW, rectH, keyName: key })
            }
        }
        this.phoneCandDiv.append(handlerDiv)
        handlerDiv.dispatchEvent(new Event("mouseleave"))
        return
    }

    /** 解析键盘列表 */
    async decodeBoard_List(this: JMain, data: BoardListType, keyName: string) {

        let padding = (data.PADDING || "").split(",").map(c => Number(c))
        let names = data.NAMES.split(" ")
        let num = Number(data.LIST_NUM)
        let startX: number = null
        let startY: number = null
        let size = (data.CELL_SIZE || "").split(',').map(c => Number(c))
        let pos = data.POS.split(',').map(c => Number(c))
        let fontCss: CssStyleType = this.cssData[`STYLE${data.FORE_STYLE}`]
        if (!fontCss) {
            return
        }
        for (let i = 0; i < num; i++) {
            let div = document.createElement("div")
            if (startX == null) {
                startX = pos[0]
                startX += padding[0] || 0
            }
            if (startY === null) {
                startY = pos[1]
                startY += padding[1] || 0
            }
            if (i) {
                startX += data.LIST_ORDER == "1" ? size[0] : 0
                startY += data.LIST_ORDER == "0" ? size[1] : 0
            }
            div.style.position = "absolute"
            div.style.left = startX + 'px'
            div.style.top = startY + 'px'
            div.style.width = (size[0] - padding[0] - padding[2]) + 'px'
            div.style.height = (size[1] - padding[1] - padding[3]) + 'px'
            this.phoneBoardDiv.append(div)
            let handlerDiv = document.createElement("div")
            let styleName = `STYLE${data.CELL_STYLE}`
            let css: CssStyleType = this.cssData[styleName]
            if (!css) {
                continue
            }
            let imgList: HTMLElement[] = []
            let imgTagList: string[] = [css.NM_IMG, css.HL_IMG]
            for (let j = 0; j < imgTagList.length; j++) {
                if (!imgTagList[j]) {
                    imgList.push(undefined)
                    continue
                }
                let nm = imgTagList[j].split(',')
                let imageData = await this.getImageData(nm[0])
                let imgName = `IMG${nm[1]}`
                let imgTil: TilImgType = imageData.til[imgName]
                let edata = await this.getImgEle({ til: imgTil, imgData: imageData, w: size[0], h: size[1] })
                edata.e.setAttribute("calss", j == 0 ? `nm_img ${styleName} ${keyName}` : `hl_img ${styleName} ${keyName}`)
                edata.e.style.position = "absolute"
                edata.e.style.left = edata.offsetX + "px"
                edata.e.style.top = edata.offsetY + "px"
                div.append(edata.e)
                imgList.push(edata.e)
            }
            if (names[i]) {
                let colorList = [fontCss.NM_COLOR, fontCss.HL_COLOR]
                let boxList: HTMLElement[] = []
                for (let j = 0; j < colorList.length; j++) {
                    if (!colorList[j]) {
                        boxList.push(undefined)
                        continue
                    }
                    let p = this.getPEle({ pos: [0, 0], show: names[i], color: colorList[j], fontSize: fontCss.FONT_SIZE, viewW: size[0], viewH: size[1] })
                    div.append(p)
                    boxList.push(p)
                }
                handlerDiv.addEventListener('mouseenter', () => {
                    boxList[0] && (boxList[0].style.display = "none")
                    boxList[1] && (boxList[1].style.display = "table")
                })
                handlerDiv.addEventListener("mouseleave", () => {
                    boxList[0] && (boxList[0].style.display = "table")
                    boxList[1] && (boxList[1].style.display = "none")
                })
            }

            handlerDiv.style.position = "absolute"
            handlerDiv.style.left = startX + 'px'
            handlerDiv.style.top = startY + 'px'
            handlerDiv.style.width = size[0] + 'px'
            handlerDiv.style.height = size[1] + 'px'
            this.phoneBoardDiv.append(handlerDiv)
            handlerDiv.addEventListener('mouseenter', () => {
                imgList[0] && (imgList[0].style.display = "none")
                imgList[1] && (imgList[1].style.display = "block")
            })
            handlerDiv.addEventListener("mouseleave", () => {
                imgList[0] && (imgList[0].style.display = "block")
                imgList[1] && (imgList[1].style.display = "none")
            })
            handlerDiv.dispatchEvent(new Event("mouseleave"))
        }
    }

    /** 解析键值key的样式 */
    async decodeBoard_ImgStyle(this: JMain, op: {
        viewRectW: number, viewRectH: number,
        w?: number, h?: number, style: string, div: HTMLElement,
        pos_Type?: string, handlerDiv?: HTMLDivElement, keyName: string,
        size?: number[], isBack?: boolean
    }) {
        let styleName = `STYLE${op.style}`
        let css: CssStyleType = this.cssData[styleName]
        if (!css) {
            return
        }
        let pos: number[] = undefined
        if (op.pos_Type) {
            let offset: BoardOffsetType = this.genData[`OFFSET${op.pos_Type}`]
            if (offset?.POS) {
                pos = offset.POS.split(',').map(c => Number(c))
            }
        }
        let imgList: HTMLElement[] = []
        let imgTagList: string[] = [css.NM_IMG || css.HL_IMG, css.HL_IMG]
        for (let i = 0; i < imgTagList.length; i++) {
            if (!imgTagList[i]) {
                if (i == 0) {
                    let div = document.createElement("div")
                    div.setAttribute("calss", i == 0 ? `nm_img ${styleName} ${op.keyName}` : `hl_img ${styleName} ${op.keyName}`)
                    div.style.position = "absolute"
                    div.style.left = "0px"
                    div.style.top = "0px"
                    div.style.width = op.viewRectW + "px"
                    div.style.height = op.viewRectH + "px"
                    op.div.append(div)
                    imgList.push(div)
                    continue
                }
                imgList.push(undefined)
                continue
            }
            let nm = imgTagList[i].split(',')
            let imageData = await this.getImageData(nm[0])
            let imgName = `IMG${nm[1]}`
            let imgTil: TilImgType = imageData.til[imgName]
            let edata = await this.getImgEle({ til: imgTil, imgData: imageData, w: op.viewRectW, h: op.viewRectH, isBack: op.isBack })
            edata.e.setAttribute("calss", i == 0 ? `nm_img ${styleName} ${op.keyName}` : `hl_img ${styleName} ${op.keyName}`)
            edata.e.setAttribute("memo", imgTagList[i])
            edata.e.style.position = "absolute"
            let offsetX = edata.offsetX
            let offsetY = edata.offsetY
            if (op.size) {
                offsetX += (op.viewRectW - op.size[0]) / 2
                offsetY += (op.viewRectH - op.size[1]) / 2
            }
            if (pos) {
                offsetX += pos[0]
                offsetY += pos[1]
            }
            edata.e.style.left = offsetX + "px"
            edata.e.style.top = offsetY + "px"
            op.div.append(edata.e)
            imgList.push(edata.e)
        }
        op.handlerDiv && op.handlerDiv.addEventListener('mouseenter', () => {
            imgList[0] && imgList[1] && (imgList[0].style.display = "none")
            imgList[1] && (imgList[1].style.display = "block")
        })
        op.handlerDiv && op.handlerDiv.addEventListener("mouseleave", () => {
            imgList[0] && (imgList[0].style.display = "block")
            imgList[1] && (imgList[1].style.display = "none")
        })

        let colorList = [css.NM_COLOR || css.HL_COLOR, css.HL_COLOR]
        let boxList: HTMLElement[] = []
        for (let i = 0; i < colorList.length; i++) {
            if (!colorList[i] || !css.SHOW) {
                boxList.push(undefined)
                continue
            }
            let p = this.getPEle({ pos: pos || [0, 0], show: css.SHOW, color: colorList[i], fontSize: css.FONT_SIZE, viewW: op.viewRectW, viewH: op.viewRectH })
            op.div.append(p)
            boxList.push(p)
        }
        op.handlerDiv && op.handlerDiv.addEventListener('mouseenter', () => {
            boxList[0] && (boxList[0].style.display = "none")
            boxList[1] && (boxList[1].style.display = "table")
        })
        op.handlerDiv && op.handlerDiv.addEventListener("mouseleave", () => {
            boxList[0] && (boxList[0].style.display = "table")
            boxList[1] && (boxList[1].style.display = "none")
        })
        return
    }

    /** 解析键盘key */
    async decodeBoard_Key(this: JMain, data: BoardKeyType, keyName: string) {
        if (!data.VIEW_RECT) {
            return
        }
        let rect = data.VIEW_RECT.split(",")
        let rectX = Number(rect[0])
        let rectY = Number(rect[1])
        let rectW = Number(rect[2])
        let rectH = Number(rect[3])
        let div = document.createElement("div")
        div.style.position = "absolute"
        div.style.left = `${rectX}px`
        div.style.top = `${rectY}px`
        div.style.width = `${rectW}px`
        div.style.height = `${rectH}px`
        div.style.textAlign = "center"
        let handlerDiv = document.createElement("div")

        if (data.BACK_STYLE) {
            await this.decodeBoard_ImgStyle({ viewRectW: rectW, viewRectH: rectH, w: rectW, h: rectH, div, style: data.BACK_STYLE, handlerDiv, keyName, isBack: true })
        }
        if (data.FORE_STYLE) {
            let pos = (data.POS_TYPE || "").split(",")
            let list = data.FORE_STYLE.split(',')
            for (let i = 0; i < list.length; i++) {
                await this.decodeBoard_ImgStyle({ viewRectW: rectW, viewRectH: rectH, div, style: list[i], pos_Type: pos[i], handlerDiv, keyName })
            }

        }
        // div.style.background = "red"
        this.phoneBoardDiv.append(div)

        handlerDiv.style.position = "absolute"
        handlerDiv.style.left = `${rect[0]}px`
        handlerDiv.style.top = `${rect[1]}px`
        handlerDiv.style.width = `${rect[2]}px`
        handlerDiv.style.height = `${rect[3]}px`
        this.phoneBoardDiv.append(handlerDiv)
        handlerDiv.addEventListener("click", () => {
            this.dispatchKeyEvent({ key: keyName, dom: div, handlerDom: handlerDiv, type: "key" })
        })
        handlerDiv.dispatchEvent(new Event("mouseleave"))
        this.keyDomList[keyName] = {
            name: keyName, dom: div, handlerDom: handlerDiv, type: "key"
        }
        this.setKeySelectHL(keyName, handlerDiv)
    }

    initCmdDiv(this: JMain) {
        switch (this.op.opSwitchKey) {
            case "list":
                this.createBoardListDom()
                break
            case "key":
                if (this.op.selectSingleType == "key") {
                    this.createBoardSingleKeyDom()
                }
                else if (this.op.selectSingleType == "icon") {
                    this.createBoardSingleIconDom()
                }
                break
            case "multiKey":
                this.createBoardMultiKeyListDom()
                break
        }
    }
}