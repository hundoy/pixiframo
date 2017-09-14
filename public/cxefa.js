'use strict'

require.config({
    paths:{
        "scenarilo":"scenarilo"
    }
});

require(["scenarilo","cmd_bg"],function(scenarilo, cmd_bg){
    let cmds={
        "bg": cmd_bg
    };
    // // import
    // let scenarilo = new Scenarilo();

    // init app
    let app = new PIXI.Application(960,600, {backgroundColor:0xffffff0});
    document.body.appendChild(app.view);

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // global varaibles
    let curscriptData = null;
    let script_i = 0;
    let curLabel = "";
    let text_i = 0;

    // load src
    PIXI.loader.add('curscript', 'scripts/komenco.sn')
    // .on("process", onLoading)
        .load(scriptProcess);

    function scriptProcess(loader, res){
        //basicText.text = res.curscript.data;
        curscriptData = scenarilo.analyze(res.curscript.data);
        //basicText.text = JSON.stringify(scriptData);
        console.log(JSON.stringify(scriptData));
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
        if (curscriptData){
            while(true){
                let curLine = curscriptData.lines[script_i];
                let cmd = cmd[curLine.cmd];
                cmd.process(curLine);
                // if not end, stop script loop and jump to next frame.
                if (!cmd.isEnd()) break;
                script_i+=1;
            }
        }
    });
});





