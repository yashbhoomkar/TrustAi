import api from "./api";

export async function getDatasets() {

    const response = await api.get(
        "/datasets"
    );

    return response.data;

}

export async function uploadDataset(
    displayName: string,
    file: File
) {

    const formData = new FormData();

    formData.append(
        "display_name",
        displayName
    );

    formData.append(
        "file",
        file,
        file.name
    );

    // Debug
    for (const [key, value] of formData.entries()) {
        console.log(key, value);
    }

    const response = await api.post(
        "/datasets",
        formData
    );

    return response.data;

}

export async function previewDataset(
    datasetId: number
) {
    const response = await api.get(
        `/datasets/${datasetId}/preview`
    );

    return response.data;
}

export async function deleteDataset(
    datasetId: number
) {

    const response = await api.delete(
        `/datasets/${datasetId}`
    );

    return response.data;

}


export async function saveColumnMapping(
    datasetId: number,
    mapping: Record<string, string | null>
) {

    const response = await api.put(
        `/datasets/${datasetId}/mapping`,
        {
            mapping
        }
    );

    return response.data;

}