var webview = document.createElement('webview')
var devtools = document.createElement('webview')

webview.id = 'browser';
webview.setAttribute('allownw', '');
webview.setAttribute('partition', 'trusted');
devtools.id = 'devtools';
devtools.setAttribute('partition', 'trusted')

var container = global.contentDocument.getElementById('container')
var leftContainer = global.contentDocument.getElementById('leftContainer')
leftContainer.appendChild(webview)
container.appendChild(devtools)

webview.src = 'about:blank'

// webview.addEventListener('contentload', () => {
//   webview.executeScript({ code: "document.body.style.backgroundColor = '#f1f1f1'" });
// });

const devtoolsviewCommit = () => {
  devtools.removeEventListener('loadcommit', devtoolsviewCommit)
  webview.showDevTools(true, devtools)
  webview.request.onBeforeSendHeaders.addListener(
    (details) => {
      let type = details.type
      if(type === 'xmlhttprequest') {
        // let requestHeaders = details.requestHeaders || []
      }
    }, { urls: ['<all_urls>'] }, ['blocking', 'requestHeaders']
  )
  webview.request.onHeadersReceived.addListener(
    (details) => {
      let type = details.type
      if (type === 'xmlhttprequest') {
        let responseHeaders = details.responseHeaders || []
        responseHeaders.push({ name: 'Access-Control-Allow-Origin', value: "*" })
        responseHeaders.push({ name: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type, guest-token, user-token, timestamp" })
        responseHeaders.forEach(function(header) {
          if(header.name === 'Set-Cookie') {
            const newValue = header.value.replace('hd.weibo.com', 'localhost:8091')
            responseHeaders.push({
              name: 'Set-Cookie',
              value: newValue
            });
          }
        });
        return { responseHeaders: responseHeaders }
      }
    }, { urls: ['<all_urls>'] }, ['blocking', 'responseHeaders']
  );
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
          webview.src = 'about:blank'
        })
      })
      chrome.debugger.sendCommand(debuggee, 'Emulation.setEmitTouchEventsForMouse', {
        enabled: true,
        configuration: 'mobile' 
      }, () => {
      })
      chrome.debugger.sendCommand(debuggee, 'Emulation.setTouchEmulationEnabled', {
        enabled: true
      }, () => {
      })
    })
  })
}
devtools.addEventListener('loadcommit', devtoolsviewCommit);

devtools.src = 'about:blank'

const addressBar = global.contentDocument.getElementById('addressBar');
addressBar.value = 'about:blank';
addressBar.onkeypress = function(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13'){
    var url = this.value;
    webview.src = url;
    return false;
  }
}