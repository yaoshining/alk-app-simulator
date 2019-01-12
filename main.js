global.contentDocument = document
require('./core.js')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')

let callID = 0;

var gui = require('nw.gui');
var clipboard = nw.Clipboard.get();
var mb = new nw.Menu({type:"menubar"});
mb.createMacBuiltin("alk-app-simulator");
var pagesMenu = new nw.Menu();
var host = 'http://localhost:8091';
var pages = [{
  name: '发现页',
  path: '/discover/discover'
}, {
  name: '文章底层页',
  path: '/article/view'
}, {
  name: '案例底层页',
  path: '/case/view?id=28776'
}, {
  name: '专题底层页',
  path: '/topic/view?id=122'
}, {
  name: '行业资讯列表',
  path: '/article/list'
}, {
  name: '个人资料页',
  path: '/my/uinfo'
}, {
  name: '销售助手-广告再现',
  path: '/sales/screenshots'
}, {
  name: '销售助手-h5创意',
  path: '/sales/h5demo'
}];
pages.forEach((page) => {
  var menuItem = new nw.MenuItem({ 
    label: page.name,
    click: () => {
      clipboard.set(host + page.path, 'text');
    }
  });
  pagesMenu.append(menuItem);
});
mb.append(new nw.MenuItem({
  label: '页面',
  submenu: pagesMenu
}));
var featuresMenu = new nw.Menu();
featuresMenu.append(new nw.MenuItem({
  label: '用户登录',
  click: () => {
    const webview = document.getElementById('browser');
    webview.contentWindow.postMessage({
      action: 'login'
    }, '*');
  }
}));
featuresMenu.append(new nw.MenuItem({
  label: '用户退出',
  click: () => {
    const db = low(adapter);
    db.unset('userInfo').write();
    db.unset('guest_token').write();
    db.unset('user_token').write();
  }
}));
featuresMenu.append(new nw.MenuItem({
  label: '用户信息',
  click: () => {
    const webview = document.getElementById('browser');
    webview.contentWindow.postMessage({
      action: 'printUserInfo'
    }, '*');
  }
}));
featuresMenu.append(new nw.MenuItem({
  label: '销售助手-广告在线过滤条件',
  click: () => {
    const db = low(adapter);
    const data = JSON.stringify([db.get('screenshots_filter').value()]);
    const method = "filter";
    const callbackId = ++callID;
    const webview = document.getElementById('browser');
    webview.contentWindow.postMessage({
      action: 'handleMessageFromNative',
      data: {method, callbackId, data}
    }, '*');
  }
}));
featuresMenu.append(new nw.MenuItem({
  label: '销售助手-h5创意过滤条件',
  click: () => {
    const db = low(adapter);
    const data = JSON.stringify([db.get('h5_filter').value()]);
    const method = "filter";
    const callbackId = ++callID;
    const webview = document.getElementById('browser');
    webview.contentWindow.postMessage({
      action: 'handleMessageFromNative',
      data: {method, callbackId, data}
    }, '*');
  }
}));
mb.append(new nw.MenuItem({
  label: '功能',
  submenu: featuresMenu
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