const axios = require('axios');

exports.request = function(options) {
    options.url = options.path;
    const defaultOptions = {
        url: '',
        baseURL: 'http://hd.weibo.com/case/mobapi/',
        method: 'GET',
        data: {},
        params: {}
    };
    
    const mergedOptions = Object.assign({}, defaultOptions, options);
    return axios(mergedOptions).then((res) => res.data);
}

exports.photoBrowse = function(options) {
    // {
    //     thumb: '',    *缩略图地址
    //     img: '',      *原图地址
    //     title: '',    标题
    //     subTitle: ''  子标题
    // }
    const defaultOptions = {
        index: 0,
        list: []
    };
    const mergedOptions = Object.assign({}, defaultOptions, options);

    console.log('打开图片预览组件', mergedOptions);
    return true;
}

exports.showLogin = function() {
    console.group('showLogin');
    console.time('showLogin');
    console.log('正在呼起登录页');
    return new Promise((resolve, reject) => {
        axios({
            url: 'http://hd.weibo.com/login/api.php',
            params: {
                act: 'login',
                phone: '13888888888',
                vcode: '847316'
            }
        }).then(() => {
            console.log('登录成功');
            console.timeEnd('showLogin');
            console.groupEnd('showLogin');
            resolve({
                isSucceeded: true
            });
        });
    });
}

exports.checkLogin = function() {
    return true;
}

exports.showTalker = function() {
    console.group('showTalker');
    console.log('呼起小能');
    console.groupEnd('showTalker');
}

exports.sendMailWithCase = function(options) {
    console.log('呼起发送文件actionsheet, id=', options.id);
}

exports['_dsb.dsinit'] = function() {
    
}