require('dotenv').config();

const { MongoClient } = require('mongodb');

const itemList = [
    {name: 'Milk'},
    {name: 'Bread'},
    {name: 'Dog Food'},
    {name: 'Cat Food'},
    {name: 'Coffee'},
    {name: 'Tea'},
    {name: 'Fish'},
    {name: 'Broccoli'},
    {name: 'Bananas'},
    {name: 'Apples'},
    {name: 'Crackers'},
    {name: 'Cookies'},
    {name: 'Eggs'},
    {name: 'Cheese'},
]

const uri = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(uri);

let db;
let collection;

async function main() {
    try {
        await client.connect();
        db = client.db('shoppinglist');
        collection = db.collection('itemList');
        
        await collection.insertMany(itemList);        
    } catch (err) {
        console.error(err.message);
    } finally {
        client.close();
    }
}

main();
