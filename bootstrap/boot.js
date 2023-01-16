
const Validator = require('../helpers/validator');
const { addDatastoreModel, addDatastoreNative } = require('../helpers/useDatastore');
var schemas = require('../helpers/schema');


module.exports = function inicialize(sails, resolve) {
    sails.log.debug(`-------------------------------`);
    sails.log.debug(`Run sails-hook-tenancy`);
    sails.log.debug(`-------------------------------`);


    //METHOD DEFAULT LOAD PLUGINS OF SAILS
    sails.on('hook:orm:loaded', async function () {

        var modelsSchemaMap = await schemas(sails);

        //Verify load config
        // if (typeof sails.config.tenancy !== 'function') {
        if (typeof sails.config.tenancy !== 'object') {
            sails.log.error(`Sails-Hook-Tenancy Require file ./config/tenancy (module.exports.tenancy)`)
            throw new Error(`Sails-Hook-Tenancy Require file ./config/tenancy (module.export.stenancy)`)
            //resolve();
        };


        //     █████╗░██████╗░██████╗░  ███╗░░░███╗███████╗████████╗██╗░░██╗░█████╗░██████╗░
        //    ██╔══██╗██╔══██╗██╔══██╗  ████╗░████║██╔════╝╚══██╔══╝██║░░██║██╔══██╗██╔══██╗
        //    ███████║██║░░██║██║░░██║  ██╔████╔██║█████╗░░░░░██║░░░███████║██║░░██║██║░░██║
        //    ██╔══██║██║░░██║██║░░██║  ██║╚██╔╝██║██╔══╝░░░░░██║░░░██╔══██║██║░░██║██║░░██║
        //    ██║░░██║██████╔╝██████╔╝  ██║░╚═╝░██║███████╗░░░██║░░░██║░░██║╚█████╔╝██████╔╝
        //    ╚═╝░░╚═╝╚═════╝░╚═════╝░  ╚═╝░░░░░╚═╝╚══════╝░░░╚═╝░░░╚═╝░░╚═╝░╚════╝░╚═════╝░
        //

        let arrayTenancy = [];
        // Add new Method to All ORM Models
        for (let key in sails.hooks.orm.models) {

            let Model = sails.hooks.orm.models[key];


            if (Model.tenancy) {
                
                //validate
                arrayTenancy.push(key);

                /**
                 * 
                 * @param {req.datasource | {...datastore}} argument 
                 * @returns {WModel}
                 */
                Model.use = (argument)=>{

                    var _datasource = Validator.datasource(argument, sails);

                    if (!_datasource) {
                       
                        throw Error('the req parameter in usingTenant() method not is valid se esperaba a Datsource{ host, user, password, dbname, identity, adapter, schema} But found this: '+ Object.keys(_datasource));
                    }

                    // If diferent go to search the multitentant;
                    return addDatastoreModel(Model, _datasource, modelsSchemaMap, sails);
                }
            }
        }



        //sails.log.info("Models with Tenacy Config", arrayTenancy);
        //Alert
        if (arrayTenancy.length == 0) {
            sails.log.warn('Alert!: No exist Models with attribute tenancy: true')
        }



        //    ░██████╗███████╗███╗░░██╗██████╗░  ███╗░░██╗░█████╗░████████╗██╗██╗░░░██╗███████╗
        //    ██╔════╝██╔════╝████╗░██║██╔══██╗  ████╗░██║██╔══██╗╚══██╔══╝██║██║░░░██║██╔════╝
        //    ╚█████╗░█████╗░░██╔██╗██║██║░░██║  ██╔██╗██║███████║░░░██║░░░██║╚██╗░██╔╝█████╗░░
        //    ░╚═══██╗██╔══╝░░██║╚████║██║░░██║  ██║╚████║██╔══██║░░░██║░░░██║░╚████╔╝░██╔══╝░░
        //    ██████╔╝███████╗██║░╚███║██████╔╝  ██║░╚███║██║░░██║░░░██║░░░██║░░╚██╔╝░░███████╗
        //    ╚═════╝░╚══════╝╚═╝░░╚══╝╚═════╝░  ╚═╝░░╚══╝╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░░╚═╝░░░╚══════╝

        //set Native Query
        //sails._getDatastore =  sails.getDatastore;

        /**
         * 
         * @param {string|req.datasource|{...datasource}} argument 
         * @returns 
         */

        //Aditional if preferer .use().sendNativeQuery
        sails.use = (argument)=>{

            //if is normal for datastore register in ./config/datastore
            if(!argument || typeof argument === 'string'){
                return sails.getDatastore(argument);
            }

            //validate req or datasource
            var _datasource = Validator.datasource(argument, sails);
            if (!_datasource) {
                throw Error('the req parameter in usingTenant() method not is valid se esperaba a Datsource{ host, user, password, dbname, identity, adapter, schema} But found this: '+ Object.keys(_datasource));
            }

            //preparate new getDataStore
            return addDatastoreNative(_datasource, modelsSchemaMap, sails);
        }


        sails.log.info(`Sails-Hook-Tenancy is Loaded Succesful by @Royaltics.Solutions`)
        sails.log.info(`---------------------------------------`)
    })



    return resolve();
}