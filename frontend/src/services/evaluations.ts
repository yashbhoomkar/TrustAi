import api from "./api";

///////////////////////////////////////////////////////////
// Create Evaluation
///////////////////////////////////////////////////////////

export async function createEvaluation(

    evaluationName: string,

    datasetId: number,

    metricIds: number[]

) {

    const response = await api.post(

        "/evaluations",

        {

            evaluation_name: evaluationName,

            dataset_id: datasetId,

            metric_ids: metricIds

        }

    );

    return response.data;

}

///////////////////////////////////////////////////////////
// List Evaluations
///////////////////////////////////////////////////////////

export async function getEvaluations() {

    const response = await api.get(

        "/evaluations"

    );

    return response.data;

}

///////////////////////////////////////////////////////////
// Get Evaluation
///////////////////////////////////////////////////////////

export async function getEvaluation(

    evaluationId: number

) {

    const response = await api.get(

        `/evaluations/${evaluationId}`

    );

    return response.data;

}

///////////////////////////////////////////////////////////
// Delete Evaluation
///////////////////////////////////////////////////////////

export async function deleteEvaluation(

    evaluationId: number

) {

    const response = await api.delete(

        `/evaluations/${evaluationId}`

    );

    return response.data;

}