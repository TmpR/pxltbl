const fs = require('fs');
const api = require('./api.js');







    api.start({
        callbackLoop: loop,
        fpsLimit: 30
    });







var screen = 'home';


function loop() {

    if(api.goHome) {
        screen = 'home';
        api.goHome = false;
        api.clearInputs();
    }

    switch(screen) {
        case 'home':
            home();
            break;
        case 'settings':
            settings();
            break;
        case 'brightness':
            brightness();
            break;
        case 'prog':
            try {
                prog.loop(api);
            } catch (err) {
                screen = 'home';
            }
            break;
    }

}


var path = './progs'
var progs = [];
var gotProgs = false;
var gettingProgs = false;
var curProg = 0;
var scroll = 0.0;

var btnDownPressed;
var btnUpPressed;

var prog;

function home() {



    if(!gotProgs && !gettingProgs) {
        gettingProgs = true;
        progs = [];
        fs.readdir(path, function(err, items) {

            for (var i=0; i<items.length; i++) {
                progs.push(items[i].substr(0,items[i].length-3));

            }
            progs.push('Settings');
            scroll = 23;
            curProg=0;
            gettingProgs = false;
            gotProgs = true;
        });
    }

    if(gotProgs) {
        if (api.buttons.down && !btnDownPressed) {
            curProg++;
            scroll = 23;
            if (curProg >= progs.length) curProg = 0;
            btnDownPressed = true;
        }

        if (api.buttons.up && !btnUpPressed) {
            curProg--;
            scroll = 23;
            if (curProg < 0) curProg = progs.length - 1;
            btnUpPressed = true;
        }

        if (!api.buttons.down) btnDownPressed = false;
        if (!api.buttons.up) btnUpPressed = false;


        if (api.buttons.fire) {
            if (curProg == progs.length - 1) {
                api.clearInputs();
                gotProgs = false;
                screen = 'settings';
                return;
            } else {
                loadProg(progs[curProg]);
                api.clearInputs();
                gotProgs = false;
                screen = 'prog';
                return;
            }
        }


        api.setColor(100, 100, 0);
        api.fillBox(1, 1, 3, 4);
        api.setPixel(2, 0);
        api.setPixel(0, 2);
        api.setPixel(4, 2);
        api.setColor(0, 0, 0);
        api.setPixel(2, 4);

        api.setColor(100, 100, 100);

        if (progs.length) {
            api.blank(0, 0, 0);
            if (curProg == progs.length - 1) api.setColor(50, 0, 255);
            api.text(progs[curProg], Math.round(scroll), 1);
            scroll = scroll - 0.7;
            if (scroll < -60) scroll = 23; //TODO add text bounds to api then use that to calc length
        }
    }

}


function settings() {

    if(api.buttons.down && !btnDownPressed) {
        //no other menu items yet

        btnDownPressed = true;
    }

    if(api.buttons.fire) {
        //only one thing to do
        api.clearInputs();
        screen = 'brightness';
        scroll = 23;
        return;
    }

    if(!api.buttons.down) btnDownPressed = false;


    api.blank(0,0,0);
    api.setColor(50,0,255);
    api.text('Brightness',Math.round(scroll),1);
    scroll = scroll - 0.7;
    if (scroll < -40) scroll = 23;

}

function brightness() {
    var step = 4;
    if(api.buttons.down && api.brightness > 1+step) api.brightness-=step;
    if(api.buttons.up && api.brightness < 255-step ) api.brightness+=step;

    api.blank(255,255,255);
    api.setColor(50,0,255);
    api.fillBox(0,10,api.brightness/10,1);

}

function loadProg(file) {
    //console.log(file);
    purgeCache(path+'/'+file+'.js');
    prog = require(path+'/'+file+'.js');
}



/**
 * Removes a module from the cache
 */
function purgeCache(moduleName) {
    // Traverse the cache looking for the files
    // loaded by the specified module name
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
    Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
        if (cacheKey.indexOf(moduleName)>0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
};

/**
 * Traverses the cache to search for all the cached
 * files of the specified module name
 */
function searchCache(moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function traverse(mod) {
            // Go over each of the module's children and
            // traverse them
            mod.children.forEach(function (child) {
                traverse(child);
            });

            // Call the specified callback providing the
            // found cached module
            callback(mod);
        }(mod));
    }
};