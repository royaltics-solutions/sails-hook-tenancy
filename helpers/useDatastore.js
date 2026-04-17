
const Validator = require('./validator');

const { registerDatastoreFromModel, registerDatastoreFromAdapter } = require('./registerDatastore');
const sendNativeQuery = require('./sendNativeQuery');

module.exports = {

    //Agregar datasource al modelo y devolver el mismo
    addDatastoreModel: (Model, datasource, modelsSchemaMap, sails) => {

        //preparated search or create datastores
        const _datastores = Model._adapter.datastores;
        const _identity = Validator.encodeIdentity(datasource.identity);

        //console.log("Search Datastore for Model ", _identity, 'en: ', Object.keys(_datastores));

        //find datastore
        if (!Validator.searchDataStore(_identity, _datastores)) {
            registerDatastoreFromModel(Model, _identity, datasource, modelsSchemaMap, sails);
        }

        /**
         * FIX: AISLAMIENTO MEDIANTE HERENCIA PROTOTIPAL
         * Creamos un nuevo objeto que hereda del Modelo original.
         * Sobrescribimos 'datastore' solo en esta "instancia de petición".
         * Esto garantiza que Waterline use la identidad correcta sin mutar el Singleton global.
         */
        const isolatedModel = Object.create(Model);
        isolatedModel.datastore = _identity;

        return isolatedModel;
    },

    //Agregar datasource al modelo y devolver el mismo
    addDatastoreNative: (datasource, modelsSchemaMap, sails) => {
        const _adapters = sails.hooks.orm.adapters;
        const _adapter = _adapters[datasource.adapter];
        //preparated search or create datastores
        const _identity = Validator.encodeIdentity(datasource.identity);
        //const _adapter = sails.hooks.orm.adapters[datasource.adapter];

        //find datastore
        if (Validator.searchDataStore(_identity, _adapter.datastores)) {
           //console.log("return sails._getDatastore()")
            //set current datastore
            return { 

                sendNativeQuery: (_nativeQuery, _valuesToEscape, explicitCb, _meta, more) =>  sendNativeQuery(_nativeQuery, _valuesToEscape, explicitCb, _meta, more, _adapter.datastores[_identity])
            };
            //return sails._getDatastore(_identity);
        } else {
            //console.log("create native datasource for nativeQuey")

            // return new Promise(async (resolve, reject) => {
            registerDatastoreFromAdapter(_adapter, _identity, datasource, modelsSchemaMap, sails);

            return { 

                sendNativeQuery: (_nativeQuery, _valuesToEscape, explicitCb, _meta, more) =>  sendNativeQuery(_nativeQuery, _valuesToEscape, explicitCb, _meta, more, _adapter.datastores[_identity])
            };

        }
    }
}
