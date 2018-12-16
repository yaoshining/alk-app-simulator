global.contentDocument = document
require('./core.js')
var gui = require('nw.gui');

var mb = new nw.Menu({type:"menubar"});
mb.createMacBuiltin("alk-app-simulator");
nw.Window.get().menu = mb;
gui.Window.get().on('close', function(){
  gui.App.quit();
});

if (nw.App.argv.indexOf('inspect') !== -1) {
  nw.Window.open('about:blank', {
    "show": false,
    "width": 799,
    "height": 799,
  }, (inspectWin) => {
    inspectWin.maximize()
    inspectWin.window.location = "chrome://inspect/#devices"
    inspectWin.show()
  })
}