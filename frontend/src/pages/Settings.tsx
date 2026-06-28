import { useEffect, useState } from "react";

import {

    getApiKeys,

    createApiKey,

    deleteApiKey

} from "../services/apikeys";

export default function Settings() {

    const [keys, setKeys] = useState<any[]>([]);

    const [provider, setProvider] =
        useState("");

    const [displayName, setDisplayName] =
        useState("");

    const [apiKey, setApiKey] =
        useState("");

    async function loadKeys() {

        const data =
            await getApiKeys();

        setKeys(data);

    }

    useEffect(() => {

        loadKeys();

    }, []);

    async function handleAdd() {

        if (

            !provider ||

            !displayName ||

            !apiKey

        ) {

            alert("Please fill all fields.");

            return;

        }

        try {

            await createApiKey(

                provider,

                displayName,

                apiKey

            );

            alert(
                "API Key Saved"
            );

            setProvider("");

            setDisplayName("");

            setApiKey("");

            await loadKeys();

        }

        catch (err: any) {

            console.log(err);

            alert(

                err.response?.data?.message ??

                "Failed to save API Key."

            );

        }

    }

    async function handleDelete(
        id: number
    ) {

        await deleteApiKey(
            id
        );

        await loadKeys();

    }

    return (

    <div className="metrics-page">

        <div className="page-header">

            <div>

                <h1>

                    Settings

                </h1>

                <p>

                    Manage your LLM providers and API keys.

                </p>

            </div>

        </div>

        <div className="metric-form-card">

            <div className="card-header">

                <h2>

                    Add API Key

                </h2>

            </div>

            <div className="form-grid">

                <div className="field">

                    <label>

                        Provider

                    </label>

                    <select

                        value={provider}

                        onChange={(e) =>

                            setProvider(

                                e.target.value

                            )

                        }

                    >

                        <option value="">

                            Select Provider

                        </option>

                        <option value="openai">

                            OpenAI

                        </option>

                        <option value="gemini">

                            Gemini

                        </option>

                        <option value="anthropic">

                            Anthropic

                        </option>

                        <option value="groq">

                            Groq

                        </option>

                        <option value="ollama">

                            Ollama

                        </option>

                        <option value="openrouter">

                            OpenRouter

                        </option>

                    </select>

                </div>

                <div className="field">

                    <label>

                        Display Name

                    </label>

                    <input

                        type="text"

                        placeholder="Example: GPT-4 Production"

                        value={displayName}

                        onChange={(e) =>

                            setDisplayName(

                                e.target.value

                            )

                        }

                    />

                </div>

                <div className="field full-width">

                    <label>

                        API Key

                    </label>

                    <input

                        type="password"

                        placeholder="Paste your API Key"

                        value={apiKey}

                        onChange={(e) =>

                            setApiKey(

                                e.target.value

                            )

                        }

                    />

                </div>

            </div>

            <button

                className="primary-button"

                onClick={handleAdd}

            >

                Save API Key

            </button>

        </div>

        <div className="metrics-card">

            <div className="card-header">

                <h2>

                    Saved API Keys

                </h2>

                <span>

                    {keys.length} Keys

                </span>

            </div>

            <table className="modern-table">

                <thead>

                    <tr>

                        <th>

                            Provider

                        </th>

                        <th>

                            Display Name

                        </th>

                        <th>

                            API Key

                        </th>

                        <th>

                            Action

                        </th>

                    </tr>

                </thead>

                <tbody>                    {

                        keys.length === 0

                        ?

                        (

                            <tr>

                                <td

                                    colSpan={4}

                                    style={{

                                        textAlign: "center",

                                        padding: "30px"

                                    }}

                                >

                                    No API Keys Added

                                </td>

                            </tr>

                        )

                        :

                        (

                            keys.map((key) => (

                                <tr key={key.id}>

                                    <td>

                                        <span className="badge badge-blue">

                                            {key.provider}

                                        </span>

                                    </td>

                                    <td>

                                        <strong>

                                            {key.display_name}

                                        </strong>

                                    </td>

                                    <td>

                                        <code>

                                            {key.masked_key}

                                        </code>

                                    </td>

                                    <td>

                                        <button

                                            className="danger-button"

                                            onClick={() =>

                                                handleDelete(

                                                    key.id

                                                )

                                            }

                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    </div>

);

}