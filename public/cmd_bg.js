// cmd_bg.js
define(function(){
    // methods
    var process = function (app, dat){
        // name: pic name
        let curLine = dat.curLine;
        let url = dat.res.bg[curLine.name];
        let bg = new PIXI.Sprite(PIXI.loader.resources[url].texture);
        app.stage.addChild(bg);
    };

    var isEnd = function(app, dat){
        return true;
    }

    return {
        process: process,
        isEnd: isEnd
    };
});
