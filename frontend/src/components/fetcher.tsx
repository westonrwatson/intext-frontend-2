const DEV_URL = 'http://127.0.0.1:5016/';
const PROD_URL = 'https://intex-backend-2-fre9fjaxgfevfvee.centralus-01.azurewebsites.net/';
const IS_PROD = import.meta.env.MODE === 'production';

export const fetchData = async ({ path }: { path: string; prod?: boolean }): Promise<any> => {
    const jwt = localStorage.getItem('jwt');
    const fullPath = `${IS_PROD ? PROD_URL : DEV_URL}${path}`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': jwt ? `Bearer ${jwt}` : '',
    };

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
    const fullPath = `${IS_PROD ? PROD_URL : DEV_URL}${path}`;

    const response = await fetch(fullPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
    const fullPath = `${IS_PROD ? PROD_URL : DEV_URL}${path}`;

    const response = await fetch(fullPath, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
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