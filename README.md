# Requing Ball
It's a real bad name

#### Cache API requests 

```javascript

const obj = `{
  "method": "GET",
  "url": "https://randomuser.me/api/?results=5",
  "Headers": {
      "Access-Allow-Origin": "*"
  }
}`;

// accepts a valid fetch options object (url property required) and a freshness tolerance
// always get new response -> freshness = 0
// allow 1 min old response -> freshness = 60000
let res = await fastFetch(obj, 60000);

// res is a fetch-like response body
```

The initial request will be normal, but subsequent fetches will return the most recent result from an in-memory db cache!

Try it [https://requing-ball.vercel.app/](https://requing-ball.vercel.app/) or try anywhere by making your API request the body of a post request to the public API

```
fetch('/api/req', {
    method: "POST",
    body: JSON.stringify({
        freshness: 30000,
        request: {
            method: 'GET',
            url: 'https://randomuser.me/api/?results=50'
        }
    })
})
.then(res => res.json())
.then(data => { console.log(data) });
```

