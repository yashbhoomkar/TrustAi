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
                    <h1>Welcome to TrustAI</h1>
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