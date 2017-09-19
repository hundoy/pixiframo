'use strict'

require.config({
    paths:{
        "scenarilo":"scenarilo"
    }
});

require(["scenarilo","cmd_bg","cmd_lh","cmd_wait"],function(scenarilo, cmd_bg, cmd_lh, cmd_wait){
    let cmds={
        "bg": cmd_bg,
        "wait": cmd_wait,
        "lh": cmd_lh
    };
    // // import
    // let scenarilo = new Scenarilo();

    // init app
    let app = new PIXI.Application(1280,720, {backgroundColor:0xffffff0});
    document.body.appendChild(app.view);

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // global varaibles
    let dat = {
        res:{bg:{},fg:{},sound:{},sys:{}},
        curscriptData: null,
        script_i: 0,
        curLabel: "",
        text_i: 0,
        curLine: null,
        startWaitTime: 0,
        waitTime: 0,
        waitType: "",
        // gel: game elements, they are objects on game displaying or playing.
        gel: {bg:{}, fg:{}, bgm:{}, se:{}},
        ctn: {base:null, bg:null, fg:null, msg:null}
    };

    // load src
    PIXI.loader.add('curscript', 'scripts/komenco.sn')
        .add(["bg/bg_1.png","bg/bg_2.png","bg/bg_7home.jpg","bg/bg_alleynight.jpg","bg/bg_office.jpg"])
        .add(["fg/lh_1.png","fg/lh_2.png","fg/lh_nd.png","fg/lh_gg.png","fg/lh_ai.png"])
    // .on("process", onLoading)
        .load(afterLoad);

    function afterLoad(loader, res){
        //basicText.text = JSON.stringify(scriptData);
        console.log(JSON.stringify(dat.curscriptData));

        let bgreg = /^bg\/bg_([^.]+)\..*$/
        for (let url in res){
            if (bgreg.test(url)){
                let rs = bgreg.exec(url);
                dat.res.bg[rs[1]] = url;
            }
        }

        let fgreg = /^fg\/lh_([^.]+)\..*$/
        for (let url in res){
            if (fgreg.test(url)){
                let rs = fgreg.exec(url);
                dat.res.fg[rs[1]] = url;
            }
        }

        dat.curscriptData = scenarilo.analyze(res.curscript.data);
    }

    // text
    var basicText = new PIXI.Text('Basic text in pixi');
    basicText.x = 30;
    basicText.y = 90;

    // function onLoading(loader, res){
    //     console.log("loading"+res.url);
    //     console.log("loading process"+loader.process+"%");
    //     basicText.text = "loading...";
    // }

    app.stage.addChild(basicText);

    app.stage.interactive = true;
    app.stage.on("pointertap", tapEvent);
    app.stage.on("tap", tapEvent);

    function tapEvent(event){
        // let pos = event.data.global;
        // console.log(pos.x);
        // console.log(pos.y);
        if (dat.waitType=="click"){
            dat.waitType = "";
            dat.script_i+=1;
        }
    }

    // containers define
    dat.ctn.base = new PIXI.Container();
    app.stage.addChild(dat.ctn.base);
    dat.ctn.bg = new PIXI.Container();
    dat.ctn.base.addChild(dat.ctn.bg);
    dat.ctn.fg = new PIXI.Container();
    dat.ctn.base.addChild(dat.ctn.fg);
    dat.ctn.msg = new PIXI.Container();
    dat.ctn.base.addChild(dat.ctn.msg);

    var style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    });

    app.ticker.add(function(delta) {
        // console.log(delta*app.ticker.minFPS);
        // bunny.rotation += Math.PI * delta/app.ticker.FPS;
        // app.renderer.render(ctn, rt);

        if (dat.waitType=="time"){
            if (dat.waitTime<=0){
                dat.waitType = "";
                dat.waitTime = 0;
                dat.script_i+=1;
            } else {
                dat.waitTime-=delta;
            }
        } else if (dat.waitType=="click" || dat.waitType=="forever"){
            // do nothing
        } else {
            // script process
            if (dat.curscriptData){
                while(true){
                    dat.curLine = dat.curscriptData.lines[dat.script_i];
                    if (dat.curLine.cmd in cmds){
                        let cmd = cmds[dat.curLine.cmd];

                        // cmd do two jobs: 1. pixi app work. 2.record current data.
                        cmd.process(app, dat);

                        // if process is not end, stop script loop and jump to next frame.
                        if (!cmd.isEnd(app, dat)) break;
                    }
                    dat.script_i+=1;
                }
            }
        }

    });
});





