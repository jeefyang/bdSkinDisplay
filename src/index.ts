console.log("hello")


interface JMain extends JFlow, JAction, JOPDiv, JBoardChildDom {
    createChildDom: typeof createChildDom
    createStyleDom: typeof createStyleDom
    createOffsetDom: typeof createOffsetDom
}


function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        })
    })
}
function applyFuncs(derivedCtor: any, baseCtors: ((...arr: any[]) => any)[]) {
    baseCtors.forEach(c => {
        c.name
        derivedCtor.prototype[c.name] = c
    })
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        })
    })
}
applyMixins(JMain, [JFlow, JAction, JOPDiv, JBoardChildDom])
applyFuncs(JMain, [createChildDom, createStyleDom, createOffsetDom])





new JMain()

