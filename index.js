var _boot = require('./bootstrap/boot');
module.exports = function tenancy(sails) {
    return {

        defaults: {
            __configKey__: {
                _hookTimeout: 40000, // 4seg,
                name: 'Tenancy Hook'
            }
        },

        //BootsTrap
        initialize: async () => {
            return new Promise((resolve) => {
                _boot(sails, resolve)
            });
        }
    }
}
