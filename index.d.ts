declare class JAction {
    /** 设置手机尺寸 */
    setPhoneDivSize(this: JMain, w?: number, h?: number, scale?: number): void;
    /** 设置手机移动 */
    setMoveDivPos(this: JMain, x?: number, y?: number): void;
    /** 设置移动事件 */
    setMoveDivEvent(this: JMain): void;
    getImageData(this: JMain, name: string): Promise<JImgData>;
    getImgEle(this: JMain, op: {
        til: TilImgType;
        imgData: JImgData;
        w?: number;
        h?: number;
        isBack?: boolean;
    }): Promise<{
        e: HTMLImageElement | HTMLDivElement;
        offsetX: number;
        offsetY: number;
    }>;
    getPEle(this: JMain, op: {
        pos: number[];
        show: string;
        color?: string;
        fontSize?: number | string;
        viewW: number;
        viewH: number;
    }): HTMLDivElement;
    checkCss(this: JMain): Promise<void>;
    /** 保存配置json */
    saveOPJson(this: JMain): void;
    /** 读取配置json */
    loadOPJson(this: JMain): any;
    /** 触发键盘key的事件 */
    dispatchKeyEvent(this: JMain, op: {
        key: string;
        dom: HTMLElement;
        handlerDom: HTMLElement;
        type: "key" | "icon";
    }): void;
    /** 刷新皮肤 */
    reFreshPhoneSkin(this: JMain): Promise<void>;
    /** 设置多选高亮 */
    setKeySelectHL(this: JMain, keyName: string, handlerDiv: HTMLElement): void;
    getNewNum(this: JMain, prevKey: string, baseData: any, count?: number): string;
    createNewBoardKey(this: JMain): void;
}
/** 输入码 */
type BoardInputType = {
    /**
     * 输入码背景指定样式
     * @example BACK_STYLE=127表示调用 127 号风格（由default.css 生成）
     */
    BACK_STYLE?: string;
    /**
     * 输入码前景（字体及颜色）指定样式
     * @example FORE_STYKE=128
     */
    FORE_STYLE?: string;
};
/** 候选栏 */
type BoardCandType = {
    /**
     *  候选栏绘制时的坐标 X,Y 及宽 W,高 H
     * @example VIEW_RECT=0,0,720,90表示(0,0)处绘制一个宽 720,高 90的 cand
     * */
    VIEW_RECT?: string;
    /**
     * 表示 CAND 参数对应的文件名（不需要写后缀名.cnd）
     * @example LAYOUT_NAME=cand1
     */
    LAYOUT_NAME?: string;
    /**
     * Candidata 类型
     * @description 0 ：Candidata 可处于面板内,通过划动选择候选字（划选皮肤）1 ：Candidata 处于面板内 2 ：Candidata 固定于面板上 3 ：候选条处于面板内,常驻显示 4 ：候选条处于面板上方,常驻显示
     * @example TYPE=4表示此候选条处于面板上方,常驻显示（这时,VIEW_RECT 中的坐标不再影响 cand,处于面板内的情况才会有效）
     */
    TYPE?: string;
};
/** 面板 */
type BoardPanelType = {
    /**
     * 面板背景指定样式
     * @example BACK_STYLE=116
     */
    BACK_STYLE?: string;
    /**
     * 划线效果的颜色和大小
     * @example FORE_STYLE=126
     */
    FORE_STYLE?: string;
    /**
     * 面板宽 W,高 H
     * @example SIZE=720,468
     */
    SIZE?: string;
    /**
     * 是否精确输入
     * @description 0 ：模糊输入 1 ：精确输入 当一个按键上有多个可用输入码时,需要用模糊输入.
     * @example NO_BLUE=1
     */
    NO_BLUR?: string;
    /**
     * 面板一共有多少按键
     * @example KEY_NUM=35
     */
    KEY_NUM?: string;
    /**
     * 面板中有多少补丁
     * @example TIP_NUM=7
     */
    TIP_NUM?: string;
    /**
     * 偏移量的种类个数（建议在 gen.ini 中定义）
     * @example OFFSET_NUM=10
     */
    OFFSET_NUM?: string;
    /**
     * 底部 bar 高度（wm 和 v5 平台特有）
     * @example BAR_H=90
     */
    BAR_H?: string;
    /**
     * 是否有自定义矩形 1 ：表示有 0 ：表示没有
     * @example CUSTOM_RECT=0
     */
    CUSTOM_RECT?: string;
};
/** 功能候选字类型面板参数 */
type BoardMoreType = {
    /**
     * 更多候选字拆分的单元格个数（行数,列数）
     * @example GRID=4,3在更多候选类型面板的候选区,绘制一个 4*3 的表格
     *  */
    GRID?: string;
    /** 水平分割线样式 */
    HLINE_STYLE?: string;
    /** 垂直分割线样式 */
    VLINE_STYLE?: string;
    /** 更多界面中字体的样式 */
    FORE_STYLE?: string;
    /** 更多界面中单元格效果样式 */
    CELL_STYLE?: string;
    /** 锁的样式 */
    LOCK_STYLE?: string;
    /**
     * 当前面板显示符号调用的布局文件名（不需要写后缀名.ini）
     * @example SYM_LAYOUT=symbol
     */
    SYM_LAYOUT?: string;
    /**
     * 当前面板调用更多候选字界面的布局文件名（不需要写后缀.ini）
     * @example LAYOUT_NAME=sel_ch
     */
    LAYOUT_NAME?: string;
};
/**气泡提示 */
type BoardHIntType = {
    /**
     * 当前面板调用的气泡样式数据文件名（不需要写后缀名.pop）
     * @example LAYOUT_NAME=hint1
     */
    LAYOUT_NAME?: string;
    /**
     * 默认显示类型 0 ：跟随按键 1 ：面板置顶
     * @example TYPE=1
     */
    TYPE?: string;
};
/** 列表,筛选列表 */
type BoardListType = {
    /** 列表背景边框样式 */
    BACK_STYLE?: string;
    /** 列表单元格样式 */
    CELL_STYLE?: string;
    /** 列表内文字显示样式 */
    FORE_STYLE?: string;
    /** 滚动条需要的混合颜色样式 */
    SCROLL_STYLE?: string;
    /** 单元格的宽和高 */
    CELL_SIZE?: string;
    /**
     * 列表起始位置 X,Y
     * @example POS=2,2在 PANAL 面板的（2,2）处绘制LIST
     */
    POS?: string;
    /**
     * 列表类型
     * @description 0 ：标准类型,处于面板内,永久显示 1 ：处于面板内,有列表项时显示 2 ：处于面板上方,始终显示 3 ：处于面板上方,有列表项时显示
     * @example TYPE=0
     */
    TYPE?: string;
    /**
     * 指定列表显示的单元格数
     * @example LIST_NUM=5此数目表示显示的单元格数,如果列表项很多,需要滚动显示.
     */
    LIST_NUM?: string;
    /**
     * 指定列表横排还是竖排
     * @description 0 ：竖排 1 ：横排
     * @example LIST_ORDER=1
     */
    LIST_ORDER?: string;
    /**
     * 列表中需要显示的内容,每个单元格间用半角空格隔开
     * @example NAMES=, . 全选 « »仅供显示,实际输出行为由 VALUE 决定
     */
    NAMES?: string;
    /**
     * 列表内容按下后的对应行为,每个单元格间用半角空格隔
     * @example VALUES=, . F47 F51 F52不仅支持符号,也支持功能.当加入特殊功能后,LIST 将不再允许添加列表项（新版）
     */
    VALUES?: string;
    /**
     * 单元格距离列表边框的间距,4 个值分别表示左边距,上边距,右边距,下边距
     * @example PADDING=2,2,2,4此参数可以使 LIST 与面板中按键对齐,达到预定效果
     */
    PADDING?: string;
    /**
     * 滚动条安放位置0 ：默认,对应向内1 ：对应向外
     * @example SCROLL_SIDE=0控制滚动条的安放位置
     */
    SCROLL_SIDE?: string;
};
/** 按键 */
type BoardKeyType = {
    /** 背景样式
     * @example BACK_STYLE=118
     */
    BACK_STYLE?: string;
    /** 按键前景指定样式,允许多个前景,前景间用英文逗号分隔
        * @example FORE_STYLE=1,88,200表示此键有 1,88,200 三个前景
        */
    FORE_STYLE?: string;
    /**
     * 前景样式偏移
     * @description 此参数和前景对应,一个参数对应一个前景,同样以英文逗号分隔,表示前景的偏移类型,序号和 gen.ini 中的[OFFSET*]的序号对应,如果无对应值则为 0,表示不偏移,居中对齐(下面的表格会提到 OFFSET 属性,已用阴影填充加强显示)
     * @example FORE_STYLE=1,88,200 POS_TYPE=0,2,10表示前景 1,距中显示；前景 88 使用2 号偏移；前景 200 使用 10 号偏移（序号由 gen.ini 生成）
     */
    POS_TYPE?: string;
    /**
     * 按键绘制时的坐标 X,Y 及宽 W,高 H
     * @example VIEW_RECT=45,3,60,70在 PANAL 面板(45,3)处绘制一个宽60 高 70 的键
     */
    VIEW_RECT?: string;
    /**
     * 按键点击范围补丁
     * @description 控制该键的实际点击位置X,Y 和宽 W,高 H当 TOUCH_RECT=0,0,0,0 或宽,高为 0 时,表示此键不可点击（常用做背景显示功能）
     * @example VIEW_RECT=45,3,60,70 TOUCH_RECT=43,0,66,72表示此键的实际点击范围是(43,0)处宽 66 高 72 的矩阵.
     *  */
    TOUCH_RECT?: string;
    /** 此键上划的键值 */
    UP?: string;
    /** 此键下划的键值 */
    DOWN?: string;
    /** 此键左划的键值 */
    LEFT?: string;
    /** 此键右划的键值 */
    RIGHT?: string;
    /** 此键按键下的键值 */
    CENTER?: string;
    /** 直接点击后传给内核的键值
     * @description SHOW 的作用：向内核反馈点击此键后的键值,供内核判断该键类型.能在输入码上回馈键值.
     *
     */
    SHOW?: string;
    /** 长按后对应的字符或功能
     * @description HOLD 与 HOLDSYM 不能共存,两者只能选一个.当一个键没有 HOLD 和 HOLDSYM 属性时,默认按住效是弹出的气泡显示该键的所有字符.
     * @example HOLD=F1 按住为 F1 打开符号面板注：HOLD=字符时,此字符会参与输入码.
     */
    HOLD?: string;
    /** 长按后对应的字符集（字符之间无分隔符）,以字符形式直接输出
     *  @description HOLD 与 HOLDSYM 不能共存,两者只能选一个.当一个键没有 HOLD 和 HOLDSYM 属性时,默认按住效是弹出的气泡显示该键的所有字符.
     * @example HOLDSYM=ABCD@#表示长按对应的字符集是 ABCD@#然后通过手势选择字符,字符间无间隔.当 HOLDSYM=单字符时,表示此字符直接上屏.
    */
    HOLDSYM?: string;
    /**针对特殊状态时的显示及样式及功能（状态补丁）
     * @description S 代表状态类型,_后的数字表示 TIP 序号（详见 S 状态定义）当有多个状态时,状态之间用“|”间隔
     * @example STAT_STYLE=S4_1|S14_2表示 S4（有输入码状态）时,执行[TIP1]补丁,使该键在显示或功能上发生改变.在 S14（中文临时英文输入状态）时,执行[TIP2]
    */
    STAT_STYLE?: string;
    /**
     * 空格_语音_坐标(5.15+版新功能)
     * @description 长按空格语音图标的坐标定位,原点在空格按键矩阵的左上角
     * @example SPACE_VOICE_XY=200,40
     */
    SPACE_VOICE_XY?: string;
    BACK_ANIM_STYLE?: string;
    FORE_ANIM_STYLE?: string;
};
/**
 * 补丁,针对按键 KEY 的STAT_STYLE 生效
 */
type BoardTipType = {
    /** 状态补丁生效时,按键背景指定样式 */
    BACK_STYLE?: string;
    /** 状态补丁生效时,按键前景指定样式,支持多前景,逗号分隔 */
    FORE_STYLE?: string;
    /** 状态补丁生效时,前景的偏移类型 */
    POS_TYPE?: string;
    /** 状态补丁生效时,上划按键对应的字符或功能 */
    UP?: string;
    /** 状态补丁生效时,下划按键对应的字符或功能 */
    DOWN?: string;
    /** 状态补丁生效时,左划按键对应的字符或功能 */
    LEFT?: string;
    /** 状态补丁生效时,右划按键对应的字符或功能 */
    RIGHT?: string;
    /** 状态补丁生效时,按下按键对应的字符或功能 */
    CENTER?: string;
    /** 状态补丁生效时,长按按键对应的字符或功能 */
    HOLD?: string;
    /** 状态补丁生效时,长按按键对应的字符集 */
    HOLDSYM?: string;
    /** 直接点击后传给内核的键值 */
    SHOW?: string;
};
/**
 * 前影偏移类型,建议只在gen.ini 中起作用
 */
type BoardOffsetType = {
    /**
     * 自身矩阵中心点相对目标矩阵中心点的偏移量.（针对按键前景生效）目标矩阵的中心点：按键的正中心在主面板调用时,由属性 POS_TYPE 调用
     * @example 自身矩阵中心点相对目标矩阵中心点的偏移量.（针对按键前景生效）目标矩阵的中心点：按键的正中心
     */
    POS?: string;
};
/** 显示候选字 */
type CndCandType = {
    /**
     * 候选栏背景样式
     * @example BACK_STYLE=116
     */
    BACK_STYLE?: string;
    /**
     * 候选字前景样式（候选字字体,颜色样式）
     *  */
    FORE_STYLE?: string;
    /** 候选条单元格样式,分隔线,按下效果通过这个参数实现 */
    CELL_STYLE?: string;
    /**
     * 候选内容显示与外边框的间距,4 个值分别代表示左边距,上边距,右边距,下边距
     * @example PADDING=0,0,65,0 表示候选内容与外边框间距为：左边距 0,上边距 0,右边距 65,下边距 0,用于给 ICON留空间放置或优化候选内容显示
     *  */
    PADDING?: string;
    /**
     * 第一个候选字比其它候选字多的间隔（第一个候选字仍距中显示）
     * @example FIRST_GAP=30
     */
    FIRST_GAP?: string;
    /** 第一个候选字前景（字体及颜色）样式 */
    FIRST_FORE?: string;
    /** 第一个候选字背景样式 */
    FIRST_BACK?: string;
    /** 图标的数量
     * @example ICON_NUM=4
     */
    ICON_NUM?: string;
    /**
     * 进入更多候选字的按钮空间,为 0 则不需要此键
     */
    MORE_W?: string;
    /**
     * 候选字间距
     * @example CELL_W=30
     */
    CELL_W?: string;
    /**
     * 补丁数量 注：CAND 中的 ICON 同样支持状态补丁
     * @example TIP_NUM=1
     */
    TIP_NUM?: string;
};
/**
 * 切换输入法面板的容器,快捷面板切换栏
 */
type CndSwitchType = {
    /**
     * 容器背景样式（边框样式）
     * @example NML_BACK_STYLE=124
     */
    NML_BACK_STYLE?: string;
    /**
     * 选中容器内条目时背景样式
     * @example SEL_BACK_STYLE=124
     */
    SEL_BACK_STYLE?: string;
    /**
     * 正常状态,容器内条目字体样式
     * @example NML_FONT_STYLE=123
     */
    NML_FONT_STYLE?: string;
    /**
     * 选中容器内条目（焦点,当前面板）的字体样式
     * @example SEL_FONT_STYLE=143
     */
    SEL_FONT_STYLE?: string;
    /**
     *  容器内条目单元格间距
     * @example PADDING=0
     */
    PADDING?: string;
    /**
     * 输入法切换容器的风格
     * @description KEYMAP_MODE=1 简约风格 KEYMAP_MODE=0 正常风格（或省略不写）
     * @example KEYMAP_MODE=1
     */
    KEYMAP_MODE?: string;
};
/** 附加的图标 */
type CndIconType = {
    /** 图标背景样式 */
    BACK_STYLE?: string;
    /** 图标前景样式 */
    FORE_STYLE?: string;
    /**
     * 图标大小（宽,高）
     * @description 测试过,实际上不是拉伸,只是将图片摆在居中摆放在中间
     * @example SIZE=45,60
     */
    SIZE?: string;
    /**
     * 按下后执行的操作 注：ICON 不支持点划操作,不支持输出字符和输入码（1,2,3,4 除外,会自动转换成光标移动功能,例 KEY=1）
     * @example KEY=F31 按下后执行 F31（logo 菜单）
     */
    KEY?: string;
    /**
     * 锚点类型
     * @description 1～9 分别代表 CAND 矩阵内的 9 个点,以这些点为原点.1 左上角,2 中上,3 右上角,4 中左,5 正中心,6 中右,7 左下角,8 中下,9 右下角
     * @example ANCHOR_TYPE=5以 CAND 正中心为原点(0,0),之所以附加这么多的锚点类型是为了 ICON 的精确定位
     */
    ANCHOR_TYPE?: string;
    /**
     * 以 ANCHOR_TYPE 锚点类型为原点（0,0）,ICON 左上角相对此点的偏移
     * @example ANCHOR_TYPE=5 POS=-60,-20以类型 5 为原点,向左偏移 60,向上偏移 20（向右向下为增）
     */
    POS?: string;
    /**
     * 此图标是否在有候选字时显示
     * @description 1 ：无候选字时显示 2 ：有候选字时显示 3 ：有无候选字时都显示 0 ：都不显示
     * @example PERSIST=1
     */
    PERSIST?: string;
    /**
     * 针对特殊状态时的显示及样式及功能（状态补丁）S 代表状态类型,_后的数字表示 TIP序号（详见 S 状态定义）当有多个状态时,状态之间用“|”间隔
     * @example STAT_STYLE=S9_1 当处在 S9（中文联想状态）时,执行[TIP1]
     */
    STAT_STYLE?: string;
};
/** 图标状态补丁 */
type CndTipType = {
    /** 状态补丁生效时,图标背景样式 */
    BACK_STYKE?: string;
    /** 状态补丁生效时,图标前景样式 */
    FORE_STYLE?: string;
    /** 状态补丁生效时,按下后执行的操作 */
    KEY?: string;
};
/** 整体定义 */
type PopGlobalType = {
    /**
     * 图案的数量
     * @example ICON_NUM=3
     */
    ICON_NUM?: string;
};
type PopHintType = {
    /**
     * 气泡的图案样式序号（指向[ICON*]）
     * @example BACK_ICON=1 表示普通气泡使用[ICON1]的样式
     */
    BACK_ICON?: string;
    /** 箭头的图案样式序号（指向[ICON*]） */
    ARROW_ICON?: string;
};
/** 长按后的条状气泡 */
type PopBarType = {
    /**
     *  气泡的图案样式序号（指向[ICON*]）
     * @example BACK_ICON=3
     */
    BACK_ICON?: string;
    /**
     * 箭头的图案样式序号（指向[ICON*]）
     * @example ARROW_ICON=2
     */
    ARROW_ICON?: string;
    /** 列表单元格样式 */
    CELL_STYLE?: string;
};
type PopCrossType = {
    /** 上方字符使用的图标序号 */
    UP_ICON?: string;
    /** 下方字符使用的图标序号 */
    DOWN_ICON?: string;
    /** 左方字符使用的图标序号 */
    LEFT_ICON?: string;
    /** 右方字符使用的图标序号 */
    RIGHT_ICON?: string;
    /** 中间字符使用的图标序号 */
    CENTER_ICON?: string;
};
/** 按键拖拉时的气泡目前仅IPHONE 需要支持 */
type PopDrawType = {
    /** 上划的气泡图标序号 */
    DRAW_UP_ICON?: string;
    /** 下划的气泡图标序号 */
    DRAW_DN_ICON?: string;
    /** 左划的气泡图标序号 */
    DRAW_LT_ICON?: string;
    右划的气泡图标序号: any;
    DRAW_RT_ICON?: string;
};
/** 定义显示的气泡图案 */
type PopIconType = {
    /** 背景样式 */
    BACK_STYLE?: string;
    /** 前景样式 */
    FORE_STYLE?: string;
    /**
     * 图标大小
     * @example SIZE=80,91
     */
    SIZE?: string;
    /**
     * 针对气泡锚点的偏移气泡锚点在按键上边缘的正中间(0,0)
     * @example POS=0,-20 表示向正上方偏移 20
     */
    POS?: string;
    /**
     * 气泡内容与外边框间距,4 个值分别代表示左边距,上边距,右边距,下边距
     * @example PADDING=12,4,12,8
     */
    PADDING?: string;
};
/** 整体定义 */
type CssGlobalType = {
    /**
     * 预定义风格样式的数量
     * @example STYLE_NUM=210
     */
    STYLE_NUM?: string;
    /**
     * 表示当前 css 文件默认是针对何种分辨率的情况
     * @example FOR=720
     */
    FOR?: string;
};
/** 风格样式 */
type CssStyleType = {
    /**
     * 按键前景显示的文字
     * @example SHOW=Q
     */
    SHOW?: string;
    /**
     * 字体名称（优化搜搜皮肤自带字体）
     * @example FONT_NAME=luoli.ttf
     */
    FONT_NAME?: string;
    /**
     * 默认字体大小
     * @example FONT_SIZE=30
     */
    FONT_SIZE?: string;
    /**
     * 默认字体宽度
     * @example FONT_WEIGHT=300
     * */
    FONT_WEIGHT?: string;
    /**
     * 默认是否开启平滑字体 0 ：关闭 1 ：开启
     * @example FONT_CLEARTYPE=1
     */
    FONT_CLEARTYPE?: string;
    /**
     * 普通状态颜色（为 16 进制颜色）
     * @example NM_COLOR=1557a4
     */
    NM_COLOR?: string;
    /**
     * 高亮状态颜色
     * @example HL_COLOR=FFFFFF
     */
    HL_COLOR?: string;
    /**
     * 边框颜色
     * @example BORDER_COLOR=FFFFFF
     */
    BORDER_COLOR?: string;
    /**
     * 边框的粗细 (4.1 版+文字前景,特指下阴影)
     * @example BORDER_SIZE=4
     */
    BORDER_SIZE?: string;
    /**
     * 普通状态切片
     * @description 格式：NM_IMG=素材名,切片序号 注：素材名不写后缀.png,也可认为是切片名,同理
     * @example NM_IMG=fore1,3
     */
    NM_IMG?: string;
    /**
     * 高亮状态切片
     * @description 格式：HL_IMG=素材名,切片序号 注：素材名不写后缀.png,也可认为是切片名,同理.
     * @example HL_IMG=fore1,4
     */
    HL_IMG?: string;
    /** 按压动画 */
    PRESS_ANIM?: string;
};
/** 整体定义 */
type TilGlobalType = {
    /**
     * 是否用到 ALPHA 混合 0 ：不透明 1 ：半透明 2 ：全透明
     * @example USE_ALPHA=1 在新版皮肤中,已无明显作用.
     */
    USE_ALPHA?: string;
    /**
     * 切片数量
     * @example TILE_NUM=3
     */
    TILE_NUM?: string;
};
/** 切片 */
type TilImgType = {
    /**
     * 切片的坐标 X,Y 及宽 W,高 H
     * @example SOURCE_RECT=112,0,71,36 表示从对应的 png 素材切片,在(112,0)处,切出一个宽 71,高 36 的矩形做为切片
     *  */
    SOURCE_RECT: string;
    /** 内切的坐标 X,Y 及宽 W,高 H
     * @description 如果无此参数或 W,H 都是 0 的情况下,认为此图不拉伸,直接居中绘制到目标矩阵中.如果 SOURCE_RECT 和 INNER_RECT 完全一样,表示整张图拉伸绘制在目标矩阵中.内切会将切片分成 9 个区,其中四个角不会拉伸,中上 2 区,左中 4 区,中部 5 区,右中 6区,中下 8 区拉伸
     * @example SOURCE_RECT=0,0,159,102 INNER_RECT=0,0,159,102 表示整图拉伸绘制.SOURCE_RECT=58,46,3,4INNER_RECT=59,47,1,2 表示此图有拉伸区域,内切在 59,47,1,2（即切出 5 区,边线延伸出其它区）
     */
    INNER_RECT: string;
    /** 拉伸方法
     * @description 内切将切片分成 9 部分.中上（左右拉伸）,左中（上下拉伸）,中部（左右上下拉伸）,右中（上下拉伸）,中下（左右拉SCALE=1,1,1,1,1伸）为拉伸区拉伸填充方式：0 ：平铺1 ：拉伸
     * @example SCALE=1,1,1,1,1
     */
    SCALE: string;
};
declare class JBoardChildDom {
    /** 创建列表模式下元素 */
    createBoardListDom(this: JMain): void;
    /** 创建单键模式下按键元素 */
    createBoardSingleKeyDom(this: JMain): void;
    /** 创建单键模式下图标元素 */
    createBoardSingleIconDom(this: JMain): void;
    /** 创建多选模式下元素 */
    createBoardMultiKeyListDom(this: JMain): void;
}
type childDomType<K extends string = string> = {
    key?: K;
    type?: "normal" | "select" | "style" | "color" | "offset" | "key" | "fn";
    title: string;
    tip?: string;
    fn?: (v: string) => void;
    select?: {
        name: string;
        value: string;
    }[];
};
/** 创建子元素 */
declare function createChildDom<K extends string = string>(this: JMain, op: {
    data: childDomType<K>;
    baseData: any;
    type: string;
    saveUrl: string;
}): HTMLDivElement;
declare class JFlow {
    /** 初始化 */
    init(this: JMain): Promise<void>;
    /** 初始化数据 */
    initData(this: JMain): void;
    /** 初始加载数据 */
    initLoadData(this: JMain): Promise<void>;
    /** 解析键盘 */
    decodeBoard(this: JMain): Promise<void>;
    /** 解析键盘面板 */
    decodeBoard_Panel(this: JMain, data: BoardPanelType, keyName: string): Promise<void>;
    /** 解析键盘图标样式 */
    decodeBoard_IconStyle(this: JMain, op: {
        data: CndIconType;
        div: HTMLDivElement;
        handlerDiv: HTMLDivElement;
        rectW: number;
        rectH: number;
        keyName: string;
    }): Promise<void>;
    /** 解析键盘候选框 */
    decodeBoard_Cand(this: JMain, data: BoardCandType, keyName: string): Promise<void>;
    /** 解析键盘列表 */
    decodeBoard_List(this: JMain, data: BoardListType, keyName: string): Promise<void>;
    /** 解析键值key的样式 */
    decodeBoard_ImgStyle(this: JMain, op: {
        viewRectW: number;
        viewRectH: number;
        w?: number;
        h?: number;
        style: string;
        div: HTMLElement;
        pos_Type?: string;
        handlerDiv?: HTMLDivElement;
        keyName: string;
        size?: number[];
        isBack?: boolean;
        isCand?: boolean;
    }): Promise<void>;
    /** 解析键盘key */
    decodeBoard_Key(this: JMain, data: BoardKeyType, keyName: string): Promise<void>;
    initCmdDiv(this: JMain): void;
}
declare class JMain {
    /** 移动模块div */
    moveDiv: HTMLDivElement;
    /** 总操作div */
    cmdDiv: HTMLDivElement;
    /** 手机div */
    phoneDiv: HTMLDivElement;
    /** 手机候选栏div */
    phoneCandDiv: HTMLDivElement;
    /** 手机键盘div */
    phoneBoardDiv: HTMLDivElement;
    /** 手机数据操作div */
    phoneCmdDiv: HTMLDivElement;
    /** 手机配置div */
    phoneOPDiv: HTMLDivElement;
    /** 手机文件div */
    phoneFileDiv: HTMLDivElement;
    /** 手机配置key,用于保存 */
    phoneOPKey: string;
    /** 配置 */
    op: {
        /** 缩放 */
        phoneScale: number;
        /** 手机宽度 */
        phoneWidth: number;
        /** 手机高度 */
        phoneHeight: number;
        /** 基础文件夹 */
        dirBase: string;
        /** 资源文件夹 */
        resDir: string;
        /** 样式文件夹 */
        cssDir: string;
        /** 样式表名 */
        cssName: string;
        /** 键盘文件夹 */
        boardDir: string;
        /** 键盘表名 */
        boardName: string;
        /** 资料名 */
        genName: string;
        /** 是否在有候选字时显示 */
        isPersist: boolean;
        /** 配置切换key */
        opSwitchKey: "key" | "list" | "multiKey";
        /** 单选key */
        selectSingleKey: string;
        selectSingleType: "key" | "icon";
        /** 多选键 */
        selectMultiKeyList: string[];
        /** 多选自加 */
        multiAdd: string;
        /** 选中高亮key颜色 */
        selecthlKeyColor: string;
        /** 候选框名,这个不能更改,只能由其他数据决定 */
        candName: string;
        /** 冒泡名,这个不能更改,只能由其他数据决定 */
        hintName: string;
    };
    /** 样式数据 */
    cssData: any;
    /** 键盘数据 */
    boardData: any;
    /** 资料数据 */
    genData: any;
    /** 候选框数据 */
    candData: any;
    /** 冒泡数据 */
    hintData: any;
    /** 图片数据 */
    imageData: {
        [propName: string]: JImgData;
    };
    /** 键盘元素集合 */
    keyDomList: {
        [propName: string]: {
            name: string;
            dom: HTMLElement;
            handlerDom: HTMLElement;
            type: "key" | "icon";
        };
    };
    /** 样式路径 */
    get cssUrl(): string;
    /** 键盘路径 */
    get boardUrl(): string;
    /** 资料路径 */
    get genUrl(): string;
    /** 候选框路径 */
    get candUrl(): string;
    /** 冒泡路径 */
    get hintUrl(): string;
    constructor();
}
declare class JOPDiv {
    /** 创建配置div */
    createOPDiv(this: JMain): void;
    /** 创建候选框选择div */
    createCandSelectDiv(this: JMain): void;
    /** 创建多选高亮色的div */
    createSelectHLKeyDiv(this: JMain): void;
    /** 创建缩放div */
    createScaleDiv(this: JMain): void;
    /** 创建文件div */
    creatFileDiv(this: JMain): void;
    /** 创建单个文件div */
    createChildFileDiv(this: JMain, op: {
        title: string;
        value: string;
        inputFunc?: (s: string) => void;
        downloadData?: () => any;
        isOnlyRead?: boolean;
        exName?: string;
    }): void;
}
/** 创建样式的元素 */
declare function createStyleDom(this: JMain, op: {
    styleCount: string;
}): any;
/** 创建偏移的元素 */
declare function createOffsetDom(this: JMain, op: {
    offsetCount: string;
}): any;
/** ini转json */
declare function iniToJson(data: string): any;
/** json转ini */
declare function jsonToIni(data: any): string;
/** 获取ini文件数据 */
declare function getIniFileData(url: string): Promise<any>;
declare function getImageDataB64(url: string): Promise<{
    b64: string;
    w: number;
    h: number;
}>;
declare function getTilImageB64(b64: string, x: number, y: number, w: number, h: number): Promise<string>;
/** 保存json */
declare function saveJson(key: string, data: any): void;
/** 读取json */
declare function loadJson(key: string): any;
/**
    * 保存文本文件
    * @param text 文本内容
    * @param fileName 保存的文件名
    */
declare function saveStrFile(text: string, fileName: string): void;
/**
   * 保存二进制文件
   * @param blob 二进制内容
   * @param fileName 保存的文件名
   */
declare function saveBlobFile(blob: Blob, fileName: string): void;
/**
   * 保存base64文件
   * @param base64 base64字符串内容
   * @param fileName 保存的文件名
   */
declare function saveBase64File(base64: string, fileName: string): void;
type JImgData = {
    b64: string;
    til: any;
    w: number;
    h: number;
};
interface JMain extends JFlow, JAction, JOPDiv, JBoardChildDom {
    createChildDom: typeof createChildDom;
    createStyleDom: typeof createStyleDom;
    createOffsetDom: typeof createOffsetDom;
}
declare function applyMixins(derivedCtor: any, baseCtors: any[]): void;
declare function applyFuncs(derivedCtor: any, baseCtors: ((...arr: any[]) => any)[]): void;
