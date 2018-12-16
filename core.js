var webview = document.createElement('webview')
var devtools = document.createElement('webview')

webview.id = 'browser';
devtools.id = 'devtools';
devtools.setAttribute('partition', 'trusted')

var container = global.contentDocument.getElementById('container')
container.appendChild(webview)
container.appendChild(devtools)

webview.src = 'about:blank'

const devtoolsviewCommit = () => {
  devtools.removeEventListener('loadcommit', devtoolsviewCommit)
  webview.showDevTools(true, devtools)
  chrome.debugger.getTargets((targets) => {
    console.warn(targets)
    let found = targets.find((target) => {
      if (target) {
        return target.url === 'about:blank'
      }
      return false
    })

    var debuggee = {
      targetId: found.id
    }
    console.warn(debuggee)
    chrome.debugger.attach(debuggee, '1.1', () =>{
      chrome.debugger.sendCommand(debuggee, 'Emulation.setDeviceMetricsOverride',{
        width: 375,
        height: 667,
        screenWidth: 375,
        screenHeight: 667,
        deviceScaleFactor: 2,
        scale: 1,
        positionX: 100,
        positionY: 100,
        fitWindow: false,
        mobile: true
      }, () => {
      })
      chrome.debugger.sendCommand(debuggee, 'Network.enable', () => {
        chrome.debugger.sendCommand(debuggee, 'Network.setUserAgentOverride', {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
        }, () => {
          webview.src = 'https://www.baidu.com'
        })
      })
      chrome.debugger.sendCommand(debuggee, 'Emulation.setEmitTouchEventsForMouse', {
        enabled: true,
        configuration: 'mobile' 
      }, () => {
      })
    })
  })
}
devtools.addEventListener('loadcommit', devtoolsviewCommit)

devtools.src = 'about:blank'

const addressBar = global.contentDocument.getElementById('addressBar');
addressBar.value = 'https://www.baidu.com';
addressBar.onkeypress = function(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13'){
    var url = this.value;
    webview.src = url;
    return false;
  }
}