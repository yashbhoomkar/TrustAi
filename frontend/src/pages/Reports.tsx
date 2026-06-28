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

            <div className="metrics-page">

                <button

                    className="secondary-button"

                    onClick={() =>

                        setReport(null)

                    }

                    style={{

                        marginBottom: 20

                    }}

                >

                    ← Back to Reports

                </button>

                <div className="preview-card">

                    <div className="card-header">

                        <div>

                            <h2>

                                {report.evaluation_name}

                            </h2>

                            <p>

                                {report.dataset_name}

                            </p>

                        </div>

                        <span className="badge badge-green">

                            {report.status}

                        </span>

                    </div>

                    <div className="form-grid">

                        <div className="preview-section">

                            <strong>

                                Dataset

                            </strong>

                            <p>

                                {report.dataset_name}

                            </p>

                        </div>

                        <div className="preview-section">

                            <strong>

                                Rows

                            </strong>

                            <p>

                                {report.rows}

                            </p>

                        </div>

                        <div className="preview-section">

                            <strong>

                                Status

                            </strong>

                            <p>

                                {report.status}

                            </p>

                        </div>

                        <div className="preview-section">

                            <strong>

                                Created

                            </strong>

                            <p>

                                {

                                    new Date(

                                        report.created_at

                                    ).toLocaleString()

                                }

                            </p>

                        </div>

                    </div>

                    <br/>

                    <h3>

                        Selected Metrics

                    </h3>

                    <div className="action-buttons">

                        {

                            report.selected_metrics.map(

                                (

                                    metric: string

                                ) => (

                                    <span

                                        key={metric}

                                        className="badge badge-blue"

                                    >

                                        {metric}

                                    </span>

                                )

                            )

                        }

                    </div>

                    <br/>

                    <h3>

                        Metric Averages

                    </h3>

                    <table className="modern-table">

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

                        <tbody>                            {

                                Object.entries(

                                    report.metric_averages

                                ).map(

                                    ([metric, average]) => (

                                        <tr key={metric}>

                                            <td>

                                                {metric}

                                            </td>

                                            <td>

                                                <strong>

                                                    {

                                                        Number(

                                                            average

                                                        ).toFixed(2)

                                                    }

                                                </strong>

                                            </td>

                                        </tr>

                                    )

                                )

                            }

                        </tbody>

                    </table>

                    <br/>

                    <div className="form-grid">

                        <div className="preview-section">

                            <strong>

                                Best Metric

                            </strong>

                            <p>

                                {

                                    report.best_metric.title

                                }

                            </p>

                            <span className="badge badge-green">

                                {

                                    report.best_metric.average

                                }

                            </span>

                        </div>

                        <div className="preview-section">

                            <strong>

                                Worst Metric

                            </strong>

                            <p>

                                {

                                    report.worst_metric.title

                                }

                            </p>

                            <span className="badge badge-orange">

                                {

                                    report.worst_metric.average

                                }

                            </span>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

    ///////////////////////////////////////////////////////////

    return (

        <div className="metrics-page">

            <div className="page-header">

                <div>

                    <h1>

                        Reports

                    </h1>

                    <p>

                        Browse completed evaluation reports.

                    </p>

                </div>

            </div>

            <div className="metrics-card">

                <div className="card-header">

                    <h2>

                        Evaluation Reports

                    </h2>

                    <span>

                        {

                            evaluations.length

                        }

                        {" "}Reports

                    </span>

                </div>

                <table className="modern-table">

                    <thead>

                        <tr>

                            <th>

                                Evaluation

                            </th>

                            <th>

                                Status

                            </th>

                            <th>

                                Created

                            </th>

                            <th>

                                Action

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

                                            {evaluation.evaluation_name}

                                        </strong>

                                    </td>

                                    <td>

                                        <span className="badge badge-green">

                                            {evaluation.status}

                                        </span>

                                    </td>

                                    <td>

                                        {

                                            new Date(

                                                evaluation.created_at

                                            ).toLocaleString()

                                        }

                                    </td>

                                    <td>

                                        <button

                                            className="primary-button"

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

        </div>

    );

}