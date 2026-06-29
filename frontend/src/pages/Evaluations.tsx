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

    deleteEvaluation,

    getEvaluationResults,

    downloadEvaluation

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

    const [tableHeaders, setTableHeaders] = useState<string[]>([]);
    const [tableRows, setTableRows] = useState<any[][]>([]);

    const [selectedEvaluationId, setSelectedEvaluationId] =
    useState<number | null>(null);

    ///////////////////////////////////////////////////////

    async function loadData() {

        const datasetData = await getDatasets();
        const metricData = await getMetrics();
        const evaluationData = await getEvaluations();

        console.log("Datasets", datasetData);
        console.log("Metrics", metricData);
        console.log("Evaluations", evaluationData);

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

    async function handleViewResults(id: number) {

        const response = await getEvaluationResults(id);

        setTableHeaders(response.headers);

        setTableRows(response.rows);

        setSelectedEvaluationId(id);

    }

    async function handleDownload(id: number) {

        const blob = await downloadEvaluation(id);

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `evaluation_${id}.xlsx`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

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

    <div className="metrics-page">

        <div className="page-header">

            <div>

                <h1>

                    Evaluations

                </h1>

                <p>

                    Run evaluations on your datasets using custom metrics.

                </p>

            </div>

        </div>

        <div className="metric-form-card">

            <div className="card-header">

                <h2>

                    Create Evaluation

                </h2>

            </div>

            <div className="form-grid">

                <div className="field">

                    <label>

                        Evaluation Name

                    </label>

                    <input

                        type="text"

                        placeholder="Example: GPT-4 SQL Benchmark"

                        value={evaluationName}

                        onChange={(e) =>

                            setEvaluationName(

                                e.target.value

                            )

                        }

                    />

                </div>

                <div className="field">

                    <label>

                        Dataset

                    </label>

                    <select

                        value={datasetId}

                        onChange={(e) =>

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

                                (dataset) => (

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

                </div>

                <div className="field full-width">

                    <label>

                        Select Metrics

                    </label>

                    <div className="metrics-checkbox-grid">

                        {

                            metrics.map(

                                (metric) => (

                                    <label

                                        key={metric.id}

                                        className="metric-checkbox"

                                    >

                                        <input

                                            type="checkbox"

                                            checked={

                                                selectedMetrics.includes(

                                                    metric.id

                                                )

                                            }

                                            onChange={() =>

                                                toggleMetric(

                                                    metric.id

                                                )

                                            }

                                        />

                                        <span>

                                            {

                                                metric.title

                                            }

                                        </span>

                                    </label>

                                )

                            )

                        }

                    </div>

                </div>

            </div>

            <button

                className="primary-button"

                onClick={handleCreate}

            >

                Run Evaluation

            </button>

        </div>

        <div className="metrics-card">

            <div className="card-header">

                <h2>

                    Previous Evaluations

                </h2>

                <span>

                    {

                        evaluations.length

                    }

                    {" "}Evaluations

                </span>

            </div>

            <table className="modern-table">

                <thead>

                    <tr>

                        <th>

                            Name

                        </th>

                        <th>

                            Status

                        </th>

                        <th>

                            Progress

                        </th>

                        <th>

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>
                                        {

                        evaluations.map(

                            (evaluation) => (

                                <tr key={evaluation.id}>

                                    <td>

                                        <strong>

                                            {

                                                evaluation.evaluation_name

                                            }

                                        </strong>

                                    </td>

                                    <td>

                                        <span className="badge badge-green">

                                            {

                                                evaluation.status

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        {

                                            evaluation.completed_rows

                                        }

                                        {" / "}

                                        {

                                            evaluation.total_rows

                                        }

                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            <button

                                                className="secondary-button"

                                                onClick={() =>

                                                    handleViewResults(

                                                        evaluation.id

                                                    )

                                                }

                                            >

                                                View

                                            </button>

                                            <button

                                                className="primary-button"

                                                onClick={() =>

                                                    handleDownload(

                                                        evaluation.id

                                                    )

                                                }

                                            >

                                                Download

                                            </button>

                                            <button

                                                className="danger-button"

                                                onClick={() =>

                                                    handleDelete(

                                                        evaluation.id

                                                    )

                                                }

                                            >

                                                Delete

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )

                        )

                    }

                </tbody>

            </table>

        </div>
                {

            selectedEvaluationId !== null && (

                <div className="preview-card">

                    <div className="card-header">

                        <h2>

                            Evaluation Results

                        </h2>

                        <span>

                            {

                                tableRows.length

                            }

                            {" "}Rows

                        </span>

                    </div>

                    <div className="table-wrapper">

                        <table className="modern-table">

                            <thead>

                                <tr>

                                    {

                                        tableHeaders.map(

                                            (header) => (

                                                <th key={header}>

                                                    {header}

                                                </th>

                                            )

                                        )

                                    }

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    tableRows.map(

                                        (

                                            row,

                                            rowIndex

                                        ) => (

                                            <tr key={rowIndex}>

                                                {

                                                    row.map(

                                                        (

                                                            cell,

                                                            cellIndex

                                                        ) => (

                                                            <td key={cellIndex}>

                                                                {

                                                                    cell == null

                                                                        ? ""

                                                                        : String(cell)

                                                                }

                                                            </td>

                                                        )

                                                    )

                                                }

                                            </tr>

                                        )

                                    )

                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            )

        }

    </div>

);

}