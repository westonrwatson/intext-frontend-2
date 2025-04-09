const BASE_URL = 'https://cineniche-api-afcbcqf8fmcbace6.eastus-01.azurewebsites.net/api/';
const API_KEY = import.meta.env.VITE_API_KEY

export const fetchData = async (path: string) => {
    console.log(`Fetching data from ${path}`);
    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    };

    return response.json();
};