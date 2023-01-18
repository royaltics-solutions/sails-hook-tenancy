## Logo

![sails-hook-tenancy](https://github.com/royaltics-solutions/sails-hook-tenancy/raw/master/assets/logo.png)



## 1. Introduction

Sails Hook Tenancy it is a Basic and lite hook that will allow sails applications to use multi-tenancy methods for each Model specified as such.
Different databases or sources or drivers may be accessed in each client request. 
A new connection for each Tenant will be stored in the global datastore of sails or it will be accessed if it was already created.

## 2. Get started

You need npm to install the hook into your Sails app.

```bash
# To install with npm
npm install sails-hook-tenancy --save

```

If you created a new sails project with tenancy hook

```bash
# Create a new sails project
sail new project_name
# Enter to project
cd project_name
# Go to Folder Created
# To install with npm
npm install sails-hook-tenancy --save
# To install with yarn
# Lift your app
sails lift
```
## 3. Configuration

Is required a tenancy file in config of sails `./config/tenancy`

```javascript
module.exports.tenancy = {
    default: {
        localhost: '',
        port: '',
        password: '',
        user: ''
    }
}
```

## 4. Add Atributte tenancy in Models Muti-tenancy

```javascript
/**
 * Persons.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  //...others,

  //tableName: 'persons',

  tenancy: true,
  
  attributes: {
    name: 'string',
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  }
};

```


### 5. Method .use() in Models

```javascript
/**
 * PersonsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    find: async function(req, res) {
        Persons.use(datasource).find().exec((err, data)=>{
            //return with custom response
            return res.response(err, data);
        })
    },

    findOne: async function(req, res) {
        const person = await Persons.use(datasource).findOne({id: req.params.id});
      //return with custom response
        return res.done(person);
    },

    create: async function(req, res) {
        const person = await Persons.use(datasource).create({...req.body}).fetch();
      //return with custom response
        return res.done(person);
    }

};
```


### 6. Method .use() in SendnativeQuery

```javascript
/**
 * PersonsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    actionQuery: async function(req, res) {

        const results = await sails.use(datasource).sendNativeQuery('select * from persons where id = $1', [1]);

        //return with custom response
        return res.done(results);
    }
};
```

#### 7. Credits

Desarrollado por @Royaltics.Solutions

  - This project could be carried out thanks to the inspiration of the sails-hook-multitenant project (https://github.com/parleycl/sails-hook-multitenant) of Parleycl (2019). Thanks 
  - If you require a more complete solution => sails-hook-multitenant (2019)