
const Validator = require('./validator');

const { registerDatastoreFromModel, registerDatastoreFromAdapter } = require('./registerDatastore');
const sendNativeQuery = require('./sendNativeQuery');

module.exports = {

    //Agregar datasource al modelo y devolver el mismo
    addDatastoreModel: (Model, datasource, modelsSchemaMap, sails) => {

        //preparated search or create datastores
        const _datastores = Model._adapter.datastores;
        const _identity = Validator.encodeIdentity(datasource.identity);

        console.log("Buscando Datastore for Model ", _identity, 'en: ', Object.keys(_datastores));

        //find datastore
        if (Validator.searchDataStore(_identity, _datastores)) {
            //set current datastore
            Model.datastore = _identity;

            return Model;
        } else {

            registerDatastoreFromModel(Model, _identity, datasource, modelsSchemaMap, sails);
            Model.datastore = _identity;
            // Model._adapter =  sails.hooks.orm.adapters[datasource.adapter];
            return Model;

        }
    },

    //Agregar datasource al modelo y devolver el mismo
    addDatastoreNative: (datasource, modelsSchemaMap, sails) => {
        const _adapters = sails.hooks.orm.adapters;
        const _adapter = _adapters[datasource.adapter];
        const _datastores = sails.hooks.orm.datastores;
        //preparated search or create datastores
        const _identity = Validator.encodeIdentity(datasource.identity);
        //const _adapter = sails.hooks.orm.adapters[datasource.adapter];
        console.log("Buscando Datastore for Native Query ", _identity, 'en: ', Object.keys(_datastores));

        //find datastore
        if (Validator.searchDataStore(_identity, _adapter.datastores)) {
            console.log("return sails._getDatastore()")
            //set current datastore
            return { 

                sendNativeQuery: (_nativeQuery, _valuesToEscape, explicitCb, _meta, more) =>  sendNativeQuery(_nativeQuery, _valuesToEscape, explicitCb, _meta, more, _adapter.datastores[_identity])
            };
            //return sails._getDatastore(_identity);
        } else {
            console.log("create native datasource for nativeQuey")

            // return new Promise(async (resolve, reject) => {
            registerDatastoreFromAdapter(_adapter, _identity, datasource, modelsSchemaMap, sails);

            return { 

                sendNativeQuery: (_nativeQuery, _valuesToEscape, explicitCb, _meta, more) =>  sendNativeQuery(_nativeQuery, _valuesToEscape, explicitCb, _meta, more, _adapter.datastores[_identity])
            };

        }
    }
}


            //Create new Datastore
/* Model._adapter.registerDatastore({
     host: datasource.host,
     port: datasource.port,
     schema: datasource.schema,
     adapter: datasource.adapter,
     user: datasource.user,
     password: datasource.password,
     database: datasource.database,
     identity: _identity
 }, modelsSchemaMap, (err) => {

     if (err) {
         reject(err);
         throw err;
     }

     //set new datastore
     Model.datastore = _identity;

     //
     _adapter.datastores[_identity].name = _identity;

     //add new datastore in orm
     _datastores[_identity] = _adapter.datastores[_identity];
     
     //replace current adapter
     Model._adapter = _adapter;

 });

*/