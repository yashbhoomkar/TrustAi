import { useEffect, useState } from "react";

import {
    getEvaluations,
    getEvaluationReport
} from "../services/evaluations";

export default function Reports() {

    const [evaluations, setEvaluations] = useState<any[]>([]);

    const [report, setReport] = useState<any>(null);

    ///////////////////////////////////////////////////////////

    useEffect(() => {

        loadEvaluations();

    }, []);

    ///////////////////////////////////////////////////////////

    async function loadEvaluations() {

        try {

            const data = await getEvaluations();

            setEvaluations(data);

        }

        catch (err) {

            console.error(err);

        }

    }

    ///////////////////////////////////////////////////////////

    async function openReport(id: number) {

        try {

            const data = await getEvaluationReport(id);

            setReport(data);

        }

        catch (err) {

            console.error(err);

        }

    }

    ///////////////////////////////////////////////////////////

    if (report) {

        return (

            <div>

                <button
                    onClick={() => setReport(null)}
                    style={{
                        marginBottom: 20
                    }}
                >
                    ← Back
                </button>

                <h1>
                    Evaluation Report
                </h1>

                <hr />

                <p>
                    <b>Name:</b> {report.evaluation_name}
                </p>

                <p>
                    <b>Dataset:</b> {report.dataset_name}
                </p>

                <p>
                    <b>Status:</b> {report.status}
                </p>

                <p>
                    <b>Rows:</b> {report.rows}
                </p>

                <p>
                    <b>Created:</b> {report.created_at}
                </p>

                <h2>
                    Selected Metrics
                </h2>

                <ul>

                    {report.selected_metrics.map(
                        (metric: string) => (

                            <li key={metric}>
                                {metric}
                            </li>

                        )
                    )}

                </ul>

                <h2>
                    Metric Averages
                </h2>

                <table
                    border={1}
                    cellPadding={10}
                    style={{
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                        <tr>

                            <th>
                                Metric
                            </th>

                            <th>
                                Average
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            Object.entries(
                                report.metric_averages
                            ).map(
                                ([metric, average]) => (

                                    <tr key={metric}>

                                        <td>
                                            {metric}
                                        </td>

                                        <td>
                                            {average as number}
                                        </td>

                                    </tr>

                                )
                            )

                        }

                    </tbody>

                </table>

                <br />

                <p>

                    <b>Best Metric:</b>

                    {" "}

                    {report.best_metric.title}

                    {" "}

                    ({report.best_metric.average})

                </p>

                <p>

                    <b>Worst Metric:</b>

                    {" "}

                    {report.worst_metric.title}

                    {" "}

                    ({report.worst_metric.average})

                </p>

            </div>

        );

    }

    ///////////////////////////////////////////////////////////

    return (

        <div>

            <h1>

                Reports

            </h1>

            <table
                border={1}
                cellPadding={10}
                style={{
                    borderCollapse: "collapse",
                    width: "100%"
                }}
            >

                <thead>

                    <tr>

                        <th>
                            Name
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Created
                        </th>

                        <th>

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        evaluations.map(
                            (evaluation) => (

                                <tr key={evaluation.id}>

                                    <td>

                                        {evaluation.evaluation_name}

                                    </td>

                                    <td>

                                        {evaluation.status}

                                    </td>

                                    <td>

                                        {new Date(
                                            evaluation.created_at
                                        ).toLocaleString()}

                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                openReport(
                                                    evaluation.id
                                                )
                                            }
                                        >

                                            View Report

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