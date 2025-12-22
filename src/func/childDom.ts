type childDomType<K extends string = string> = {
    key?: K;
    type?: "normal" | "select" | "style" | "color" | "offset" | "key" | "fn" | 'speicalKey';
    title: string;
    tip?: string;
    fn?: (v: string) => void;
    select?: { name: string, value: string | number; }[];
    /** 是否非状态补丁的参数(有些key的参数状态补丁是没有的) */
    isNotTipAttr?: boolean;
};

/** 创建子元素 */
function createChildDom<K extends string = string>(this: JMain, op: {
    data: childDomType<K>,
    baseData: any;
    type: string;
    saveUrl: string;
}) {
    if (!op.type) {
        return;
    }
    if (!op.data.type) {
        op.data.type = "normal";
    }
    let styleOrOffsetDiv: HTMLDivElement = document.createElement("div");
    let div = document.createElement("div");
    let p = document.createElement("label");
    p.title = op.data.key;
    p.innerHTML = op.data.title;
    div.append(p);
    let styleBtnDiv: HTMLDivElement;
    let offsetBtnDiv: HTMLDivElement;
    let styleFunc = (v: string) => {
        styleBtnDiv.innerHTML = "";
        let styleList = v.split(",");
        let curStyleName: string = "";
        for (let i = 0; i < styleList.length; i++) {
            if (!styleList[i]) {
                continue;
            }
            let btn = document.createElement("button");
            btn.innerHTML = styleList[i];
            btn.onclick = () => {
                if (styleOrOffsetDiv.innerHTML && styleList[i] == curStyleName) {
                    styleOrOffsetDiv.innerHTML = "";
                    styleOrOffsetDiv.setAttribute("class", "");
                    return;
                }
                curStyleName = styleList[i];
                styleOrOffsetDiv.setAttribute("class", "childStyleBox");
                styleOrOffsetDiv.innerHTML = "";
                let child = this.createStyleDom({ styleCount: styleList[i] });
                styleOrOffsetDiv.append(child);
            };
            styleBtnDiv.append(btn);
        }
    };
    let offsetFunc = (v: string) => {
        offsetBtnDiv.innerHTML = "";
        let offsetList = v.split(",");
        let curOffsetName: string = "";
        for (let i = 0; i < offsetList.length; i++) {
            if (!offsetList[i]) {
                continue;
            }
            let btn = document.createElement("button");
            btn.innerHTML = offsetList[i];
            btn.onclick = () => {
                if (styleOrOffsetDiv.innerHTML && offsetList[i] == curOffsetName) {
                    styleOrOffsetDiv.innerHTML = "";
                    styleOrOffsetDiv.setAttribute("class", "");
                    return;
                }

                curOffsetName = offsetList[i];
                styleOrOffsetDiv.setAttribute("class", "childOffsetBox");
                styleOrOffsetDiv.innerHTML = "";
                let child = this.createOffsetDom({ offsetCount: offsetList[i] });
                child && styleOrOffsetDiv.append(child);
            };
            offsetBtnDiv.append(btn);
        }
    };
    if (op.data.type == "select") {
        let select = document.createElement("select");
        select.title = op.data.tip || "";
        for (let i = 0; i < op.data.select.length; i++) {
            let c = op.data.select[i];
            let o = document.createElement("option");
            o.innerHTML = c.name;
            o.value = c.value as string;
            select.append(o);
        }
        select.value = op.baseData[op.type][op.data.key] || "";
        select.addEventListener("change", () => {
            op.baseData[op.type][op.data.key] = select.value;
            saveJson(op.saveUrl, op.baseData);
            this.reFreshPhoneSkin();
        });
        div.append(select);
    }
    else if (op.data.type == "fn") {
        let input = document.createElement("input");
        div.append(input);
        let button = document.createElement("button");
        button.innerHTML = "执行";
        button.onclick = () => {
            op.data.fn(input.value);
        };
        div.append(input, button);
    }
    else {
        let input = document.createElement("input");
        let colorInput: HTMLInputElement;
        let keyBtn: HTMLButtonElement;
        input.title = op.data.tip || "";
        const forceKey = op.data.isNotTipAttr ? op.type : this.getFinalKey(op.type);
        input.value = op.baseData[forceKey][op.data.key] || "";
        div.append(input);
        input.addEventListener("change", (e) => {
            op.baseData[forceKey][op.data.key] = input.value;
            colorInput && (colorInput.value = "#" + input.value);
            saveJson(op.saveUrl, op.baseData);
            if (styleBtnDiv) {
                styleFunc(input.value);
            }
            if (offsetBtnDiv) {
                offsetFunc(input.value);
            }
            this.reFreshPhoneSkin();
        });
        if (op.data.type == "key") {
            keyBtn = document.createElement("button");
            keyBtn.innerHTML = "特殊按键";
            div.append(keyBtn);

            keyBtn.onclick = () => {
                let backDiv = document.createElement("div");
                document.body.append(backDiv);
                backDiv.setAttribute("class", "specialKey");
                backDiv.onclick = () => {
                    backDiv.remove();
                };
                let formDiv = document.createElement("div");
                backDiv.append(formDiv);
                let count = 30;
                let table: HTMLTableElement;
                let tr: HTMLTableRowElement;
                for (let i = 0; i < this.shortKeyDescList.length; i++) {
                    if (i % count == 0) {
                        table = document.createElement("table");
                        formDiv.append(table);
                    }
                    let tr = document.createElement("tr");
                    let tdV = document.createElement("td");
                    tdV.innerHTML = `<a class="form_a" href="#">${this.shortKeyDescList[i].v}</a>`;
                    let tdD = document.createElement("td");
                    tdD.innerHTML = `<a class="form_a" href="#">${this.shortKeyDescList[i].d}</a>`;
                    tdV.onclick = tdD.onclick = () => {
                        input.value = this.shortKeyDescList[i].v;
                        op.baseData[forceKey][op.data.key] = input.value;
                        saveJson(op.saveUrl, op.baseData);
                        this.saveOPJson();
                        this.reFreshPhoneSkin();
                    };
                    tr.append(tdV, tdD);
                    table.append(tr);
                }
            };
        }
        if (op.data.type == "speicalKey") {
            keyBtn = document.createElement("button");
            keyBtn.innerHTML = "特殊按键";
            div.append(keyBtn);

            keyBtn.onclick = () => {
                let backDiv = document.createElement("div");
                document.body.append(backDiv);
                backDiv.setAttribute("class", "specialKey");
                backDiv.onclick = () => {
                    backDiv.remove();
                };
                let formDiv = document.createElement("div");
                backDiv.append(formDiv);
                let count = 30;
                let table: HTMLTableElement;
                let tr: HTMLTableRowElement;
                for (let i = 0; i < this.statusDescList.length; i++) {
                    if (i % count == 0) {
                        table = document.createElement("table");
                        formDiv.append(table);
                    }
                    let tr = document.createElement("tr");
                    let tdV = document.createElement("td");
                    tdV.innerHTML = `<a class="form_a" href="#">${this.statusDescList[i].v}</a>`;
                    let tdD = document.createElement("td");
                    tdD.innerHTML = `<a class="form_a" href="#">${this.statusDescList[i].d}</a>`;
                    tdV.onclick = tdD.onclick = () => {
                        input.value = this.statusDescList[i].v;
                        op.baseData[forceKey][op.data.key] = input.value;
                        saveJson(op.saveUrl, op.baseData);
                        this.saveOPJson();
                        this.reFreshPhoneSkin();
                    };
                    tr.append(tdV, tdD);
                    table.append(tr);
                }
            };
        }
        if (op.data.type == "color") {
            colorInput = document.createElement("input");
            colorInput.setAttribute("type", "color");
            colorInput.value = "#" + input.value;
            colorInput.addEventListener("change", () => {
                op.baseData[forceKey][op.data.key] = colorInput.value.slice(1);
                saveJson(op.saveUrl, op.baseData);
                this.reFreshPhoneSkin();
            });
            div.append(colorInput);
        }
        if (op.data.type == "style") {
            styleBtnDiv = document.createElement("div");
            styleFunc(input.value);
            div.append(styleBtnDiv);
        }
        if (op.data.type == "offset") {
            offsetBtnDiv = document.createElement("div");
            offsetFunc(input.value);
            div.append(offsetBtnDiv);
        }
        if (op.data.type == "style" || op.data.type == "offset") {
            div.append(styleOrOffsetDiv);
        }
    }
    return div;
}