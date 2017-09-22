// cmd_text.js
define(function(){
    function isTextEnd(app, dat){
        return dat.text_pi==dat.text_pi_last && dat.text_li==dat.text_li_last && dat.text_i==dat.text_i_last
    }

    function isPageEnd(app, dat){
        let lineNum = dat.textContent[dat.text_pi].length-1;
        return dat.text_li == lineNum && dat.text_i==dat.textContent[dat.text_pi][lineNum].length-1;
    }

    function processAfterWord(app, dat){
        // after a word display...
        if (isTextEnd(app, dat)){
            // if it is already the end, finish this text command.
            dat.text_i = 0;
            dat.text_pi = 0;
            dat.text_li = 0;
            dat.text_i_last = 0;
            dat.text_pi_last = 0;
            dat.text_li_last = 0;
            dat.isText = false;
            dat.textName = "";
            dat.textContent = [];
            dat.waitType = "";
            dat.waitTime = 0;

            dat.script_i+=1;
        } else{
            // not the end, continue.
            dat.text_i+=1;

            if (dat.text_i>=dat.textContent[dat.text_pi][dat.text_li].length){
                dat.text_i = 0;
                dat.text_li+=1;
                if (dat.text_li>=dat.textContent[dat.text_pi].length){
                    dat.text_li = 0;
                    dat.text_pi+=1;
                }
            }

            // next is the end, wait click.
            if (isTextEnd(app, dat) || isPageEnd(app, dat)){
                dat.waitType = "click";
            } else {
                dat.waitType = "time";
                dat.waitTime = dat.textInter;
            }
        }
    }

    // 是否是半角
    function isDbcCase(c) {
        // 基本拉丁字母（即键盘上可见的，空格、数字、字母、符号）
        if (c >= 32 && c <= 127) {
            return true;
        }
        // 日文半角片假名和符号
        else if (c >= 65377 && c <= 65439) {
            return true;
        }
        return false;
    }

    // methods
    var process = function (app, dat){
        // name: sayer name
        let style = dat.gel.text.basic.style;
        let wordWidth = style.fontSize + dat.gel.text.textset.basic.fixWidth;
        let wrapWidth = dat.gel.text.textset.basic.wrapWidth;
        let lineHeight = style.lineHeight;
        let pageHeight = dat.gel.text.textset.basic.pageHeight;
        let lineNumPerPage = Math.floor(pageHeight/lineHeight);
        console.log(lineNumPerPage+" lines per page.");
        let txt = dat.curLine.content.replace(/\\(p|e)/g, "\\p$PAGE$").replace(/\\n/g, "\\n$LINE$");

        // arrange input text to pages/lines array.
        let inputPages = txt.split("$PAGE$");
        for (let p in inputPages){
            let page = inputPages[p];
            let inputLines = page.split("$LINE$");
            inputPages[p] = inputLines;
        }

        // iterate input pages/lines to generate text display content 2D array
        let textContent = [];
        for (let p in inputPages){
            let page = inputPages[p];
            let linesInOnePage = [];
            for (let line_i in page){
                let line = page[line_i];
                let lineWidth = 0;
                let lineContent = "";
                let isCommand = false;
                for(let i=0; i<line.length; i++){
                    let curWord = line.charAt(i);
                    if (!isCommand && curWord=="\\"){
                        // start of text command.
                        isCommand = true;
                    } else if (isCommand){
                        // during text command.
                        if (line.charAt(i-1)=="\\" && line.charAt(i+1)!="["){
                            // end of text command, when there is no []
                            isCommand = false;
                        } else if (curWord=="]"){
                            // end of text command, when there is []
                            isCommand = false;
                        }
                    } else {
                        lineWidth += isDbcCase(curWord.charCodeAt()) ? wordWidth/2 : wordWidth;
                    }
                    lineContent += curWord;
                    if (lineWidth>=wrapWidth){
                        linesInOnePage.push(lineContent);
                        lineWidth = 0;
                        lineContent = "";
                        if (linesInOnePage.length==lineNumPerPage){
                            // page full, add one page.
                            textContent.push(linesInOnePage);
                            linesInOnePage = [];
                        }
                    }
                }
                // add left content to a line.
                if (lineContent.length>0) linesInOnePage.push(lineContent);
            }

            // add left lines to a page.
            if (linesInOnePage.length>0) textContent.push(linesInOnePage);
        }

        // pass to dat
        dat.textName = dat.curLine.name;
        dat.textContent = textContent;
        dat.isText = true;
        dat.waitType = "time";
        dat.waitTime = dat.textInter;
        dat.text_pi = 0;
        dat.text_li = 0;
        dat.text_i = 0;
        dat.text_pi_last = dat.textContent.length-1;
        dat.text_li_last = dat.textContent[dat.text_pi_last].length-1;
        dat.text_i_last = dat.textContent[dat.text_pi_last][dat.text_li_last].length-1;
    };

    var isEnd = function(app, dat){
        return false;
    }

    var afterWait = function(app, dat){
        processAfterWord(app, dat);
    }

    var afterClick = function(app, dat){
        processAfterWord(app, dat);
    }

    // process text cmd
    var processCmd = function(app, dat, textCmd){
        if (textCmd=="l" || textCmd=="p"){
            // wait click
            dat.waitType = "click";
        } else if (textCmd.charAt(0)=='w'){
            let wt = parseInt(textCmd.substring(2,textCmd.length-1));
            dat.waitType = "time";
            dat.waitTime = wt;
        }
    }

    return {
        process: process,
        isEnd: isEnd,
        afterWait: afterWait,
        afterClick: afterClick,
        processCmd: processCmd
    };
});
