import axios, { AxiosRequestConfig } from "axios";

async function networkRequest(options: AxiosRequestConfig) {
    if (options.url?.includes('omdbapi')) {
        console.warn('omdb-api');
    }
    try {
        const response = await axios({
            ...options
        })

        if (response) {
            return response
        }

        return null

    } catch (error: any) {
        if (error.response) {
            console.log('Error response', { data: error.response.data, status: error.response.status, headers: error.response.headers });
            return error.response
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        return null
    }
}

export { networkRequest }