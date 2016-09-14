
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var mainscene = ccs.load(res.MainScene_json);
        this.addChild(mainscene.node);

        // var a = mainscene.node.getChildByName("Button_1");
        // console.log(console.dir(a));
        // if( a ){
        //     a.addTouchEventListener(function(x, y){
        //         a.titleText = "hahaha";
        //         console.log("get click x");
        //         console.log(console.dir(x));
        //         console.log("get click y");
        //         console.log(console.dir(y));
        //     }, a);
        //     console.log("has aa");
        //     console.log(console.dir(a));
        // }

        var ttt = FindPatternsByCardNums([1,2,3, 3,3, 4,5,6, 7,7,7, 7,8,9]);
        console.log(ttt);

        // var a = new Array();
        // a.push(PatternTreeNodeConstructor());
        // a.push(PatternTreeNodeConstructor());
        // a.push(PatternTreeNodeConstructor());
        // console.log('aaa');
        // console.log(a);
        // for (var i in a){
        //     console.log(i);
        // }
        // console.log('end');


        /* you can create scene with following comment code instead of using csb file.
        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);
        */

        //console.log(console.dir(mainscene));

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

