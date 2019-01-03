const env = process.env.NODE_ENV || 'product';
const isProduct = env === 'product';
const NwBuilder = require('nw-builder');
const nw = new NwBuilder({
    files: './**',
    platforms: ['osx64'],
    version: '0.31.1',
    flavor: 'sdk'
});

nw.on('log',  console.log);

if(!isProduct) {
    nw.run().then(function () {
        console.log('all done!');
    }).catch(function (error) {
        console.error(error);
    });
}