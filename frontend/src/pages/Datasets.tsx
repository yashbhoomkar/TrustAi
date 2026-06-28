import { useEffect, useState } from "react";

import {
    getDatasets,
    uploadDataset,
    deleteDataset,
    previewDataset,
    saveColumnMapping
} from "../services/datasets";

export default function Datasets() {

    const [datasets, setDatasets] =
        useState<any[]>([]);

    const [displayName, setDisplayName] =
        useState("");

    const [file, setFile] =
        useState<File | null>(null);

    const [preview, setPreview] =
        useState<any | null>(null);

    const [mapping, setMapping] =
    useState<Record<string, string | null>>({});

    const [selectedDataset, setSelectedDataset] =
        useState<number | null>(null);

    async function loadDatasets() {

        const data =
            await getDatasets();

        setDatasets(data);

    }

    useEffect(() => {

        loadDatasets();

    }, []);

    async function handleUpload() {

        if (!displayName.trim()) {

            alert("Enter Display Name");

            return;

        }

        if (!file) {

            alert("Choose File");

            return;

        }

        try {

            await uploadDataset(
                displayName,
                file
            );

            alert("Dataset Uploaded");

            setDisplayName("");

            setFile(null);

            setPreview(null);

            setSelectedDataset(null);

            await loadDatasets();

        }

        catch (err: any) {

            console.log(err);

            alert(
                JSON.stringify(
                    err.response?.data
                )
            );

        }

    }

    async function handlePreview(
        id: number
    ) {

        const data =
            await previewDataset(
                id
            );

        setSelectedDataset(
            id
        );

        setPreview(
            data
        );

        setMapping(
            data.mapping ?? {}
        );

    }

    async function handleDelete(
        id: number
    ) {

        if (
            !confirm(
                "Delete this dataset?"
            )
        ) {

            return;

        }

        await deleteDataset(
            id
        );

        if (
            selectedDataset === id
        ) {

            setPreview(null);

            setSelectedDataset(
                null
            );

        }

        await loadDatasets();

    }

    function updateMapping(

        column: string,

        value: string

    ) {

        const newMapping = {

            ...mapping

        };

        // Remove old assignment if this column was previously selected
        Object.keys(newMapping).forEach((role) => {

            if (newMapping[role] === column) {

                delete newMapping[role];

            }

        });

        if (value !== "") {

            newMapping[value] = column;

        }

        setMapping(newMapping);

    }

    async function handleSaveMapping() {

        if (selectedDataset == null) {

            return;

        }

        await saveColumnMapping(

            selectedDataset,

            mapping

        );

        alert(
            "Column Mapping Saved"
        );

    }

    return (

        <div>

            <h1>

                Datasets

            </h1>

            <hr/>

            <h3>

                Upload Dataset

            </h3>

            <input
                placeholder="Display Name"
                value={displayName}
                onChange={(e)=>
                    setDisplayName(
                        e.target.value
                    )
                }
            />

            <br/><br/>

            <input
                type="file"
                accept=".xlsx"
                onChange={(e)=>{

                    if(
                        e.target.files
                    ){

                        setFile(
                            e.target.files[0]
                        );

                    }

                }}
            />

            <br/><br/>

            <button
                onClick={handleUpload}
            >

                Upload

            </button>

            <hr/>

            <h3>

                Uploaded Datasets

            </h3>

            <table
                border={1}
                cellPadding={8}
            >

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>File</th>

                        <th>Status</th>

                        <th>Rows</th>

                        <th>Columns</th>

                        <th>Delete</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        datasets.map(

                            (dataset)=>(

                                <tr
                                    key={
                                        dataset.id
                                    }
                                >

                                    <td>

                                        {
                                            dataset.id
                                        }

                                    </td>

                                    <td>

                                        <button

                                            onClick={()=>
                                                handlePreview(
                                                    dataset.id
                                                )
                                            }

                                        >

                                            {
                                                dataset.display_name
                                            }

                                        </button>

                                    </td>

                                    <td>

                                        {
                                            dataset.original_filename
                                        }

                                    </td>

                                    <td>

                                        {
                                            dataset.status
                                        }

                                    </td>

                                    <td>

                                        {
                                            dataset.rows
                                        }

                                    </td>

                                    <td>

                                        {
                                            dataset.columns
                                        }

                                    </td>

                                    <td>

                                        <button

                                            onClick={()=>
                                                handleDelete(
                                                    dataset.id
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

            {

    preview && (

        <>

            <hr/>

            <h2>

                Dataset Preview

            </h2>

            <h3>

                Column Mapping

            </h3>

            <table
                border={1}
                cellPadding={8}
            >

                <thead>

                    <tr>

                        <th>

                            Dataset Column

                        </th>

                        <th>

                            TrustAI Role

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        preview.columns.map(

                            (

                                column: string,

                                index: number

                            )=>(

                                <tr
                                    key={index}
                                >

                                    <td>

                                        {column}

                                    </td>

                                    <td>

                                        <select

                                            value={
                                                Object.keys(mapping).find(

                                                    role => mapping[role] === column

                                                ) ?? ""

                                            }

                                            onChange={(e)=>

                                                updateMapping(

                                                    column,

                                                    e.target.value

                                                )

                                            }

                                        >

                                            <option value="">

                                                Not Used

                                            </option>

                                            <option value="User Prompt">

                                                User Prompt

                                            </option>

                                            <option value="Expected Response">

                                                Expected Response

                                            </option>

                                            <option value="LLM Response">

                                                LLM Response

                                            </option>

                                        </select>

                                    </td>

                                </tr>

                            )

                        )

                    }

                </tbody>

            </table>

            <br/>

            <button

                onClick={handleSaveMapping}

            >

                Save Column Mapping

            </button>

            <hr/>

            <h3>

                Preview

            </h3>

            <table
                border={1}
                cellPadding={6}
            >

                <thead>

                    <tr>

                        {

                            preview.columns.map(

                                (

                                    column: string,

                                    index: number

                                )=>(

                                    <th
                                        key={index}
                                    >

                                        {column}

                                    </th>

                                )

                            )

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        preview.rows.map(

                            (

                                row: any[],

                                rowIndex: number

                            )=>(

                                <tr
                                    key={rowIndex}
                                >

                                    {

                                        row.map(

                                            (

                                                cell,

                                                cellIndex

                                            )=>(

                                                <td
                                                    key={cellIndex}
                                                >

                                                    {

                                                        cell === null

                                                        ?

                                                        ""

                                                        :

                                                        String(cell)

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

        </>

    )

}

                            

        </div>

    );

}