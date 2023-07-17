
class JAction {
    /** 设置手机尺寸 */
    setPhoneDivSize(this: JMain, w?: number, h?: number, scale?: number) {
        !w && (w = this.op.phoneWidth)
        !h && (h = this.op.phoneHeight)
        !scale && (scale = this.op.phoneScale)
        this.phoneDiv.style.width = w + "px"
        this.phoneDiv.style.height = h + "px"
        this.cmdDiv.style.height = (h * scale) + "px"
        //@ts-ignore
        this.phoneDiv.style.zoom = scale.toString()
        this.op.phoneWidth = w
        this.op.phoneHeight = h
        this.op.phoneScale = scale
    }

    /** 设置手机移动 */
    setMoveDivPos(this: JMain, x?: number, y?: number) {
        !x && (x = this.op.phoneWidth)
        !y && (y = this.op.phoneHeight)
        this.moveDiv.style.left = (x * this.op.phoneScale) + 'px'
        this.moveDiv.style.top = (y * this.op.phoneScale) + 'px'
    }

    /** 设置移动事件 */
    setMoveDivEvent(this: JMain) {
        let isDown: -1 | 0 | 1 = 0
        let x: number = 0
        let y: number = 0
        this.moveDiv.onmousedown = (e) => {
            isDown = -1
        }
        document.addEventListener("mousemove", (e) => {
            if (!isDown) {
                return
            }
            if (isDown == -1) {
                x = e.clientX
                y = e.clientY
                isDown = 1
            }
            this.op.phoneWidth += (e.clientX - x) / this.op.phoneScale
            this.op.phoneHeight += (e.clientY - y) / this.op.phoneScale
            x = e.clientX
            y = e.clientY
            this.setMoveDivPos(this.op.phoneWidth, this.op.phoneHeight)
            this.setPhoneDivSize(this.op.phoneWidth, this.op.phoneHeight, this.op.phoneScale)

        })
        document.addEventListener("mouseup", () => {
            if (isDown == 1) {
                this.saveOPJson()
            }
            isDown = 0
        })
    }

    async getImageData(this: JMain, name: string) {
        if (this.imageData[name]) {
            return this.imageData[name]
        }
        let pngUrl = `${this.op.dirBase}/${this.op.resDir}/${name}.png`
        let imageData = await getImageDataB64(pngUrl)
        let tilUrl = `${this.op.dirBase}/${this.op.resDir}/${name}.til`
        let tilData = await getIniFileData(tilUrl)
        this.imageData[name] = {
            b64: imageData.b64,
            w: imageData.w,
            h: imageData.h,
            til: tilData
        }
        return this.imageData[name]
    }

    async getImgEle(this: JMain, op: { til: TilImgType, imgData: JImgData, w?: number, h?: number }): Promise<{ e: HTMLImageElement | HTMLDivElement, offsetX: number, offsetY: number }> {
        let SOURCE_RECT = op.til.SOURCE_RECT.split(",").map(c => Number(c))
        let sRectX = SOURCE_RECT[0]
        let sRectY = SOURCE_RECT[1]
        let sRectW = SOURCE_RECT[2]
        let sRectH = SOURCE_RECT[3]
        op.w = op.w || sRectW
        op.h = op.h || sRectH
        if (!op.til.INNER_RECT) {
            let b64 = await getTilImageB64(op.imgData.b64, sRectX, sRectY, sRectW, sRectH)
            let img = document.createElement("img")
            img.src = b64
            img.style.width = sRectW + 'px'
            img.style.height = sRectH + 'px'
            return {
                e: img, offsetX: (op.w - sRectW) / 2, offsetY: (op.h - sRectH) / 2
            }
        }
        let INNER_RECT = op.til.INNER_RECT.split(",").map(c => Number(c))
        let iRectX = INNER_RECT[0]
        let iRectY = INNER_RECT[1]
        let iRectW = INNER_RECT[2]
        let iRectH = INNER_RECT[3]
        let curW = op.w - (sRectW - iRectW)
        let curH = op.h - (sRectH - iRectH)
        let div = document.createElement("div");
        let list: number[][] = [
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
        ]
        for (let i = 0; i < list.length; i++) {
            let c = list[i]
            let capX = c[0]
            let capY = c[1]
            let capW = c[2]
            let capH = c[3]
            let imgX = c[4]
            let imgY = c[5]
            let imgW = c[6] || capW
            let imgH = c[7] || capH
            let b64 = await getTilImageB64(op.imgData.b64, capX, capY, capW, capH)
            let img = document.createElement('img')
            img.src = b64
            img.style.position = "absolute"
            img.style.left = imgX + 'px'
            img.style.top = imgY + 'px'
            img.style.width = imgW + 'px'
            img.style.height = imgH + 'px'
            img.setAttribute("class", `img${i + 1}`)
            div.append(img)
        }
        div.style.width = op.w + 'px'
        div.style.height = op.h + 'px'
        return { e: div, offsetX: 0, offsetY: 0 }
    }

    getPEle(this: JMain, op: { pos: number[], show: string, color?: string, fontSize?: number | string, viewW: number, viewH: number }) {
        let box = document.createElement("div")
        box.style.display = "table"
        box.style.position = "absolute"
        box.style.left = '0px'
        box.style.top = "0px"
        box.style.width = op.viewW + 'px'
        box.style.height = op.viewH + 'px'
        let p = document.createElement("div")
        p.innerHTML = op.show
        // p.style.position = "absolute"
        op.color && (p.style.color = "#" + op.color)
        op.fontSize && (p.style.fontSize = op.fontSize + 'px')
        p.style.transform = `translate(${op.pos[0]}px,${op.pos[1]}px)`
        p.style.display = "table-cell"
        p.style.textAlign = "center"
        p.style.verticalAlign = "middle"
        box.append(p)
        return box
    }


    async checkCss(this: JMain) {
        for (let key in this.cssData) {
            let css: CssStyleType = this.cssData[key];
            let imgTagList: string[] = [css.NM_IMG, css.HL_IMG];
            for (let i = 0; i < imgTagList.length; i++) {
                if (!imgTagList[i]) {
                    continue
                }
                let nm = imgTagList[i].split(',')
                let imageData = await this.getImageData(nm[0])
                let imgName = `IMG${nm[1]}`
                let imgTil: TilImgType = imageData.til[imgName]
                if (!imgTil) {
                    console.log(key)
                    console.log(css)
                }
            }
        }
    }

    /** 保存配置json */
    saveOPJson(this: JMain) {
        saveJson(this.phoneOPKey, this.op)
    }

    /** 读取配置json */
    loadOPJson(this: JMain) {
        return loadJson(this.phoneOPKey)
    }

    /** 触发键盘key的事件 */
    dispatchKeyEvent(this: JMain, op: {
        key: string, dom: HTMLElement,
        handlerDom: HTMLElement,
        type: "key" | "icon"
    }) {
        if (this.op.opSwitchKey == "key") {
            this.op.selectSingleKey = op.key
            this.op.selectSingleType = op.type
            for (let key in this.keyDomList) {
                this.setKeySelectHL(key, this.keyDomList[key].handlerDom)
            }
            this.saveOPJson()
            this.initCmdDiv()
        }
        if (this.op.opSwitchKey == "multiKey" && op.type == "key") {
            let index = this.op.selectMultiKeyList.findIndex(c => c == op.key)
            if (index != -1) {
                this.op.selectMultiKeyList.splice(index, 1)
            }
            else {
                this.op.selectMultiKeyList.push(op.key)
            }
            for (let key in this.keyDomList) {
                this.setKeySelectHL(key, this.keyDomList[key].handlerDom)
            }
            this.saveOPJson()
            this.initCmdDiv()
        }
    }

    /** 刷新皮肤 */
    async reFreshPhoneSkin(this: JMain) {
        this.phoneCandDiv.innerHTML = ""
        this.phoneBoardDiv.innerHTML = ""
        await this.initLoadData()
        await this.decodeBoard()
    }


    /** 设置多选高亮 */
    setKeySelectHL(this: JMain, keyName: string, handlerDiv: HTMLElement) {
        if (
            (this.op.opSwitchKey == "multiKey" && this.op.selectMultiKeyList.includes(keyName)) ||
            (this.op.opSwitchKey == "key" && this.op.selectSingleKey == keyName)
        ) {
            handlerDiv.style.border = `2px solid ${this.op.selecthlKeyColor}`
        }
        else {
            handlerDiv.style.border = ""
        }
    }

}
