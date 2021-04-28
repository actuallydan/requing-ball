import axios from "axios";
import crypto from "crypto";
import client from "../../lib/redis";
import initMiddleware from '../../lib/init-middleware'
// cors stuff
import Cors from 'cors'


// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with POST
        methods: ['POST'],
    })
)

export default async (req, res) => {
    await cors(req, res)

    try {
        const { body: request } = req;

        // hash request
        const hash = crypto.createHash('sha256').update(request).digest('hex');

        // see if it exists in our store
        let value = await client.getAsync(hash);

        const { request: forwardedRequest, freshness } = JSON.parse(request);

        // if set, return hash
        if (value) {
            const { data, t } = JSON.parse(value);

            // check to see if our result is fresh enough for the response
            if (freshness >= (new Date().getTime() - t)) {
                console.log("this shit is fresh af")
                return res.status(200).json({ data })
            }
            console.log("this shit is stale af")

            // otherwise, continue and we'll overwrite the value
        }

        // if false make request
        let { data } = await axios({ ...forwardedRequest });

        // store the result for the future, and timestamp so we know how old it is
        client.setAsync(hash, JSON.stringify({ data, t: new Date().getTime() }));

        res.status(200).json({ data })
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: e })
    }
}
