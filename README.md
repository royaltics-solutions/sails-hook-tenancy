## Logo

![sails-hook-tenancy](https://github.com/royaltics-solutions/sails-hook-tenancy/raw/master/assets/logo.png)



## 1. Introduction

Sails Hook Tenancy is a high-performance, lightweight hook that enables multi-tenancy in Sails.js applications. It allows models to dynamically switch between different databases, sources, or drivers per request.

## Current Version

```bash
Version: 0.0.4
```

## Sails.js Deprecated

> [!CAUTION]
> **Important Notice**: Sails.js is considered a legacy framework and is no longer recommended for new enterprise applications. We strongly advise migrating to modern, robust, and high-performance frameworks such as **[NestJS](https://nestjs.com/)** or **[Fastify](https://www.fastify.io/)**.
>
> **Why this hook is still updated?**: This project (`sails-hook-tenancy`) continues to be maintained and updated with critical security and performance fixes (like the v0.0.4 context isolation) specifically to support **mature and large-scale projects** that are currently in the process of migrating. Our goal is to ensure stability and security for existing production environments until their transition to a modern stack is complete.

### 🚀 Key Features
- **Strict Context Isolation**: Each request operates in its own isolated context.
- **High Concurrency**: Built for heavy traffic, ensuring zero cross-tenant data leakage.
- **Prototypal Inheritance**: Efficient model cloning for request-level datastore configuration.
- **Native Query Support**: Multi-tenancy support even for raw SQL queries.

## 2. Get started

You can install the hook into your Sails app using pnpm (recommended) or npm.

```bash
# To install with pnpm (Recommended)
pnpm add sails-hook-tenancy

# To install with npm
npm install sails-hook-tenancy --save
```

If you created a new sails project with tenancy hook

```bash
# Create a new sails project
sails new project_name

# Enter project folder
cd project_name

# Install with pnpm (Recommended)
pnpm add sails-hook-tenancy

# Or install with npm
npm install sails-hook-tenancy --save

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

## 4. High Concurrency Strategy (Auth/Policies)

To ensure high performance and safety in multi-tenant environments, the recommended pattern is to resolve the tenant configuration in a **Policy** or **Middleware** and attach it to the request object. 

### Implementation Example: `api/policies/isTenancy.js`

```javascript
/**
 * isTenancy
 *
 * @description :: Policy to resolve tenant and assign context securely
 */

module.exports = async function (req, res, proceed) {

    // 1. Extract tenant identity (e.g., from header, subdomain, or JWT)
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
        return res.forbidden('Tenant identity is required');
    }

    // 2. Resolve database configuration (from a master DB or environment)
    // The object MUST contain: host, user, password, database, identity, adapter
    req.datasource = {
        identity: tenantId, // Unique ID for this tenant (used for connection pooling) or uuid
        adapter: 'sails-postgresql', // or 'sails-mysql', etc.
        host: 'localhost',
        port: 5432,
        user: 'db_user_' + tenantId,
        password: 'secure_password',
        database: 'db_tenant_' + tenantId,
        schema: 'public' // Optional
    };

    // 3. Proceed to the controller
    return proceed();
};
```

> [!TIP]
> **Why use this?**: This strategy guarantees that the **Context Isolation** (Prototypal Inheritance) implemented in `v0.0.4+` works flawlessly by providing a clean, request-scoped `req.datasource` object to your models.

## 5. Add Atributte tenancy in Models Muti-tenancy

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


```

## 6. Method .use() in Models

```javascript
/**
 * PersonsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    find: async function(req, res) {
        Persons.use(req.datasource).find().exec((err, data)=>{
            //return with custom response
            return res.response(err, data);
        })
    },

    findOne: async function(req, res) {
        const person = await Persons.use(req.datasource).findOne({id: req.params.id});
      //return with custom response
        return res.done(person);
    },

    create: async function(req, res) {
        const person = await Persons.use(req.datasource).create({...req.body}).fetch();
        //return with custom response
        return res.done(person);
    },

    update: async function(req, res) {
        const updatedPerson = await Persons.use(req.datasource).updateOne({id: req.params.id}).set({...req.body});
        //return with custom response
        return res.done(updatedPerson);
    },

    destroy: async function(req, res) {
        const deletedPerson = await Persons.use(req.datasource).destroyOne({id: req.params.id});
        //return with custom response
        return res.done(deletedPerson);
    }

};
```


```

## 7. Method .use() in SendnativeQuery

```javascript
/**
 * PersonsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    actionQuery: async function(req, res) {

        // Use req.datasource to perform a native SQL query on the tenant's database
        const query = 'SELECT * FROM persons WHERE id = $1';
        const results = await sails.use(req.datasource).sendNativeQuery(query, [req.params.id]);

        // return with custom response
        return res.done(results.rows);
    }
};
```

---

## 8. High Performance & Context Security

### 🛡️ Request Isolation (Fix in v0.0.4+)

> [!IMPORTANT]
> **Performance & Security Note**: In version `0.0.3` and earlier, the hook mutated the global Model singleton, which could lead to race conditions and "tenant leakage" under high concurrency. 

As of **v0.0.4**, we have implemented **Prototypal Inheritance Isolation**. When you call `.use(datasource)`, the hook creates a new object that inherits from your Model but overrides the `datastore` property only for that specific instance.

```javascript
// Internal mechanism for safety
const isolatedModel = Object.create(Model);
isolatedModel.datastore = _identity;
return isolatedModel;
```

This ensures:
1. **Thread-Safety**: Parallel requests to different tenants never interfere with each other.
2. **Zero Global Mutation**: The original Sails Models remain untouched.
3. **High Scalability**: Tested under high-concurrency stress tests to ensure reliable multitenancy.

---

#### 9. Credits

Developed by @Royaltics.Solutions

  - This project could be carried out thanks to the inspiration of the sails-hook-multitenant project (https://github.com/parleycl/sails-hook-multitenant) of Parleycl (2019). Thanks 
  - If you require a more complete solution => sails-hook-multitenant (2019)