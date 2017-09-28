// cmd_lh.js
define(function(){
    // private
    function genLh(lhSp, name, params){
        return {lhSp:lhSp, name:name, pos:params.pos, f:params.f};
    }

    function getPos(posstr){
        if (posstr=='la'){
            return [256,720];
        } else if (posstr=='lb'){
            return [256*2,720];
        } else if (posstr=='ra'){
            return [256*4,720];
        } else {
            return [256*3,720];
        }
    }

    // methods
    var process = function (app, dat){
        // name: pic name
        let curLine = dat.curLine;

        let lh = null;
        let params = curLine.params;
        if (dat.gel.fg[curLine.name]){
            lh = dat.gel.fg[curLine.name];
        } else {
            if (PIXI.loader.resources)

            let clothes = "nor";
            let action = "stand";
            let url = dat.res.fg[curLine.name];
            let tex = PIXI.loader.resources[url].texture;
            let lhSp;
            if (tex.indexOf(".json")){
                // tex is atlas, advanced lh
                let lhSp = new PIXI.Sprite(tex[curLine.name+"_base"]);
                lh = genLh(lhSp, curLine.name, params);
            } else {
                // tex is png, simple lh
                let lhSp = new PIXI.Sprite(tex);
                lh = genLh(lhSp, curLine.name, params);
            }
        }
        
        // set position
        let posxy = getPos(params.pos);
        lh.lhSp.anchor.set(0.5, 1.0);
        lh.lhSp.x=posxy[0];
        lh.lhSp.y=posxy[1];

        dat.ctn.fg.addChild(lh.lhSp);
        dat.gel.fg[curLine.name] = lh;
    };

    var isEnd = function(app, dat){
        return true;
    }

    return {
        process: process,
        isEnd: isEnd
    };
});
