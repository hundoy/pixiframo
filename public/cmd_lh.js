// cmd_lh.js
define(function(){
    // private
    function processLh(dat, lh, lhctn){
        // 1. lh is original lh ele.(if new, it's a {}.
        // 2. dat.curLine.params contain current lh info.
        // compare 1 and 2, change the diffent parts.(clothes, action or face)
        let params = dat.curLine.params;
        if (!("lhSp" in lh)){
            // new lh
            lh.name = dat.curLine.name;
            lh.clothes = "c" in params ? params.c : "nor";
            lh.action = "a" in params ? params.a : "stand";
            if ("f" in params) lh.face = params.f;

            let clhName = "lh_"+lh.name+"_"+lh.clothes;
            let alhName = clhName + "_" + lh.action;
            let url = dat.res.fg[clhName];

            if (url.indexOf(".json")>-1){
                // advanced lh
                lh.lhSp = new PIXI.Sprite(PIXI.Texture.fromFrame(alhName+"_base.png"));
                lh.faceSp = new PIXI.Sprite(PIXI.Texture.fromFrame(alhName+"_"+params.f+".png"))
                lh.lhInfo = dat.res.fg[clhName+"_info"][alhName];
                lh.faceSp.anchor.set(0, 0);
                lh.faceSp.position.set(lh.lhInfo.faceRectX, lh.lhInfo.faceRectY);
            } else {
                // single pic lh
                let tex = PIXI.loader.resources[url].texture
                lh.lhSp = new PIXI.Sprite(tex);
            }

            // lh position
            lh.pivotx = 0.5 * lh.lhSp.width;
            lh.pivoty = 1.0 * lh.lhSp.height;
            let posxy = getPos(params.pos);
            lh.x = posxy[0];
            lh.y = posxy[1];

            // add to container
            lhctn.addChild(lh.lhSp);
            if (lh.faceSp){
                lhctn.addChild(lh.faceSp);
            }
            lhctn.pivot.set(lh.pivotx, lh.pivoty);
            lhctn.position.set(lh.x, lh.y);
            dat.ctn.lh.addChild(lhctn);
            dat.gel.lh[dat.curLine.name] = lh;
        } else {
            // change old lh
            let isChangeBaseLh = false;
            if ("c" in params && params.c!=lh.clothes){
                // change clothes
                lh.clothes = params.c;
                isChangeBaseLh = true;
            }

            if ("a" in params && params.a!=lh.action){
                // change action
                lh.action = params.a;
                isChangeBaseLh = true;
            }

            let clhName = "lh_"+lh.name+"_"+lh.clothes;
            let alhName = clhName + "_" + lh.action;

            if (isChangeBaseLh){
                lhctn.removeChild(lh.lhSp);
                lh.lhSp.destroy();
                lh.lhSp = new PIXI.Sprite(PIXI.Texture.fromFrame(alhName+"_base.png"));
                lh.pivotx = 0.5 * lh.lhSp.width;
                lh.pivoty = 1.0 * lh.lhSp.height;
                lhctn.addChild(lh.lhSp);
            }

            // only advanced lh need face change, skip single pic lh's face change.
            if ("face" in lh && "f" in params && params.f!=lh.face){
                // change face.
                lhctn.removeChild(lh.faceSp);
                lh.faceSp.destroy();
                lh.faceSp = new PIXI.Sprite(PIXI.Texture.fromFrame(alhName+"_"+params.f+".png"))
                lh.lhInfo = dat.res.fg[clhName+"_info"][alhName];
                lh.faceSp.anchor.set(0, 0);
                lh.faceSp.x = lh.lhInfo.faceRectX;
                lh.faceSp.y = lh.lhInfo.faceRectY;
                lhctn.addChild(lh.faceSp);
            }

            // change pos
            if ("pos" in params){
                let posxy = getPos(params.pos);
                lh.x = posxy[0];
                lh.y = posxy[1];
                lhctn.position.set(lh.x, lh.y);
            }

            dat.gel.lh[dat.curLine.name] = lh;
        }

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
        // before change pic
        dat.prepareTrans(app, dat);

        // name: lh name
        let lhname = dat.curLine.name;

        let lh = null;
        let lhctn = null;
        if (dat.gel.lh[lhname]){
            // use existed lh
            lh = dat.gel.lh[lhname];
            lhctn = dat.ctn.lhs[lhname];
        } else {
            // create lh and container
            lh = {};
            lhctn = new PIXI.Container();
            dat.ctn.lhs[lhname] = lhctn;
        }

        lh = processLh(dat, lh, lhctn);


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
