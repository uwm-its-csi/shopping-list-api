const { app } = require('@azure/functions');

require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(uri);

app.http('shoppinglist', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        if (request.method === 'GET') {
            context.log('Received GET request');
            const userid = request.query.get('userid') || null;

            const allListsOptions = {
                projection: { _id: 0, id: 1, userID: 1, list: 1 },
            };

            const oneListOptions = {
                projection: {}
            }
            
            let db;
            let collection;
            let result;

            try {
                await client.connect();
                db = client.db('shoppinglist');
                collection = db.collection('shoppingLists');
            } catch (err) {
                context.log(err.message);
            }

            if (userid) {
                console.log(`userid param: ${request.query.get('userid')}`);

                try {
                    const listDoc = await collection.findOne({
                        userID: userid,
                    });

                    const list = listDoc.list;
                    console.dir(`Found list: ${JSON.stringify(list)}`);
                    result = JSON.stringify(list);
                } catch (err) {
                    context.log(err.message);
                } finally {
                    await client.close();
                }
            } else {
                try {
                    const allLists = await collection.find({ }, allListsOptions).toArray();

                    console.log(`allLists: ${JSON.stringify(allLists)}`);

                    result = JSON.stringify(allLists);
                } catch (err) {
                    context.log(err.message);
                } finally {
                    await client.close();
                }
            }
            
            return { body: result };
        } else if (request.method === 'POST') {
            let result;

            context.log('Received POST request');
            result = 'Thanks for the POST request!'

            return { body: result };
        }

        
    }
});
