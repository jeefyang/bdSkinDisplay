type JImgData = {
    b64: string,
    til: any,
    w: number,
    h: number;
};


type JDispatchKeyType = {
    key: string, dom: HTMLElement,
    handlerDom: HTMLElement,
    type: "key" | "icon";
};