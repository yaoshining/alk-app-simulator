const path = require('path');
const API = require(path.resolve('./api.js'));

(function() {
    function isPromise(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

    function call(method, args) {
        args = JSON.parse(args);
        if(!API[method]) {
            throw new Error(`API method '${method}' is not exist.`);
        }
        const result = API[method](args.data);
        if(isPromise(result)) {
            const callback = args['_dscbstub'];
            if(callback) {
                result.then((data) => {
                    window[callback](data);
                    delete window[callback];
                });
            }
        } else {
            return JSON.stringify({
                data: result
            });
        }
    }

    window._dsbridge = {
        call
    };

    window.addEventListener("message", (event) => {
        const msg = event.data;
        if(msg.action == 'handleMessageFromNative') {
            if(window._handleMessageFromNative) {
                window._handleMessageFromNative(msg.data);
            }
        }
        if(msg.action == 'login') {
            API.showLogin();
        }
        if(msg.action == 'printUserInfo') {
            console.log(API.getUser());
        }
        if(msg.action == 'goBack') {
            console.log(API.getUser());
        }
    }, false);

})(window);