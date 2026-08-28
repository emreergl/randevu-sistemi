import api from "./api";

export const getEmployees = async () => {
    const response = await api.get("/employees");
    return response.data;
};

export const getAvailability = async (employeeId, Date, serviceId) => {
    const response = await api.get(`/employees/${employeeId}/availability`, {
        params: { date, serviceId }
    });
    return response.data;
};