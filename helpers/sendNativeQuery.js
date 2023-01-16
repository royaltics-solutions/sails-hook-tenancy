var helpSendNativeQuery = require('sails-hook-orm/lib/datastore-method-utils/help-send-native-query');
const parley = require('parley');


module.exports = (_nativeQuery, _valuesToEscape, explicitCb, _meta, more, datastore) => {
    
    let options = {
        manager: datastore.manager,
        connection: undefined,
        driver: datastore.driver,
        nativeQuery: _nativeQuery,
        valuesToEscape: _valuesToEscape,
        meta: _meta,
    };

    /* if (more) {
         _.extend(options, more);
     }*/

    return parley((done) => {
        if (!options.nativeQuery) {
            return done(new Error(
                'Invalid native query passed in to `.sendNativeQuery()`.  (Must be truthy-- e.g. "SELECT * FROM foo")'
            ));
        }
        helpSendNativeQuery(options, done);
    })

}