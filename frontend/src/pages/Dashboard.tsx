import { useState } from "react";

import Sidebar from "../components/Sidebar";

import Datasets from "./Datasets";
import Metrics from "./Metrics";
import Reports from "./Reports";
import Settings from "./Settings";
import Evaluations from "./Evaluations";

export default function Dashboard() {

    const [page, setPage] =
        useState("Dashboard");

    return (

        <div
            style={{
                display: "flex",
                height: "100vh",
            }}
        >

            <Sidebar
                current={page}
                onChange={setPage}
            />

            <div
                style={{
                    flex: 1,
                    background: "#f5f7fb",
                    padding: "40px",
                    overflow: "auto",
                }}
            >

                {page === "Dashboard" &&

<div
    style={{
        maxWidth: "1100px",
    }}
>

    <h1
        style={{
            fontSize: "42px",
            marginBottom: "12px",
        }}
    >

        Welcome to TrustAI

    </h1>

    <p
        style={{
            fontSize: "18px",
            color: "#555",
            maxWidth: "850px",
            lineHeight: 1.8,
        }}
    >

        TrustAI is an LLM Evaluation Platform that helps developers
        measure, compare and analyze the quality of Large Language
        Model responses using customizable evaluation metrics.
        Upload datasets, define your own metrics, run automated
        evaluations and generate detailed reports to understand
        model performance.

    </p>

    <br/>

    <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
        }}
    >

        <div
            style={{
                background: "white",
                padding: "24px",
                borderRadius: "18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
        >

            <h3>

                📂 Datasets

            </h3>

            <p>

                Upload Excel datasets and configure column mappings
                for evaluation.

            </p>

        </div>

        <div
            style={{
                background: "white",
                padding: "24px",
                borderRadius: "18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
        >

            <h3>

                📏 Metrics

            </h3>

            <p>

                Use built-in metrics or create your own custom
                evaluation metrics.

            </p>

        </div>

        <div
            style={{
                background: "white",
                padding: "24px",
                borderRadius: "18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
        >

            <h3>

                ⚡ Evaluations

            </h3>

            <p>

                Execute evaluations on datasets using selected
                metrics and view detailed results.

            </p>

        </div>

        <div
            style={{
                background: "white",
                padding: "24px",
                borderRadius: "18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
        >

            <h3>

                📊 Reports

            </h3>

            <p>

                Explore summarized evaluation reports including
                metric averages and performance insights.

            </p>

        </div>

    </div>

    <br/>

    <div
        style={{
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
    >

        <h2>

            Workflow

        </h2>

        <p
            style={{
                fontSize: "17px",
                lineHeight: 2,
                color: "#555",
            }}
        >

            Upload Dataset
            {"  →  "}
            Configure Column Mapping
            {"  →  "}
            Create Evaluation Metrics
            {"  →  "}
            Run Evaluation
            {"  →  "}
            View Reports
            {"  →  "}
            Download Results

        </p>

    </div>

</div>

}

                {page === "Datasets" &&
                    <Datasets />
                }

                {page === "Metrics" &&
                    <Metrics />
                }

                {page === "Reports" &&
                    <Reports />
                }

                {page === "Settings" &&
                    <Settings />
                }

                {page === "Evaluations" &&
                    <Evaluations />
                }
                

            </div>

        </div>

    );

}