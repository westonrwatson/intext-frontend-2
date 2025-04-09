
const DEV_URL = 'http://127.0.0.1:5016/api/'
const PROD_URL = 'https://cineniche-api-afcbcqf8fmcbace6.eastus-01.azurewebsites.net/api/';
const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchData = async ({ path, prod = true }: { path: string, prod?: boolean }): Promise<any> => {
    const fullPath = `${prod ? PROD_URL : DEV_URL}${path}`
    console.log(fullPath);
    console.log(`API_KEY: ${API_KEY}`);
    const response = await fetch(fullPath, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
        }
    });

    if (!response.ok) throw new Error('Network response was not ok');

    return response.json();
};

export const fetchAllData = async (paths: Record<string, string>): Promise<Record<string, any>> => {
    const results = await Promise.all(Object.values(paths).map((path) => fetchData({ path })));

    const output: Record<string, any> = {};
    Object.keys(paths).forEach((key, index) => {
        output[key] = results[index];
    });

    return output;
};

export const postData = async ({ path, body, prod = true }: {
    path: string,
    body: object,
    prod?: boolean,
}): Promise<any> => {
    const fullPath = `${prod ? PROD_URL : DEV_URL}${path}`

    console.log(`POSTING TO: ${fullPath}`);
    console.log(`BODY: ${JSON.stringify(body)}`);
    console.log(`API_KEY: ${API_KEY}`);
    const response = await fetch(fullPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};
