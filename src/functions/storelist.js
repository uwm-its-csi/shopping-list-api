const { app } = require('@azure/functions');
const { MongoClient } = require('mongodb');

const uri = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(uri);

async function handleGet(request, context) {
    const options = {
        projection: { _id: 0, store: 1 }
    }

    let collection;
    let result;

    try {
        await client.connect();
        collection = client.db('shoppinglist').collection('itemlists');
    } catch (err) {
        context.log(err.message);
    }

    try {
        const storeList = await collection.find({ }, options).toArray();
        result = JSON.stringify(storeList);
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

async function handlePost(reqBody, context) {
    let result;
    
    const doc = {
        store: reqBody.store,
        items: []
    }

    try {
        await client.connect();
        const insertResult = await client.db('shoppinglist').collection('itemlists').insertOne(doc);
        result = JSON.stringify(insertResult);
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

app.http('stores', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        switch (request.method) {
            case 'GET':
                return handleGet(request, context);
                break;
            case 'POST': {
                const reqBody = await request.json()
                    .catch((err) => {
                        context.log(err);
                        return {
                            jsonBody: 'Missing request body',
                            status: 400
                        }
                    });

                if (!reqBody || !reqBody.store) {
                    return {
                        jsonBody: 'Missing store property',
                        status: 400,
                    }
                }

                return handlePost(reqBody, context);
                break;
            }
            default:
                context.log('Unrecognized request method!');
        }
    }
})