const { app } = require('@azure/functions');

const { MongoClient } = require('mongodb');

const uri = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(uri);

async function handleGet(request, context) {
    //context.log('Received GET request');
    const userid = request.query.get('userid') || null;
    const storeid = request.query.get('storeid') || null;

    let collection;
    let result;

    try {
        await client.connect();
        const db = client.db('shoppinglist');
        collection = db.collection('shoppinglists');
    } catch (err) {
        context.log(err.message);
    }

    if (userid && !storeid) {
        //context.log(`userid param: ${request.query.get('userid')}`);

        const options = {
            projection: { _id: 0, storeID: 1, list: 1 },
        };

        try {
            const userLists = await collection.find({
                userID: userid,
            }, options).toArray();

            //context.log(`lists for user [${userid}]: ${JSON.stringify(userLists)}`);
            
            result = JSON.stringify(userLists);
        } catch (err) {
            context.log(err.message);
        } finally {
            await client.close();
        }
    } else if (userid && storeid) {
        //context.log(`userid param: ${request.query.get('userid')}; storeid param: ${request.query.get('storeid')}`);

        const options = {
            projection: { _id: 0, list: 1 },
        };

        try {
            const listDoc = await collection.find({
                userID: userid,
                storeID: storeid,
            }, options).toArray();

            //context.log(`lists for user [${userid}], store [${storeid}]: ${JSON.stringify(listDoc)}`);
            
            result = JSON.stringify(listDoc);
        } catch (err) {
            context.log(err.message);
        } finally {
            await client.close();
        }
    } else {
        const allListsOptions = {
            projection: { _id: 0, userID: 1, storeID: 1, list: 1 },
        };

        try {
            const allLists = await collection.find({ }, allListsOptions).toArray();

            //context.log(`allLists: ${JSON.stringify(allLists)}`);

            result = JSON.stringify(allLists);
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

async function handlePost(reqBody, ctx) {
    let result;

    const query = { userID: reqBody.userID, storeID: reqBody.storeID };
    const update = { $set: reqBody };
    const options = {upsert: true, new: true};

    try {
        await client.connect();
        const upsertResult = await client.db('shoppinglist').collection('shoppinglists').updateOne(query, update, options);
        result = JSON.stringify(upsertResult);

        //context.log(result);
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

app.http('shoppinglists', {
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

                if (!reqBody || !reqBody.userID || !reqBody.storeID || !reqBody.list) {
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
});
