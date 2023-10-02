const { app } = require('@azure/functions');

require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(uri);

app.http('shoppinglists', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        if (request.method === 'GET') {
            context.log('Received GET request');
            const userid = request.query.get('userid') || null;

            const allListsOptions = {
                projection: { _id: 0, id: 1, userID: 1, list: 1 },
            };

            let collection;
            let result;

            try {
                await client.connect();
                const db = client.db('shoppinglist');
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

                    context.log(listDoc);
                    if (listDoc) {
                        const list = listDoc.list;
                        console.dir(`Found list: ${JSON.stringify(list)}`);
                        result = JSON.stringify(list);
                    } else {
                        result = '[]';
                    }
                    
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
            
            return {
                body: result
            };
        } else if (request.method === 'POST') {
            let result;

            const body = await request.json();
            const query = { userID: body.userID };
            const update = { $set: body };
            const options = {upsert: true, new: true};

            try {
                await client.connect();
                const upsertResult = await client.db('shoppinglist').collection('shoppingLists').updateOne(query, update, options);
                result = JSON.stringify(upsertResult);

                context.log(result);
            } catch (err) {
                context.log(err.message);
            } finally {
                await client.close();
            }

            return { body: result };
        }
    }
});
