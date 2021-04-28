const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
    host: process.env.HOST,
    port: '33140',
    password: process.env.PASS,
    tls: {}
});

client.getAsync = promisify(client.get).bind(client);
client.setAsync = promisify(client.set).bind(client);

client.on("error", function (error) {
    console.error(error);
});

export default client;
