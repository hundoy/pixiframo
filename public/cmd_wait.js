// cmd_wait.js
define(function(){
    // methods
    var process = function (app, dat){
        // name: click-wait for touch/click; n(a number)-wait for n delta; ''-wait forever
        let curLine = dat.curLine;
        let name = curLine.name;
        if (isNaN(name)){
            if (name=="click"){
                dat.waitType = "click";
            } else{
                dat.waitType = "forever";
            }
        } else{
            // wait n seconds.
            dat.waitType = "time";
            dat.waitTime = parseInt(name);
        }
    };
    
    var isEnd = function(app, dat){
        return false;
    }

    var afterWait = function(app, dat){
        dat.script_i+=1;
    }

    return {
        process: process,
        isEnd: isEnd,
        afterWait: afterWait
    };
});
