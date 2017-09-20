// cmd_text.js
define(function(){
    function isTextEnd(app, dat){
        return dat.text_ti>=dat.textContent.length
    }

    function processAfterWord(app, dat){
        // after a word display...
        if (isTextEnd(app, dat)){
            // if it is already the end, finish this text command.
            dat.text_si = 0;
            dat.text_ti = 0;
            dat.isText = false;
            dat.textName = "";
            dat.waitType = "";
            dat.waitTime = 0;

            dat.textContent = "";
            dat.script_i+=1;
        } else{
            // not the end, continue.
            dat.text_ti+=1;

            // next is the end, wait click.
            if (isTextEnd(app, dat)){
                dat.waitType = "click";
            } else {
                dat.waitType = "time";
                dat.waitTime = dat.textInter;
            }
        }
    }

    // methods
    var process = function (app, dat){
        // name: sayer name
        let curLine = dat.curLine;
        dat.textName = dat.curLine.name;
        dat.textContent = dat.curLine.content;
        dat.text_si = 0;
        dat.text_ti = 1;
        dat.isText = true;
        dat.waitType = "time";
        dat.waitTime = dat.textInter;
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
