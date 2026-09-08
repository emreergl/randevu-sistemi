import api from "./api";

export const getSummary =async () => {
    const response = await api.get("/reports/summary");
    return response.data;
};

export const getOccupancy = async (date) => {
    const response = await api.get("/reports/occupancy", { params: { date } });
    return response.data;
};

export const getPopularServices = async () => {
    const response = await api.get("/reports/popular-services");
    return response.data;
};