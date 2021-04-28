export function fastFetch(options, freshness = 30000) {
    return fetch(process.env.NEXT_PUBLIC_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            freshness,
            request: {
                ...options,
                method: options.method || 'GET',
            }
        })
    }).then(res => res.json());
}