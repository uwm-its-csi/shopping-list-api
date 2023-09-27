const { app } = require('@azure/functions');

require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(uri);

app.http('itemlist', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const options = {
            projection: { _id: 0, name: 1 },
        };

        let db;
        let collection;
        let result;

        try {
            await client.connect();
            db = client.db('shoppinglist');
            collection = db.collection('itemList');
        } catch (err) {
            context.log(err.message);
        }

        try {
            const list = await collection.find({ }, options).toArray();
            result = JSON.stringify(list);
        } catch (err) {
            context.log(err.message);
        } finally {
            await client.close();
        }

        return { body: result };
    }
});
