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

        <div>

            <h1>

                Settings

            </h1>

            <h3>

                API Keys

            </h3>

            <br/>

            <select

                value={provider}

                onChange={(e)=>

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

            <br/>

            <br/>

            <input

                placeholder="Display Name"

                value={displayName}

                onChange={(e)=>

                    setDisplayName(
                        e.target.value
                    )

                }

            />

            <br/>

            <br/>

            <input

                type="password"

                placeholder="API Key"

                value={apiKey}

                onChange={(e)=>

                    setApiKey(
                        e.target.value
                    )

                }

            />

            <br/>

            <br/>

            <button

                onClick={handleAdd}

            >

                Save API Key

            </button>

            <hr/>

            <table

                border={1}

                cellPadding={8}

            >

                <thead>

                    <tr>

                        <th>

                            ID

                        </th>

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

                            Delete

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        keys.length === 0

                        ?

                        <tr>

                            <td
                                colSpan={5}
                            >

                                No API Keys Added

                            </td>

                        </tr>

                        :

                        keys.map((key)=>(

                            <tr
                                key={key.id}
                            >

                                <td>

                                    {key.id}

                                </td>

                                <td>

                                    {key.provider}

                                </td>

                                <td>

                                    {key.display_name}

                                </td>

                                <td>

                                    {key.masked_key}

                                </td>

                                <td>

                                    <button

                                        onClick={()=>

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

                    }

                </tbody>

            </table>

        </div>

    );

}