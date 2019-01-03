global.contentDocument = document
require('./core.js')
var gui = require('nw.gui');
var clipboard = nw.Clipboard.get();
var mb = new nw.Menu({type:"menubar"});
mb.createMacBuiltin("alk-app-simulator");
var submenu = new nw.Menu();
var host = 'http://localhost:8091';
var pages = [{
  name: '发现页',
  path: '/discover/discover'
}, {
  name: '文章底层页',
  path: '/article/view'
}, {
  name: '行业资讯列表',
  path: '/article/list'
}];
pages.forEach((page) => {
  var menuItem = new nw.MenuItem({ 
    label: page.name,
    click: () => {
      clipboard.set(host + page.path, 'text');
    }
  });
  submenu.append(menuItem);
});
mb.append(new nw.MenuItem({
  label: '页面',
  submenu: submenu
}));
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