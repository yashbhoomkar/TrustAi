import { useEffect, useState } from "react";

import {

    getDatasets

} from "../services/datasets";

import {

    getMetrics

} from "../services/metrics";

import {

    getEvaluations,

    createEvaluation,

    deleteEvaluation

} from "../services/evaluations";

export default function Evaluations() {

    const [datasets, setDatasets] =

        useState<any[]>([]);

    const [metrics, setMetrics] =

        useState<any[]>([]);

    const [evaluations, setEvaluations] =

        useState<any[]>([]);

    const [evaluationName, setEvaluationName] =

        useState("");

    const [datasetId, setDatasetId] =

        useState<number>(0);

    const [selectedMetrics, setSelectedMetrics] =

        useState<number[]>([]);

    ///////////////////////////////////////////////////////

    async function loadData() {

        const datasetData =

            await getDatasets();

        const metricData =

            await getMetrics();

        const evaluationData =

            await getEvaluations();

        setDatasets(datasetData);

        setMetrics(metricData);

        setEvaluations(evaluationData);

    }

    ///////////////////////////////////////////////////////

    useEffect(() => {

        loadData();

    }, []);

    ///////////////////////////////////////////////////////

    function toggleMetric(

        metricId: number

    ) {

        if (

            selectedMetrics.includes(metricId)

        ) {

            setSelectedMetrics(

                selectedMetrics.filter(

                    x => x !== metricId

                )

            );

        }

        else {

            setSelectedMetrics([

                ...selectedMetrics,

                metricId

            ]);

        }

    }

    ///////////////////////////////////////////////////////

    async function handleCreate() {

        if (

            evaluationName.trim() === ""

        ) {

            alert(

                "Enter Evaluation Name"

            );

            return;

        }

        if (

            datasetId === 0

        ) {

            alert(

                "Select Dataset"

            );

            return;

        }

        if (

            selectedMetrics.length === 0

        ) {

            alert(

                "Select Metrics"

            );

            return;

        }

        await createEvaluation(

            evaluationName,

            datasetId,

            selectedMetrics

        );

        alert(

            "Evaluation Started"

        );

        setEvaluationName("");

        setDatasetId(0);

        setSelectedMetrics([]);

        loadData();

    }

    ///////////////////////////////////////////////////////

    async function handleDelete(

        id: number

    ) {

        if (

            !confirm(

                "Delete Evaluation?"

            )

        ) {

            return;

        }

        await deleteEvaluation(

            id

        );

        loadData();

    }

    ///////////////////////////////////////////////////////

    return (

        <div>

            <h1>

                Evaluations

            </h1>

            <hr/>

            <h3>

                Create Evaluation

            </h3>

            <input

                placeholder="Evaluation Name"

                value={evaluationName}

                onChange={(e)=>

                    setEvaluationName(

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <select

                value={datasetId}

                onChange={(e)=>

                    setDatasetId(

                        Number(

                            e.target.value

                        )

                    )

                }

            >

                <option value={0}>

                    Select Dataset

                </option>

                {

                    datasets.map(

                        dataset=>(

                            <option

                                key={dataset.id}

                                value={dataset.id}

                            >

                                {

                                    dataset.display_name

                                }

                            </option>

                        )

                    )

                }

            </select>

            <br/><br/>

            <b>

                Select Metrics

            </b>

            <br/><br/>

            {

                metrics.map(

                    metric=>(

                        <div

                            key={metric.id}

                        >

                            <label>

                                <input

                                    type="checkbox"

                                    checked={

                                        selectedMetrics.includes(

                                            metric.id

                                        )

                                    }

                                    onChange={()=>

                                        toggleMetric(

                                            metric.id

                                        )

                                    }

                                />

                                {" "}

                                {

                                    metric.title

                                }

                            </label>

                        </div>

                    )

                )

            }

            <br/>

            <button

                onClick={handleCreate}

            >

                Run Evaluation

            </button>

            <hr/>

            <h2>

                Previous Evaluations

            </h2>

            <table

                border={1}

                cellPadding={8}

            >

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Status</th>

                        <th>Progress</th>

                        <th>Delete</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        evaluations.map(

                            evaluation=>(

                                <tr

                                    key={evaluation.id}

                                >

                                    <td>

                                        {

                                            evaluation.id

                                        }

                                    </td>

                                    <td>

                                        {

                                            evaluation.evaluation_name

                                        }

                                    </td>

                                    <td>

                                        {

                                            evaluation.status

                                        }

                                    </td>

                                    <td>

                                        {

                                            evaluation.completed_rows

                                        }

                                        /

                                        {

                                            evaluation.total_rows

                                        }

                                    </td>

                                    <td>

                                        <button

                                            onClick={()=>

                                                handleDelete(

                                                    evaluation.id

                                                )

                                            }

                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            )

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}