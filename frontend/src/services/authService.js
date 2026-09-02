import api from "./api";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
};

export const register = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get("/auth/me");
};

export const updateProfile = async (data) => {
    const response = await api.put("/auth/me", data);
    return response.data;
};

export const changePassword = async (currenPassword, newPassword) => {
    const response = await api.put("/auth/me/password", {
        currentPassword,
        newPassword
    });
    return response.data;
};