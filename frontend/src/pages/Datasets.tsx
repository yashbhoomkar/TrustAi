import "./Datasets.css";

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

<div className="datasets-page">

    <div className="page-header">

        <div>

            <h1>Datasets</h1>

            <p>
                Upload datasets and configure column mappings for evaluation.
            </p>

        </div>

    </div>

    <div className="upload-card">

        <h2>Upload Dataset</h2>

        <div className="upload-grid">

            <div className="field">

                <label>Display Name</label>

                <input
                    type="text"
                    placeholder="Example: SQL Evaluation Dataset"
                    value={displayName}
                    onChange={(e) =>
                        setDisplayName(e.target.value)
                    }
                />

            </div>

            <div className="field">

                <label>Excel File</label>

                <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => {

                        if (e.target.files) {

                            setFile(
                                e.target.files[0]
                            );

                        }

                    }}
                />

            </div>

        </div>

        <button
            className="primary-button"
            onClick={handleUpload}
        >
            Upload Dataset
        </button>

    </div>

    <div className="datasets-card">

        <div className="card-header">

            <h2>Your Datasets</h2>

            <span>

                {datasets.length} Dataset(s)

            </span>

        </div>

        <table className="modern-table">

            <thead>

                <tr>

                    <th>Name</th>

                    <th>Status</th>

                    <th>Rows</th>

                    <th>Columns</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {

                    datasets.map((dataset) => (

                        <tr key={dataset.id}>

                            <td>

                                <div>

                                    <strong>

                                        {dataset.display_name}

                                    </strong>

                                    <br />

                                    <small>

                                        {dataset.original_filename}

                                    </small>

                                </div>

                            </td>

                            <td>

                                <span className="status-badge">

                                    {dataset.status}

                                </span>

                            </td>

                            <td>

                                {dataset.rows}

                            </td>

                            <td>

                                {dataset.columns}

                            </td>

                            <td>

                                <div className="action-buttons">

                                    <button

                                        className="secondary-button"

                                        onClick={() =>
                                            handlePreview(dataset.id)
                                        }

                                    >

                                        Preview

                                    </button>

                                    <button

                                        className="danger-button"

                                        onClick={() =>
                                            handleDelete(dataset.id)
                                        }

                                    >

                                        Delete

                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    </div>

            
     {      
    preview && (

        <div className="preview-card">

            <div className="card-header">

                <h2>Dataset Preview</h2>

                <span>

                    {preview.rows.length} Sample Rows

                </span>

            </div>

            <div className="mapping-card">

                <h3>

                    Column Mapping

                </h3>

                <p>

                    Map your dataset columns to the fields used by TrustAI.

                </p>

                <table className="modern-table">

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

                                ) => (

                                    <tr key={index}>

                                        <td>

                                            <strong>

                                                {column}

                                            </strong>

                                        </td>

                                        <td>

                                            <select

                                                value={

                                                    Object.keys(mapping).find(

                                                        role =>

                                                            mapping[role] === column

                                                    ) ?? ""

                                                }

                                                onChange={(e) =>

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

                <button

                    className="primary-button"

                    onClick={handleSaveMapping}

                >

                    Save Mapping

                </button>

            </div>

            <div className="table-card">

                <h3>

                    Data Preview

                </h3>

                <div className="table-wrapper">

                    <table className="modern-table">

                        <thead>

                            <tr>

                                {

                                    preview.columns.map(

                                        (

                                            column: string,

                                            index: number

                                        ) => (

                                            <th key={index}>

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

        </div>

    )
}

</div>

);


}