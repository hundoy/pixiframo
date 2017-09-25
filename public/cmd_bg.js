// cmd_bg.js
define(function(){
    // methods
    var process = function (app, dat){
        // name: pic name

        // before change pic
        dat.prepareTrans(app, dat);

        // change display
        let curLine = dat.curLine;
        let url = dat.res.bg[curLine.name];
        let bg = new PIXI.Sprite(PIXI.loader.resources[url].texture);
        if (dat.gel.bg[0]){
            dat.ctn.bg.removeChild(dat.gel.bg[0]);
        }
        dat.gel.bg[0] = bg;
        dat.ctn.bg.addChild(bg);

        dat.isTrans = true;
        dat.waitType = "time";
        dat.transTime = 30;
        dat.transWaitTime = dat.transTime;
        dat.waitTime = dat.transTime;
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
