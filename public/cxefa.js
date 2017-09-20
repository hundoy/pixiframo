'use strict'

require.config({
    paths:{
        "scenarilo":"scenarilo"
    }
});

require(["scenarilo","cmd_bg","cmd_lh","cmd_wait","cmd_text"],function(scenarilo, cmd_bg, cmd_lh, cmd_wait, cmd_text){
    let cmds={
        "bg": cmd_bg,
        "wait": cmd_wait,
        "lh": cmd_lh,
        "text": cmd_text
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
        isText: false,
        text_si: 0,
        text_ti: 0,
        textName: "",
        textContent: "",
        textInter: 5,
        curLine: null,
        curCmd: null,
        startWaitTime: 0,
        waitTime: 0,
        waitType: "",
        // gel: game elements, they are objects on game displaying or playing.
        gel: {bg:{}, fg:{}, bgm:{}, se:{}, text:{}},
        ctn: {base:null, bg:null, fg:null, msg:null},
    };

    // load src
    PIXI.loader.add('curscript', 'scripts/komenco.sn')
        .add(["bg/bg_1.png","bg/bg_2.png","bg/bg_7home.jpg","bg/bg_alleynight.jpg","bg/bg_office.jpg"])
        .add(["fg/lh_1.png","fg/lh_2.png","fg/lh_nd.png","fg/lh_gg.png","fg/lh_ai.png"])
        .add(["sys/msgbk.png"])
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

        dat.gel.text["bg"] = new PIXI.Sprite(PIXI.loader.resources["sys/msgbk.png"].texture);
        dat.ctn.msg.addChild(dat.gel.text.bg);
        dat.gel.text.bg.anchor.set(0.5,1.0);
        dat.gel.text.bg.x = 1280/2;
        dat.gel.text.bg.y = 720;
        dat.gel.text["basic"] = new PIXI.Text("文字内容\n第二行。", style);
        dat.gel.text.basic.x = (1280-650)/2+25;
        dat.gel.text.basic.y = 720-200;
        dat.ctn.msg.addChild(dat.gel.text.basic);

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
            dat.curCmd.afterClick(app, dat);
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
        fontFamily: '微软雅黑',
        fontSize: 24,
        // fontStyle: 'italic',
        // fontWeight: 'bold',
        fill: ['#000000', '#000000'], // gradient
        // stroke: '#4a1850',
        // strokeThickness: 5,
        // dropShadow: true,
        // dropShadowColor: '#000000',
        // dropShadowBlur: 4,
        // dropShadowAngle: Math.PI / 6,
        // dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 600
    });


    app.ticker.add(function(delta) {
        // console.log(delta*app.ticker.minFPS);
        // bunny.rotation += Math.PI * delta/app.ticker.FPS;
        // app.renderer.render(ctn, rt);

        if (dat.isText){
            if (dat.textContent.charAt(dat.text_ti-1)=="\\"){
                dat.text_ti+=1;
            }
            let disText = dat.textContent.substring(dat.text_si, dat.text_ti);
            dat.gel.text.basic.text = disText;
        }

        if (dat.waitType=="time"){
            if (dat.waitTime<=0){
                dat.waitType = "";
                dat.waitTime = 0;
                dat.curCmd.afterWait(app, dat);
            } else {
                dat.waitTime-=delta;
            }
        } else if (dat.waitType=="click" || dat.waitType=="forever"){
            
        } else {
            // script process
            if (dat.curscriptData){
                while(true){
                    dat.curLine = dat.curscriptData.lines[dat.script_i];
                    if (dat.curLine.cmd in cmds){
                        dat.curCmd = cmds[dat.curLine.cmd];

                        // cmd do two jobs: 1. pixi app work. 2.record current data.
                        dat.curCmd.process(app, dat);

                        // if process is not end, stop script loop and jump to next frame.
                        if (!dat.curCmd.isEnd(app, dat)) break;
                    }
                    dat.script_i+=1;
                }
            }
        }

    });
});





