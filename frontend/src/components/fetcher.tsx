const DEV_URL = 'http://127.0.0.1:5016/';
const PROD_URL = 'https://cineniche-api-afcbcqf8fmcbace6.eastus-01.azurewebsites.net/';
const API_KEY = import.meta.env.VITE_API_KEY;
const IS_PROD = import.meta.env.MODE === 'production';

export const fetchData = async ({ path, prod = IS_PROD }: { path: string; prod?: boolean }): Promise<any> => {
    const jwt = localStorage.getItem('jwt');
    const fullPath = `${prod ? PROD_URL : DEV_URL}${path}`;

    console.log("Requesting:", fullPath);

    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
        'Authorization': jwt ? `Bearer ${jwt}` : '',
    };

    console.log("Headers:", headers);

    const response = await fetch(fullPath, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        console.error('Fetch failed:', response.status);
        throw new Error('Network response was not ok');
    };

    return response.json();
};

export const fetchAllData = async (paths: Record<string, string>): Promise<Record<string, any>> => {
    const results = await Promise.all(Object.values(paths).map((path) => fetchData({ path, prod: true })));

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
    const jwt = localStorage.getItem('jwt');
    const fullPath = `${prod ? PROD_URL : DEV_URL}${path}`;
    console.log("POSTING TO:", fullPath);
    console.log("BODY:", JSON.stringify(body));
    console.log("API_KEY:", API_KEY);

    const response = await fetch(fullPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY || '',
            'Authorization': jwt ? `Bearer ${jwt}` : '',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        console.error('POST failed:', response.status);
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const patchData = async ({ path, body, prod = true }: {
    path: string,
    body: object,
    prod?: boolean,
}): Promise<any> => {
    const jwt = localStorage.getItem('jwt');
    const fullPath = `${prod ? PROD_URL : DEV_URL}${path}`;
    console.log("PATCHING TO:", fullPath);
    console.log("BODY:", JSON.stringify(body));
    console.log("API_KEY:", API_KEY);

    const response = await fetch(fullPath, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY || '',
            'Authorization': jwt ? `Bearer ${jwt}` : '',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        console.error('POST failed:', response.status);
        throw new Error('Network response was not ok');
    }

    return response.json();
};