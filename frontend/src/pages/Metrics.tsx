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

        <div>

            <h1>

                Metrics

            </h1>

            <hr/>

            <h2>

                Create Metric

            </h2>

            <input

                placeholder="Title"

                value={title}

                onChange={(e)=>

                    setTitle(

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <textarea

                placeholder="Description"

                value={description}

                onChange={(e)=>

                    setDescription(

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <textarea

                placeholder="System Prompt"

                value={systemPrompt}

                onChange={(e)=>

                    setSystemPrompt(

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <textarea

                placeholder="General Instructions"

                value={generalInstructions}

                onChange={(e)=>

                    setGeneralInstructions(

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <select

                value={outputType}

                onChange={(e)=>

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

            <br/><br/>

            {

                outputType === "continuous"

                &&

                <>

                    <input

                        type="number"

                        placeholder="Minimum"

                        value={minValue}

                        onChange={(e)=>

                            setMinValue(

                                Number(

                                    e.target.value

                                )

                            )

                        }

                    />

                    <br/><br/>

                    <input

                        type="number"

                        placeholder="Maximum"

                        value={maxValue}

                        onChange={(e)=>

                            setMaxValue(

                                Number(

                                    e.target.value

                                )

                            )

                        }

                    />

                </>

            }

            {

                outputType === "discrete"

                &&

                <>

                    <textarea

                        placeholder="One value per line"

                        onChange={(e)=>

                            setDiscreteValues(

                                e.target.value

                                .split("\n")

                                .filter(

                                    v =>

                                    v.trim() !== ""

                                )

                            )

                        }

                    />

                </>

            }

            <br/><br/>

            <button
    onClick={handleSubmit}
>

    {

        editingMetricId == null

        ?

        "Create Metric"

        :

        "Update Metric"

    }

</button>

            <hr/>

            <h2>

                Metrics

            </h2>

            <table
                border={1}
                cellPadding={8}
            >

                <thead>

                    <tr>

                        <th>

                            Title

                        </th>

                        <th>

                            Type

                        </th>

                        <th>

                            Default

                        </th>

                        <th>

                            Delete

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        metrics.map(

                            (

                                metric

                            )=>

                            (

                                <tr
                                    key={metric.id}
                                >

                                    <td>

                                        <button

                                            onClick={()=>

                                                handlePreview(

                                                    metric.id

                                                )

                                            }

                                        >

                                            {

                                                metric.title

                                            }

                                        </button>

                                    </td>

                                    <td>

                                        {

                                            metric.output_type

                                        }

                                    </td>

                                    <td>

                                        {

                                            metric.is_default

                                            ?

                                            "Yes"

                                            :

                                            "No"

                                        }

                                    </td>

                                    <td>

                                        <button

                                            disabled={

                                                metric.is_default

                                            }

                                            onClick={()=>

                                                handleDelete(

                                                    metric.id

                                                )

                                            }

                                        >

                                            Delete

                                        </button>

                                        {

editingMetricId != null &&

<button

    onClick={() => {

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

    }}

>

Cancel

</button>

}

                                    </td>

                                </tr>

                            )

                        )

                    }

                </tbody>

            </table>

            {

                selectedMetric &&

                <>

                    <hr/>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >

                        <h2>

                            Metric Details

                        </h2>

                        <div>

                            {

                                !selectedMetric.is_default &&

                                <button
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

                    </div>

                    <p>

                        <b>Title:</b>

                        {" "}

                        {

                            selectedMetric.title

                        }

                    </p>

                    <p>

                        <b>Description:</b>

                        {" "}

                        {

                            selectedMetric.description

                        }

                    </p>

                    <p>

                        <b>System Prompt:</b>

                        {" "}

                        {

                            selectedMetric.system_prompt

                        }

                    </p>

                    <p>

                        <b>General Instructions:</b>

                        {" "}

                        {

                            selectedMetric.general_instructions

                        }

                    </p>

                    <p>

                        <b>Output Type:</b>

                        {" "}

                        {

                            selectedMetric.output_type

                        }

                    </p>

                    {

                        selectedMetric.output_type

                        ===

                        "continuous"

                        ?

                        <p>

                            <b>

                                Range:

                            </b>

                            {" "}

                            {

                                selectedMetric.min_value

                            }

                            {" - "}

                            {

                                selectedMetric.max_value

                            }

                        </p>

                        :

                        <div>

                            <b>

                                Values

                            </b>

                            <ul>

                                {

                                    selectedMetric.discrete_values?.map(

                                        (

                                            value: string,

                                            index: number

                                        )=>

                                        (

                                            <li
                                                key={index}
                                            >

                                                {

                                                    value

                                                }

                                            </li>

                                        )

                                    )

                                }

                            </ul>

                        </div>

                    }

                </>

            }

        </div>

    );

}