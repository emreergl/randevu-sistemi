import api from "./api";

export const createAppointment = async (data) => {
    const response = await api.post("/appointments", data);
    return response.data;
};

export const getAppointments = async (filters = {}) => {
    const response = await api.get("/appointments", { params: filters });
    return response.data;
};

export const cancelAppointment = async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
};