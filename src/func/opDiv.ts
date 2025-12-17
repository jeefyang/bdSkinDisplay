class JOPDiv {

    /** 创建配置div */
    createOPDiv(this: JMain) {
        this.createScaleDiv();
        this.createSelectHLKeyDiv();
        this.createCandSelectDiv();
        let btnDiv = document.createElement("button");
        btnDiv.setAttribute("class", "btnDiv");
        let btnList: { name: string, func: () => void; }[] = [
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
    createCandSelectDiv(this: JMain) {
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
    createSelectHLKeyDiv(this: JMain) {
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
    createScaleDiv(this: JMain) {
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
    creatFileDiv(this: JMain) {
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
                const formatter = new Intl.DateTimeFormat('zh-CN', {  // 'zh-CN' 为中文格式
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
    createChildFileDiv(this: JMain, op: { title: string, value: string, getUrlFn: () => string, inputFunc?: (s: string) => void, downloadData?: () => any, isOnlyRead?: boolean, exName?: string; }) {
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
        } else {
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

