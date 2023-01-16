

module.exports = {
    datasource: (argument, sails) => {

        if (argument.constructor.name === 'IncomingMessage') {
            return argument;
        }

        //validate require { host, ...etc}
        if (typeof argument === 'object') {
            let _keys = ['host', 'user', 'password', 'database', 'identity', 'adapter'];
            for (let key of _keys) {
                if (!argument.hasOwnProperty(key) || !argument[key]) {
                    sails.log.error('The key: ', key, " in Datasource Object is undefined or null or invalid!")
                    return null;
                }
            }
        }
        return argument;
    },
    
    encodeIdentity: (identity) => {
        return "tenancy_" + Buffer.from(identity).toString('base64');
    },


    searchDataStore: (identity_encode, datastores) => {
        // Get Datastores current

        return Object.keys(datastores).indexOf(identity_encode) > -1;

    },

}