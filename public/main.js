'use strict'

require.config({
    paths:{
        "scenario":"scenario"
    }
});

require(["scenario","cmd_bg","cmd_lh","cmd_wait","cmd_text"],function(scenario, cmd_bg, cmd_lh, cmd_wait, cmd_text){
    // register cmd
    let cmds={
        "bg": cmd_bg,
        "wait": cmd_wait,
        "lh": cmd_lh,
        "text": cmd_text
    };

    // util functions
    var prepareTrans = function(app, dat){
        let brt = new PIXI.BaseRenderTexture(dat.screenWidth, dat.screenHeight, PIXI.SCALE_MODES.LINEAR, 1);
        dat.gel.transRt = new PIXI.RenderTexture(brt);
        dat.gel.transSp = new PIXI.Sprite(dat.gel.transRt);
        // dat.gel.transSp.x = 100;
        // dat.gel.transSp.y = 100;
        // dat.gel.transSp.alpha = 0.5;
        app.stage.addChild(dat.gel.transSp);
        app.renderer.render(dat.ctn.base, dat.gel.transRt);
    }

    // global varaibles
    let dat = {
        screenWidth: 1280,
        screenHeight: 720,
        res:{bg:{},fg:{},sound:{},sys:{}},
        curscriptData: null,
        script_i: 0,
        curLabel: "",
        isText: false,
        textName: "",
        textContent: [],
        textInter: 4,
        text_pi: 0,
        text_li: 0,
        text_i: 0,
        text_pi_last: 0,
        text_li_last: 0,
        text_i_last: 0,
        curLine: null,

        // wait
        curCmd: null,
        startWaitTime: 0,
        waitTime: 0,
        waitType: "",

        // trans
        isTrans: false,
        prepareTrans: prepareTrans,
        transMethod: "",
        transParams: {},
        transTime: 0,
        transWaitTime: 0,

        // gel: game elements, they are objects on game displaying or playing.
        gel: {bg:{}, fg:{}, bgm:{}, se:{}, text:{textset:{}}, transSp:null, transRt:null},
        ctn: {base:null, bg:null, fg:null, msg:null},
    };

    // init app
    let app = new PIXI.Application(dat.screenWidth, dat.screenHeight, {backgroundColor:0xffffff0});
    document.body.appendChild(app.view);

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // load src
    PIXI.loader.add('curscript', 'scripts/komenco.sn')
        .add(["bg/bg_1.png","bg/bg_2.png","bg/bg_7home.jpg","bg/bg_alleynight.jpg","bg/bg_office.jpg"])
        .add(["fg/lh_1.png","fg/lh_2.png","fg/lh_nd.png","fg/lh_gg.png","fg/lh_ai.png", "fg/lh_test_nor.json"])
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

        let fgreg = /^fg\/(lh_[^.]+)\..*$/
        for (let url in res){
            if (fgreg.test(url)){
                let rs = fgreg.exec(url);
                dat.res.fg[rs[1]] = url;
            }
        }

        var style = new PIXI.TextStyle({
            fontFamily: '黑体',
            fontSize: 24,
            // fontStyle: 'italic',
            // fontWeight: 'bold',
            // fill: ['#000000', '#000000'], // gradient
            fill: 'black',
            padding: 4,
            // stroke: '#4a1850',
            // strokeThickness: 5,
            // dropShadow: true,
            // dropShadowColor: '#000000',
            // dropShadowBlur: 4,
            // dropShadowAngle: Math.PI / 6,
            // dropShadowDistance: 6,
            // wordWrap: true,
            // wordWrapWidth: 600,
            // breakWords: true,
            // trim: true
            lineHeight: 26
        });

        dat.gel.text["bg"] = new PIXI.Sprite(PIXI.loader.resources["sys/msgbk.png"].texture);
        dat.ctn.msg.addChild(dat.gel.text.bg);
        dat.gel.text.bg.anchor.set(0.5,1.0);
        dat.gel.text.bg.x = 1280/2;
        dat.gel.text.bg.y = 720;
        dat.gel.text["basic"] = new PIXI.Text("文字内容\n第二行。", style);
        dat.gel.text.basic.x = (1280-650)/2+25;
        dat.gel.text.basic.y = 720-200;
        dat.gel.text.textset["basic"] = {fixWidth:0, wrapWidth:600, pageHeight:180};
        dat.ctn.msg.addChild(dat.gel.text.basic);

        dat.curscriptData = scenario.analyze(res.curscript.data);
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
    // stage --
    //         base --
    //                 bg
    //                 fg
    //                 msg
    dat.ctn.base = new PIXI.Container();
    app.stage.addChild(dat.ctn.base);
    dat.ctn.bg = new PIXI.Container();
    dat.ctn.base.addChild(dat.ctn.bg);
    dat.ctn.fg = new PIXI.Container();
    dat.ctn.base.addChild(dat.ctn.fg);
    dat.ctn.msg = new PIXI.Container();
    dat.ctn.base.addChild(dat.ctn.msg);

    app.ticker.add(function(delta) {
        // console.log(delta*app.ticker.minFPS);
        // bunny.rotation += Math.PI * delta/app.ticker.FPS;
        // app.renderer.render(ctn, rt);
        transUpdate(delta);
        textUpdate(delta);
        waitAndProcessUpdate(delta);
    });

    // trans tick update
    function transUpdate(delta){
        if (dat.isTrans){
            dat.gel.transSp.alpha = dat.transWaitTime/dat.transTime;

            if (dat.transWaitTime<=0){
                dat.transWaitTime = 0;
                dat.transTime = 0;

                dat.isTrans = false;
                // remove trans pic
                app.stage.removeChild(dat.gel.transSp);
            }

            dat.transWaitTime -= delta;
        }
    }

    // text tick update
    function textUpdate(delta){
        if (dat.isText){
            let curLine = dat.textContent[dat.text_pi][dat.text_li];
            let curWord = curLine.charAt(dat.text_i-1);
            let textCmd = "";
            if (curWord=="\\"){
                // is text command
                // skip to the command end and process command.
                let isCommand = true;
                while(isCommand){
                    dat.text_i+=1;
                    curWord = curLine.charAt(dat.text_i-1);
                    textCmd+=curWord;
                    if (curLine.charAt(dat.text_i-2)=="\\" && (dat.text_i==curLine.lenght || curLine.charAt(dat.text_i)!="[")){
                        // command end without []
                        isCommand = false;
                    } else if (curLine.charAt(dat.text_i-1)=="]"){
                        // command end with []
                        isCommand = false;
                    }
                }
            }
            let disText = "";
            for (let li=0; li<=dat.text_li; li++){
                if (li==dat.text_li){
                    // last line
                    disText += dat.textContent[dat.text_pi][li].substring(0,dat.text_i);
                } else{
                    disText += dat.textContent[dat.text_pi][li]+"\n";
                }
            }
            // dat.gel.text.basic.text = disText;
            dat.gel.text.basic.text = disText.replace(/\\\w\[[^\]]+\]/g, "").replace(/\\\w/g, "");

            if (textCmd.length>0){
                dat.curCmd.processCmd(app, dat, textCmd);
            }
        }
    }

    // wait and command process tick update
    function waitAndProcessUpdate(delta){
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
    }
});





