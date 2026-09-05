const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://3sonlitexnikum_db_user:2BFAslEXSHPFGMbK@cluster0.vs7nx6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        await client.connect();
        const database = client.db('texnikum_db');
        const collection = database.collection('news');
        const method = event.httpMethod;

        if (method === 'GET') {
            const data = await collection.find({}).sort({ _id: -1 }).toArray();
            const formattedData = data.map(item => ({
                id: item._id.toString(), title: item.title, tag: item.tag, date: item.date, content: item.content, imageUrl: item.imageUrl
            }));
            return { statusCode: 200, body: JSON.stringify(formattedData) };
        } 
        if (method === 'POST') {
            const body = JSON.parse(event.body);
            const result = await collection.insertOne(body);
            return { statusCode: 201, body: JSON.stringify(result) };
        }
        if (method === 'DELETE') {
            const id = event.path.split('/').pop();
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            return { statusCode: 200, body: JSON.stringify(result) };
        }
        return { statusCode: 405, body: "Method Not Allowed" };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
