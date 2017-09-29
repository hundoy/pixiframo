// init app
var app = new PIXI.Application(800,600, {backgroundColor:0xffffff0});
document.body.appendChild(app.view);

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// image
var bunny = PIXI.Sprite.fromImage('images/1.png');
bunny.anchor.set(0.5);
bunny.x = app.renderer.width / 2;
bunny.y = app.renderer.height / 2;
// Opt-in to interactivity
bunny.interactive = true;
// Shows hand cursor
bunny.buttonMode = true;
// Pointers normalize touch and mouse
bunny.on('pointerdown', onClick);

app.stage.addChild(bunny);

function onClick () {
    bunny.scale.x *= 1.25;
    bunny.scale.y *= 1.25;
}

// container
// texture
var tex1 = PIXI.Texture.fromImage("images/1.png");
var tex2 = PIXI.Texture.fromImage("images/2.png");
var tex3 = PIXI.Texture.fromImage("images/3.png");

var sp1 = new PIXI.Sprite(tex1);
var sp2 = new PIXI.Sprite(tex1);
var sp3 = new PIXI.Sprite(tex1);
var ctn = new PIXI.Container();
sp1.position.set(30,30);
sp2.position.set(12,12);
sp3.position.set(24,44);
ctn.addChild(sp1);
sp1.addChild(sp2);
sp1.addChild(sp3);
ctn.alpha = 1.0;

app.stage.addChild(ctn);

var brt = new PIXI.BaseRenderTexture(300, 300, PIXI.SCALE_MODES.LINEAR, 1);
var rt = new PIXI.RenderTexture(brt);
var sprite = new PIXI.Sprite(rt);
sprite.x = 450;
sprite.y = 60;
sprite.alpha = 0.3;
app.stage.addChild(sprite);

// load test
PIXI.loader.add('script1', 'scripts/note.txt')
    .on("process", onLoading)
    .load(onLoaded);


// text
var basicText = new PIXI.Text('厅【伐罪吊民地Basic text in pixi');
basicText.x = 30;
basicText.y = 90;

function onLoading(loader, res){
    console.log("loading"+res.url);
    console.log("loading process"+loader.process+"%");
    basicText.text = "loading...";
}

// after load, change the text
function onLoaded(loader, res){
    basicText.text = res.script1.data;
}


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
    bunny.rotation += Math.PI * delta/app.ticker.FPS;
    app.renderer.render(ctn, rt);
});