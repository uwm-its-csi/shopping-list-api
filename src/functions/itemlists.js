const { app } = require('@azure/functions');

//require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.COSMOS_CONNECTION_STRING;

const client = new MongoClient(uri,
    {
        tlsAllowInvalidCertificates: true
    }
);

app.http('itemlists', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const options = {
            projection: { _id: 0, store: 1, items: 1 },
        };

        let db;
        let collection;
        let result;

        try {
            await client.connect();
            db = client.db('shoppinglist');
            collection = db.collection('itemlists');
        } catch (err) {
            context.log(err.message);
        }

        try {
            const lists = await collection.find({ }, options).toArray();
            result = JSON.stringify(lists);
        } catch (err) {
            context.log(err.message);
        } finally {
            await client.close();
        }

        return {
            body: result,
            headers: {
                'content-type': 'application/json'
            }
        };
    }
});
