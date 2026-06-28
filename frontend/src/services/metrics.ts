import api from "./api";


export async function getMetrics() {

    const response = await api.get(
        "/metrics"
    );

    return response.data;

}


export async function getMetric(
    metricId: number
) {

    const response = await api.get(
        `/metrics/${metricId}`
    );

    return response.data;

}


export async function createMetric(
    metric: any
) {

    const response = await api.post(
        "/metrics",
        metric
    );

    return response.data;

}


export async function updateMetric(
    metricId: number,
    metric: any
) {

    const response = await api.put(
        `/metrics/${metricId}`,
        metric
    );

    return response.data;

}


export async function deleteMetric(
    metricId: number
) {

    const response = await api.delete(
        `/metrics/${metricId}`
    );

    return response.data;

}