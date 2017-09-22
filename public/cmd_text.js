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
        let txt = dat.curLine.content;
        let inputLines = txt.split("\\n");
        let displayLines = [];
        for (let line_i in inputLines){
            let line = inputLines[line_i];
            let lineWidth = 0;
            let lineContent = "";
            for(let i=0; i<line.length; i++){
                let curWord = line.charAt(i);
                lineWidth += isDbcCase(curWord.charCodeAt()) ? wordWidth/2 : wordWidth;
                //console.log(curWord+" dbc "+isDbcCase(line.charCodeAt(i)));
                lineContent += curWord;
                if (lineWidth>=wrapWidth){
                    lineWidth = 0;
                    displayLines.push(lineContent);
                    lineContent = "";
                }
            }
            if (lineContent.length>0) displayLines.push(lineContent);
        }

        let textContent = [];
        let linesInOnePage = [];
        while(displayLines.length>0){
            linesInOnePage.push(displayLines.shift())
            if (linesInOnePage.length==lineNumPerPage){
                textContent.push(linesInOnePage);
                linesInOnePage = [];
            }
        }
        if (linesInOnePage.length>0) textContent.push(linesInOnePage);


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

    return {
        process: process,
        isEnd: isEnd,
        afterWait: afterWait,
        afterClick: afterClick
    };
});
