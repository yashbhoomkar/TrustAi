import api from "./api";

export async function getApiKeys() {

    const response = await api.get(
        "/apikey"
    );

    return response.data;

}

export async function createApiKey(

    provider: string,

    displayName: string,

    apiKey: string

) {

    const response = await api.post(

        "/apikey",

        {

            provider,

            display_name: displayName,

            api_key: apiKey

        }

    );

    return response.data;

}

export async function updateApiKey(

    id: number,

    provider: string,

    displayName: string,

    apiKey: string

) {

    const response = await api.put(

        `/apikey/${id}`,

        {

            provider,

            display_name: displayName,

            api_key: apiKey

        }

    );

    return response.data;

}

export async function deleteApiKey(
    id: number
) {

    const response = await api.delete(
        `/apikey/${id}`
    );

    return response.data;

}