

module.exports = async (sails) => {

    //get current schema Models only for tenancy
    var SchemaMap = {};

    for (key in sails.hooks.orm.models) {
        ModelTenancy = sails.hooks.orm.models[key];

        if (ModelTenancy.tenancy) {

            //preparated schema
            SchemaMap[ModelTenancy.tableName] = {
                primaryKey: ModelTenancy.primaryKey,
                definition: ModelTenancy.schema,
                tableName: ModelTenancy.tableName,
                identity: ModelTenancy.identity
            }
        }
    }
    return SchemaMap;
}