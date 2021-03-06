import {Terminal} from 'xterm';
import {fit} from 'xterm/lib/addons/fit/fit';
import {lib} from "libapps";
import screenfull = require("screenfull");

export class Xterm {
    elem: HTMLElement;
    term: Terminal;
    resizeListener: () => void;
    decoder: lib.UTF8Decoder;

    message: HTMLElement;
    messageTimeout: number;
    messageTimer: number;


    constructor(elem: HTMLElement) {
        this.elem = elem;
        this.term = new Terminal({
            rendererType: "canvas",
            scrollback: 100000,
            theme: {
                selection: 'rgba(0, 0, 255, 0.6)'
            },
            tabStopWidth: 4,
            fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace'
        });

        this.message = elem.ownerDocument ? elem.ownerDocument.createElement("div") : window.document.createElement("div");
        this.message.className = "xterm-overlay";
        this.messageTimeout = 2000;

        this.resizeListener = () => {
            fit(this.term);  // Fit the terminal when necessary
            this.term.scrollToBottom();
            this.showMessage(String(this.term.cols) + "x" + String(this.term.rows), this.messageTimeout);
        };

        setTimeout(() => {
            this.resizeListener();
            window.addEventListener("resize", () => {
                this.resizeListener();
            });

            this.term.on("selection", () => {
                let selection = this.term.getSelection();
                this.copyTextToClipboard(selection);
                this.term.focus();
            });
            let viewport = document.querySelector('.xterm-viewport');
            if (viewport) {
                (<any>viewport).contentEditable = true;
            }
            this.term.focus();

        }, 500);

        this.term.open(elem);

        this.decoder = new lib.UTF8Decoder();
        this.initToolbar();
    };

    private copyTextToClipboard(text: string): void {
        let textArea = document.createElement("textarea");

        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);

        textArea.select();

        try {
            let result = document.execCommand('copy', false);
            if (result) {
                this.showMessage("已复制", this.messageTimeout);
            } else {
                throw new Error('复制失败');
            }
        } catch (err) {
            // console.log('不能使用这种方法复制内容')
            this.showMessage("请右键复制", this.messageTimeout);
        }

        document.body.removeChild(textArea)
    };

    private initToolbar(): void {
        // fullscreen:
        let btn_fullscreen = document.querySelector('.btn-fullscreen');
        if (btn_fullscreen) {
            btn_fullscreen.addEventListener('click', () => {
                if (!screenfull.enabled) { // 如果不允许进入全屏，发出不允许提示
                    this.showMessage("不支持全屏", this.messageTimeout);
                    return
                }
                screenfull.toggle();
                let icon = document.querySelector('.btn-fullscreen .iconfont');
                if (icon) {
                    console.log(icon);
                    if (screenfull.isFullscreen) {
                        icon.classList.remove('icon-fullscreen-exit');
                        icon.classList.add('icon-fullscreen');
                    } else {
                        icon.classList.remove('icon-fullscreen');
                        icon.classList.add('icon-fullscreen-exit');
                    }
                }
                this.term.focus();
            });
        }
        // top
        let btn_top = document.querySelector('.btn-top');
        if (btn_top) {
            btn_top.addEventListener('click', () => {
                this.term.scrollToTop();
                this.term.focus();
            });
        }
        // bottom
        let btn_bottom = document.querySelector('.btn-bottom');
        if (btn_bottom) {
            btn_bottom.addEventListener('click', () => {
                this.term.scrollToBottom();
                this.term.focus();
            });
        }
        // select-all
        let btn_select_all = document.querySelector('.btn-select-all');
        if (btn_select_all) {
            btn_select_all.addEventListener('click', () => {
                this.term.selectAll();
                this.term.focus();
            });
        }
        // fixed
        let btn_fixed = document.querySelector('.btn-fixed');
        if (btn_fixed) {
            btn_fixed.addEventListener('click', () => {
                let toolbar = document.querySelector('.toolbar');
                if (toolbar) {
                    if (toolbar.classList.contains('right-0')) {
                        toolbar.classList.remove('right-0');
                        btn_fixed && btn_fixed.classList.remove('btn-selected');
                    } else {
                        toolbar.classList.add('right-0');
                        btn_fixed && btn_fixed.classList.add('btn-selected');
                    }
                }
                this.term.focus();
            });
        }
    }

    info(): { columns: number, rows: number } {
        return {columns: this.term.cols, rows: this.term.rows};
    };

    output(data: string) {
        this.term.write(this.decoder.decode(data));
    };

    showMessage(message: string, timeout: number) {
        this.message.textContent = message;
        this.elem.appendChild(this.message);

        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
        }
        if (timeout > 0) {
            this.messageTimer = setTimeout(() => {
                this.elem.removeChild(this.message);
            }, timeout);
        }
    };

    removeMessage(): void {
        if (this.message.parentNode == this.elem) {
            this.elem.removeChild(this.message);
        }
    }

    setWindowTitle(title: string) {
        document.title = title;
    };

    setPreferences(value: object) {
    };

    onInput(callback: (input: string) => void) {
        this.term.on("data", (data) => {
            callback(data);
        });

    };

    onResize(callback: (colmuns: number, rows: number) => void) {
        this.term.on("resize", (data) => {
            callback(data.cols, data.rows);
        });
    };

    deactivate(): void {
        this.term.off("data", () => {
        });
        this.term.off("resize", () => {
        });
        this.term.blur();
    }

    reset(): void {
        this.removeMessage();
        this.term.clear();
    }

    close(): void {
        window.removeEventListener("resize", this.resizeListener);
        this.term.destroy();
    }
}
