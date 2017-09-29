// cmd_lh.js
define(function(){
    // private
    function genLh(dat){
        let curLine = dat.curLine;
        let lh = {lhSp:null, name:curLine.name, params:curLine.params};

        lh.clothes = "nor";
        lh.action = "stand";
        let baseName = "lh_"+lh.name+"_"+lh.clothes;
        let url = dat.res.fg[baseName];

        if (url.indexOf(".json")>-1){
            // atlas
            lh.lhSp = new PIXI.Sprite(PIXI.Texture.fromFrame(baseName+"_"+lh.action+"_base.png"));
            lh.faceSp = new PIXI.Sprite(PIXI.Texture.fromFrame(baseName+"_"+lh.action+"_"+lh.params.f+".png"))
            lh.lhInfo = dat.res.fg[baseName+"_info"][baseName+"_"+lh.action];
            // add face
            lh.faceSp.anchor.set(0, 0);
            lh.faceSp.x = lh.lhInfo.faceRectX;
            lh.faceSp.y = lh.lhInfo.faceRectY;
            lh.lhSp.addChild(lh.faceSp);
        } else {
            // single png
            let tex = PIXI.loader.resources[url].texture
            lh.lhSp = new PIXI.Sprite(tex);
        }

        // set base lh position
        let posxy = getPos(lh.params.pos);
        lh.lhSp.anchor.set(0.5, 1.0);
        lh.lhSp.x=posxy[0];
        lh.lhSp.y=posxy[1];

        return lh;
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
            // use existed lh
            lh = dat.gel.fg[curLine.name];
        } else {
            // create lh
            lh = genLh(dat);
        }

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
