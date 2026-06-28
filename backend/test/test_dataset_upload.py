import streamlit as st
import requests

BACKEND_URL = "http://82.112.237.61:8000"

st.set_page_config(
    page_title="TrustAI Dataset Upload Tester",
    layout="centered"
)

st.title("TrustAI Dataset Upload Tester")

st.header("1. Login")

email = st.text_input("Email")
password = st.text_input(
    "Password",
    type="password"
)

token = None

if st.button("Login"):

    response = requests.post(

        f"{BACKEND_URL}/auth/login",

        json={
            "email": email,
            "password": password
        }

    )

    if response.status_code == 200:

        data = response.json()

        if data["status"] == "success":

            token = data["access_token"]

            st.session_state["token"] = token

            st.success("Login Successful")

        else:

            st.error(data["message"])

    else:

        st.error(response.text)


if "token" in st.session_state:

    st.divider()

    st.header("2. Upload Dataset")

    display_name = st.text_input(
        "Dataset Name"
    )

    uploaded_file = st.file_uploader(

        "Choose Excel File",

        type=["xlsx"]

    )

    if st.button("Upload Dataset"):

        if uploaded_file is None:

            st.error(
                "Please choose an Excel file."
            )

        else:

            headers = {

                "Authorization":
                f"Bearer {st.session_state['token']}"

            }

            files = {

                "file": (
                    uploaded_file.name,
                    uploaded_file,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )

            }

            data = {

                "display_name": display_name

            }

            response = requests.post(

                f"{BACKEND_URL}/datasets",

                headers=headers,

                data=data,

                files=files

            )

            st.write("Status Code:", response.status_code)

            try:

                st.json(
                    response.json()
                )

            except Exception:

                st.write(
                    response.text
                )