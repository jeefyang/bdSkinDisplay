class JOPDiv {

    /** 创建配置div */
    createOPDiv(this: JMain) {
        this.createScaleDiv()
        this.createSelectHLKeyDiv()
        let btnDiv = document.createElement("button")
        btnDiv.setAttribute("class", "btnDiv")
        let btnList: { name: string, func: () => void }[] = [
            {
                name: "单键设置", func: () => {
                    this.op.opSwitchKey = "key"
                    this.op.selectSingleKey = ""
                    this.saveOPJson()
                    new JMain()
                }
            },
            {
                name: "多键设置", func: () => {
                    this.op.opSwitchKey = "multiKey"
                    this.op.selectSingleKey = ""
                    this.op.selectMultiKeyList = []
                    this.saveOPJson()
                    new JMain()
                }
            },
            {
                name: "列表设置", func: () => {
                    this.op.opSwitchKey = "list"
                    this.saveOPJson()
                    new JMain()
                }
            },
            {
                name: "清空缓存", func: () => {
                    localStorage.clear()
                }
            },
            {
                name: "重载", func: () => {
                    new JMain()
                }
            }
        ]
        for (let i = 0; i < btnList.length; i++) {
            let c = btnList[i]
            let btn = document.createElement("button")
            btn.innerHTML = c.name
            btn.onclick = c.func
            btnDiv.append(btn)
            btn.setAttribute("class", "opBtn")
        }
        this.phoneOPDiv.append(btnDiv)
    }

    /** 创建多选高亮色的div */
    createSelectHLKeyDiv(this: JMain) {
        let div = document.createElement("div")
        let p = document.createElement("label")
        p.innerHTML = "多选高亮色:"
        let input = document.createElement("input")
        let colorInput = document.createElement("input")
        input.value = this.op.selecthlKeyColor
        input.addEventListener("change", () => {
            this.op.selecthlKeyColor = input.value
            colorInput.value = input.value
            this.saveOPJson()
            this.reFreshPhoneSkin()
        })
        colorInput.value = input.value
        colorInput.type = "color"
        colorInput.addEventListener("change", () => {
            this.op.selecthlKeyColor = colorInput.value
            input.value = colorInput.value
            this.saveOPJson()
            this.reFreshPhoneSkin()
        })
        div.append(p, input, colorInput)
        this.phoneOPDiv.append(div)
    }

    /** 创建缩放div */
    createScaleDiv(this: JMain) {
        let div = document.createElement("div")
        div.setAttribute("class", "scaleDiv")
        let p = document.createElement("label")
        p.innerHTML = "缩放倍数:"
        let scroll = document.createElement("input")
        scroll.setAttribute("type", "range")
        scroll.min = (0.003).toString()
        scroll.max = (2).toString()
        scroll.step = (0.01).toString()
        scroll.value = this.op.phoneScale.toString()
        let input = document.createElement("input")
        input.value = this.op.phoneScale.toString()
        input.style.width = 100 + 'px'
        scroll.addEventListener("input", (e) => {
            input.value = scroll.value
            let oldScale = this.op.phoneScale
            this.op.phoneScale = Number(scroll.value)
            this.op.phoneWidth *= oldScale / this.op.phoneScale
            this.op.phoneHeight *= oldScale / this.op.phoneScale
            this.setPhoneDivSize()
            this.setMoveDivPos()
            this.saveOPJson()
        })
        input.addEventListener("change", (e) => {
            scroll.value = input.value
            let oldScale = this.op.phoneScale
            this.op.phoneScale = Number(scroll.value)
            this.op.phoneWidth *= oldScale / this.op.phoneScale
            this.op.phoneHeight *= oldScale / this.op.phoneScale
            this.setPhoneDivSize()
            this.setMoveDivPos()
            this.saveOPJson()
        })
        div.append(p, scroll, input)
        this.phoneOPDiv.append(div)
    }

    /** 创建文件div */
    creatFileDiv(this: JMain) {
        this.createChildFileDiv({ title: "基础文件夹:", value: this.op.dirBase, inputFunc: (s) => { this.op.dirBase = s } })
        this.createChildFileDiv({ title: "资源文件夹:", value: this.op.resDir, inputFunc: (s) => { this.op.resDir = s } })
        this.createChildFileDiv({ title: "键盘文件夹:", value: this.op.boardDir, inputFunc: (s) => { this.op.boardDir = s } })
        this.createChildFileDiv({ title: "样式表名:", value: this.op.cssName, inputFunc: (s) => { this.op.cssName = s }, downloadData: this.cssData })
        this.createChildFileDiv({ title: "键盘表名:", value: this.op.boardName, inputFunc: (s) => { this.op.boardName = s }, downloadData: this.boardData })
        this.createChildFileDiv({ title: "资料名:", value: this.op.genName, inputFunc: (s) => { this.op.genName = s }, downloadData: this.genData })
    }

    /** 创建单个文件div */
    createChildFileDiv(this: JMain, op: { title: string, value: string, inputFunc: (s: string) => void, downloadData?: any }) {
        let div = document.createElement("div")
        div.setAttribute("class", "phoneChildFile")
        let p = document.createElement("label")
        p.innerHTML = op.title
        let input = document.createElement("input")
        input.value = op.value
        let isChange = false
        input.addEventListener("change", (e) => {
            isChange = true

        })
        let loadBtn = document.createElement("button")
        loadBtn.innerHTML = "加载"
        loadBtn.onclick = () => {
            if (!isChange) {
                alert("没有任何修改,不用加载")
                return
            }
            op.inputFunc(input.value)
            this.saveOPJson()
            new JMain()
        }
        div.append(p, input, loadBtn)
        if (op.downloadData) {
            let downloadBtn = document.createElement("button")
            downloadBtn.innerHTML = "下载"
            downloadBtn.onclick = () => {
                console.log("下载")
                let str = jsonToIni(op.downloadData)
                saveStrFile(str, op.value)
            }
            div.append(downloadBtn)
            let readBtn = document.createElement("button")
            readBtn.innerHTML = "查看"
            readBtn.onclick = () => {
                let str = jsonToIni(op.downloadData)
                console.log(str)
            }
            div.append(readBtn)
        }
        this.phoneFileDiv.append(div)
    }

}