
const Validator = require('./validator');

module.exports = {

    registerDatastoreFromModel: (Model, identity, datasource, modelsSchemaMap, sails) => {

        //preparated search or create datastores
        //const _datastores = sails.hooks.orm.datastores;

        //Create new Datastore
        //Model._adater
        Model._adapter.registerDatastore({
            host: datasource.host,
            port: datasource.port,
            schema: datasource.schema,
            adapter: datasource.adapter,
            user: datasource.user,
            password: datasource.password,
            database: datasource.database,
            identity: identity
        }, modelsSchemaMap, (err) => {

            if (err) {
                reject(err);
                throw err;
            }

            Model._adapter.datastores[identity].name = identity;
           // sails.hooks.orm.adapters[datasource.adapter] =  Model._adapter;
            //add new datastore in orm
            //_datastores[identity] = Model._adapter.datastores[identity];


        });

    },

    registerDatastoreFromAdapter: (adapter, identity, datasource, modelsSchemaMap, sails) => {

        //preparated search or create datastores
        const _datastores = sails.hooks.orm.datastores;

        //Create new Datastore
        //Model._adater
        adapter.registerDatastore({
            host: datasource.host,
            port: datasource.port,
            schema: datasource.schema,
            adapter: datasource.adapter,
            user: datasource.user,
            password: datasource.password,
            database: datasource.database,
            identity: identity
        }, modelsSchemaMap, (err) => {

            if (err) {
               // reject(err);
                throw err;
            }

            adapter.datastores[identity].name = identity;

            //add new datastore in orm
            _datastores[identity] = adapter.datastores[identity];



        });

    }
}

