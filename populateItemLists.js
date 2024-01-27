require('dotenv').config();

const { MongoClient } = require('mongodb');

const itemLists = [
    {
        store: 'grocery',
        items: [
            {name: 'milk'},
            {name: 'bread'},
            {name: 'dog food'},
            {name: 'cat food'},
            {name: 'coffee'},
            {name: 'tea'},
            {name: 'fish'},
            {name: 'broccoli'},
            {name: 'bananas'},
            {name: 'apples'},
            {name: 'crackers'},
            {name: 'cookies'},
            {name: 'eggs'},
            {name: 'cheese'},
        ],
    },
    {
        store: 'hardware',
        items: [
            {name: 'plunger'},
            {name: 'light bulbs'},
            {name: 'door hinge'},
            {name: 'lumber (2x4)'},
            {name: 'extension cord'},
        ]
    }
]

const uri = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient (uri);

let db;
let collection;

async function main() {
    try {
        await client.connect();
        db = client.db('shoppinglist');
        collection = db.collection('itemlists');
        
        await collection.insertMany(itemLists);
    } catch (err) {
        console.error(err.message);
    } finally {
        client.close();
    }
}

main();
console.log('Done!');