import api from "./api";

export async function signup(
    email: string,
    password: string
) {

    const response = await api.post(
        "/auth/signup",
        {
            email,
            password,
        }
    );

    return response.data;
}

export async function login(
    email: string,
    password: string
) {

    const response = await api.post(
        "/auth/login",
        {
            email,
            password,
        }
    );

    return response.data;
}

export async function me() {

    const response = await api.get("/auth/me");

    return response.data;
}