// cmd_text.js
define(function(){
    function isTextEnd(app, dat){
        return dat.text_ti>=dat.textContent.length
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
        if (isTextEnd(app, dat)){
            dat.text_si = 0;
            dat.text_ti = 0;
            dat.isText = false;
            dat.textName = "";
            dat.textContent = "";

            dat.script_i+=1;
        } else{
            dat.text_ti+=1;

            if (isTextEnd(app, dat)){
                dat.waitType = "click";
            } else {
                dat.waitType = "time";
                dat.waitTime = dat.textInter;
            }
        }
    }

    return {
        process: process,
        isEnd: isEnd,
        afterWait: afterWait
    };
});
