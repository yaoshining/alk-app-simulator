const axios = require('axios');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

axios.interceptors.response.use((res) => {
    if(res.data.guest_token) {
        db.set('guest_token', res.data.guest_token).write();
    }
    if(res.data.user_token) {
        db.set('user_token', res.data.user_token).write();
    }
    return res;
});

function request(options) {
    options.url = options.path;
    const defaultOptions = {
        url: '',
        // baseURL: 'http://hd.weibo.com/case/mobapi/',
        baseURL: 'http://test.api.hd.weibo.com/appapi/',
        method: 'GET',
        data: {},
        params: {},
        headers: {
            'timestamp': new Date().getTime(),
            'guest-token': db.get('guest_token').value() || '',
            'user-token': db.get('user_token').value() || ''
        }
    };
    
    const mergedOptions = Object.assign({}, defaultOptions, options);
    delete mergedOptions.params;

    return axios(mergedOptions).then((res) => res.data);
}

exports.request = request;

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
    console.group('photoBrowse');
    console.log('打开图片预览组件', mergedOptions);
    console.groupEnd('photoBrowse');
    return true;
}

exports.showLogin = function() {
    console.group('showLogin');
    console.time('showLogin');
    console.log('正在呼起登录页');
    return new Promise((resolve, reject) => {
        request({
            path: '/passport/login?phone=13888888888&code=8473'
        }).then((res) => {
            console.log('登录成功', res);
            if(res.errno == 0) {
                currentUser = res.data;
                db.set('userInfo', res.data).write();
            }
            console.timeEnd('showLogin');
            console.groupEnd('showLogin');
            resolve({
                isSucceeded: true
            });
        });
    });
}

exports.saveUser = function(userInfo) {
    console.group('saveUser');
    console.log('同步用户信息', userInfo);
    db.set('userInfo', userInfo).write();
    console.groupEnd('saveUser');
}

exports.getUser = function() {
    return db.get('userInfo').value();
}

exports.checkLogin = function() {
    const state = db.get('userInfo').value() != undefined;
    console.group('checkLogin');
    console.log('login state is ', state);
    console.groupEnd('checkLogin');
    return state;
}

exports.showTalker = function() {
    console.group('showTalker');
    console.log('呼起小能');
    console.groupEnd('showTalker');
}

exports.showToast = function(options) {
    console.group('showToast');
    console.log('打开Toast', options);
    console.groupEnd('showToast');
}

exports.bindMail = function() {
    console.group('bindMail');
    console.log('绑定邮箱');
    console.groupEnd('bindMail');
}

exports.showShareButton = function(options) {
    console.group('showShareButton');
    console.log('显示分享按钮, options=', options);
    console.groupEnd('showShareButton');
}

exports.showVideo = function(options) {
    console.group('showVideo');
    console.log('播放视频, 地址：', options.url);
    console.groupEnd('showVideo');
}

exports.sendMailWithCase = function(options) {
    console.group('sendMailWithCase');
    console.log('呼起发送文件actionsheet, id=', options.id);
    console.groupEnd('sendMailWithCase');
}

exports.showADNote = function() {
    console.group('showADNote');
    console.log('打开广告在线弹框提示');
    console.groupEnd('showADNote');
}

exports.showRelatedIndustry = function() {
    console.group('showRelatedIndustry');
    console.log('打开关注行业界面');
    console.groupEnd('showRelatedIndustry');
}

exports.goBack = function() {
    window.history.go(-1);
}

exports['_dsb.dsinit'] = function() {
    
}

exports['_dsb.returnValue'] = function(ret) {
    
}