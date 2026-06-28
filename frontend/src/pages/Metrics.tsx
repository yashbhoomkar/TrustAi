import "../pages/Metrics.css";

import { useEffect, useState } from "react";

import {

    getMetrics,

    getMetric,

    createMetric,

    updateMetric,

    deleteMetric

} from "../services/metrics";


export default function Metrics() {

    const [metrics, setMetrics] =
        useState<any[]>([]);

    const [selectedMetric, setSelectedMetric] =
        useState<any | null>(null);

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [systemPrompt, setSystemPrompt] =
        useState("");

    const [
        generalInstructions,
        setGeneralInstructions
    ] = useState("");

    const [outputType, setOutputType] =
        useState("continuous");

    const [minValue, setMinValue] =
        useState(0);

    const [maxValue, setMaxValue] =
        useState(10);

    const [
        discreteValues,
        setDiscreteValues
    ] = useState<string[]>([]);

    const [editingMetricId, setEditingMetricId] =
    useState<number | null>(null);


    async function loadMetrics() {

        const data =
            await getMetrics();

        setMetrics(data);

    }


    useEffect(() => {

        loadMetrics();

    }, []);


    async function handleSubmit() {

    const payload = {

        title,

        description,

        system_prompt: systemPrompt,

        general_instructions:
            generalInstructions,

        output_type: outputType,

        min_value:

            outputType === "continuous"

                ? minValue

                : null,

        max_value:

            outputType === "continuous"

                ? maxValue

                : null,

        discrete_values:

            outputType === "discrete"

                ? discreteValues

                : null

    };

    if (

        editingMetricId == null

    ) {

        await createMetric(
            payload
        );

        alert(
            "Metric Created"
        );

    }

    else {

        await updateMetric(

            editingMetricId,

            payload

        );

        alert(
            "Metric Updated"
        );

    }

    setEditingMetricId(
        null
    );

    setTitle("");

    setDescription("");

    setSystemPrompt("");

    setGeneralInstructions("");

    setOutputType(
        "continuous"
    );

    setMinValue(0);

    setMaxValue(10);

    setDiscreteValues([]);

    setSelectedMetric(
        null
    );

    await loadMetrics();

}


    async function handlePreview(
            id: number
        ) {

            const metric =
                await getMetric(id);

            setSelectedMetric(
                metric
            );

            setEditingMetricId(
                metric.is_default
                    ? null
                    : metric.id
            );

            setTitle(
                metric.title
            );

            setDescription(
                metric.description ?? ""
            );

            setSystemPrompt(
                metric.system_prompt
            );

            setGeneralInstructions(
                metric.general_instructions ?? ""
            );

            setOutputType(
                metric.output_type
            );

            setMinValue(
                metric.min_value ?? 0
            );

            setMaxValue(
                metric.max_value ?? 10
            );

            setDiscreteValues(
                metric.discrete_values ?? []
            );

        }


    async function handleDelete(
        id: number
    ) {

        if (
            !confirm(
                "Delete this metric?"
            )
        ) {

            return;

        }

        await deleteMetric(id);

        if (

            selectedMetric?.id === id

        ) {

            setSelectedMetric(
                null
            );

        }

        loadMetrics();

    }


    return (

    <div className="metrics-page">

        <div className="page-header">

            <div>

                <h1>
                    Metrics
                </h1>

                <p>
                    Create and manage evaluation metrics for TrustAI.
                </p>

            </div>

        </div>

        <div className="metric-form-card">

            <h2>

                {
                    editingMetricId == null
                        ? "Create Metric"
                        : "Edit Metric"
                }

            </h2>

            <div className="form-grid">

                <div className="field">

                    <label>

                        Title

                    </label>

                    <input
                        value={title}
                        placeholder="Metric title"
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="field">

                    <label>

                        Output Type

                    </label>

                    <select
                        value={outputType}
                        onChange={(e) =>
                            setOutputType(
                                e.target.value
                            )
                        }
                    >

                        <option value="continuous">

                            Continuous

                        </option>

                        <option value="discrete">

                            Discrete

                        </option>

                    </select>

                </div>

                <div className="field full-width">

                    <label>

                        Description

                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="field full-width">

                    <label>

                        System Prompt

                    </label>

                    <textarea
                        value={systemPrompt}
                        onChange={(e) =>
                            setSystemPrompt(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="field full-width">

                    <label>

                        General Instructions

                    </label>

                    <textarea
                        value={generalInstructions}
                        onChange={(e) =>
                            setGeneralInstructions(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>

                        {

                outputType === "continuous"

                &&

                <div className="range-grid">

                    <div className="field">

                        <label>

                            Minimum Value

                        </label>

                        <input
                            type="number"
                            value={minValue}
                            onChange={(e) =>
                                setMinValue(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                        />

                    </div>

                    <div className="field">

                        <label>

                            Maximum Value

                        </label>

                        <input
                            type="number"
                            value={maxValue}
                            onChange={(e) =>
                                setMaxValue(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                        />

                    </div>

                </div>

            }

            {

                outputType === "discrete"

                &&

                <div className="field full-width">

                    <label>

                        Possible Values

                    </label>

                    <textarea

                        placeholder="One value per line"

                        onChange={(e) =>

                            setDiscreteValues(

                                e.target.value
                                    .split("\n")
                                    .filter(

                                        value =>

                                            value.trim() !== ""

                                    )

                            )

                        }

                    />

                </div>

            }

            <div
                style={{
                    marginTop: "24px"
                }}
            >

                <button

                    className="primary-button"

                    onClick={handleSubmit}

                >

                    {

                        editingMetricId == null

                            ? "Create Metric"

                            : "Update Metric"

                    }

                </button>

                {

                    editingMetricId != null

                    &&

                    <button

                        className="cancel-button"

                        style={{
                            marginLeft: "12px"
                        }}

                        onClick={() => {

                            setEditingMetricId(null);

                            setTitle("");

                            setDescription("");

                            setSystemPrompt("");

                            setGeneralInstructions("");

                            setOutputType(
                                "continuous"
                            );

                            setMinValue(0);

                            setMaxValue(10);

                            setDiscreteValues([]);

                            setSelectedMetric(null);

                        }}

                    >

                        Cancel

                    </button>

                }

            </div>

        </div>

                <div className="metrics-card">

            <div className="card-header">

                <h2>

                    Your Metrics

                </h2>

                <span>

                    {metrics.length} Metric(s)

                </span>

            </div>

            <table className="modern-table">

                <thead>

                    <tr>

                        <th>

                            Metric

                        </th>

                        <th>

                            Type

                        </th>

                        <th>

                            Default

                        </th>

                        <th>

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        metrics.map(

                            (metric) => (

                                <tr
                                    key={metric.id}
                                >

                                    <td>

                                        <div>

                                            <div className="metric-title">

                                                {metric.title}

                                            </div>

                                            <div className="metric-subtitle">

                                                {metric.description || "No description"}

                                            </div>

                                        </div>

                                    </td>

                                    <td>

                                        <span

                                            className={

                                                metric.output_type === "continuous"

                                                    ? "badge badge-blue"

                                                    : "badge badge-orange"

                                            }

                                        >

                                            {metric.output_type}

                                        </span>

                                    </td>

                                    <td>

                                        {

                                            metric.is_default

                                            ?

                                            <span className="badge badge-green">

                                                Default

                                            </span>

                                            :

                                            "-"

                                        }

                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            <button

                                                className="secondary-button"

                                                onClick={() =>

                                                    handlePreview(

                                                        metric.id

                                                    )

                                                }

                                            >

                                                View

                                            </button>

                                            <button

                                                className="danger-button"

                                                disabled={

                                                    metric.is_default

                                                }

                                                onClick={() =>

                                                    handleDelete(

                                                        metric.id

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

            selectedMetric && (

                <div className="preview-card">

                    <div className="card-header">

                        <h2>

                            Metric Details

                        </h2>

                        {

                            !selectedMetric.is_default &&

                            <button

                                className="danger-button"

                                onClick={() =>

                                    handleDelete(

                                        selectedMetric.id

                                    )

                                }

                            >

                                Delete

                            </button>

                        }

                    </div>

                    <div className="preview-section">

                        <p>

                            <strong>

                                Title

                            </strong>

                        </p>

                        <p>

                            {selectedMetric.title}

                        </p>

                    </div>

                    <div className="preview-section">

                        <p>

                            <strong>

                                Description

                            </strong>

                        </p>

                        <p>

                            {

                                selectedMetric.description ||

                                "No description"

                            }

                        </p>

                    </div>

                    <div className="preview-section">

                        <p>

                            <strong>

                                System Prompt

                            </strong>

                        </p>

                        <p>

                            {selectedMetric.system_prompt}

                        </p>

                    </div>

                    <div className="preview-section">

                        <p>

                            <strong>

                                General Instructions

                            </strong>

                        </p>

                        <p>

                            {

                                selectedMetric.general_instructions ||

                                "None"

                            }

                        </p>

                    </div>

                    <div className="preview-section">

                        <p>

                            <strong>

                                Output Type

                            </strong>

                        </p>

                        <span

                            className={

                                selectedMetric.output_type === "continuous"

                                    ? "badge badge-blue"

                                    : "badge badge-orange"

                            }

                        >

                            {selectedMetric.output_type}

                        </span>

                    </div>

                    {

                        selectedMetric.output_type === "continuous"

                        &&

                        <div className="preview-section">

                            <p>

                                <strong>

                                    Range

                                </strong>

                            </p>

                            <p>

                                {selectedMetric.min_value}

                                {"  -  "}

                                {selectedMetric.max_value}

                            </p>

                        </div>

                    }

                    {

                        selectedMetric.output_type === "discrete"

                        &&

                        <div className="preview-section">

                            <p>

                                <strong>

                                    Allowed Values

                                </strong>

                            </p>

                            <ul className="values-list">

                                {

                                    selectedMetric.discrete_values?.map(

                                        (

                                            value: string,

                                            index: number

                                        ) => (

                                            <li key={index}>

                                                {value}

                                            </li>

                                        )

                                    )

                                }

                            </ul>

                        </div>

                    }

                </div>

            )

        }

    </div>

);

}