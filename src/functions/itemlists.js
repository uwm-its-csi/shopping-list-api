const { app } = require('@azure/functions');
const { MongoClient } = require('mongodb');

const uri = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(uri);

async function handleGet(req, context) {
    const store = req.query.get('store') || null;

    const options = {
        projection: { _id: 0, store: 1, items: 1 },
    };

    let collection;
    let result;

    try {
        await client.connect();
        collection = client.db('shoppinglist').collection('itemlists');
    } catch (err) {
        context.log(err.message);
    }

    if (store) {
        context.log(`store param: ${store}`);

        try {
            const listDoc = await collection.findOne({
                store: store,
            });

            if (listDoc) {
                const list = listDoc.items;
                context.log(`Found list: ${JSON.stringify(list)}`);
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
            const lists = await collection.find({ }, options).toArray();
            result = JSON.stringify(lists);
        } catch (err) {
            context.log(err.message);
        } finally {
            await client.close();
        }
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

    context.log(`POST received: ${JSON.stringify(reqBody)}`);

    const filter = { store: reqBody.store };
    const options = {
        upsert: true,
        returnDocument: 'after',
    };
    
    const update = {
        $addToSet: {
            items: {
                'name': reqBody.item.name
            }
        }
    }

    try {
        await client.connect();
        const upsertResult = await client.db('shoppinglist').collection('itemlists').findOneAndUpdate(filter, update, options);
        result = JSON.stringify(upsertResult);

        context.log(result);
    } catch (err) {
        context.log(err.message);
    } finally {
        await client.close();
    }

    return {
        body: result,
        headers: {
            'content-type': 'applicatoin/json'
        }
    };
}

app.http('itemlists', {
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
                console.log('Unrecognized request method!');
        }
    }
});
