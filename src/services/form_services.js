import api from "./api";

export const updateFormStatus = async (status, id) => {
    try {
        const payload = { status, id };
        await api.patch('/admin/update-form-status', payload);
        alert(`Form Status changed to ${status}`);
        return true;
    } catch (error) {
        console.error('Error updating form status: ', error);
        alert('Error updating form status');
        return false;
    }
};

export const updateApprovalAmount = async (amount, id) => {
    try {
        const payload = { amt: amount, id };
        await api.patch('/admin/update-appr-amt', payload);
        alert('Form approval amount updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating approval amount: ', error);
        alert('Error updating approval amount');
        return false;
    }
};

export const getApprovedApplications = async (params = {}) => {
    const response = await api.get("/api/applications", { params });
    return response.data;
};

export const getReportApplications = async (params = {}) => {
    const response = await api.get("/api/applications/reports", { params });
    return response.data;
};

export const getFormDetailByRequestId = async (requestId) => {
    const response = await api.get("/admin/get-form-detail", { params: { requestId } });
    return response.data;
};

export const deleteFormEntry = async (id) => {
    try {
        await api.delete(`/admin/delete-form/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting form entry: ', error);
        return false;
    }
};

export const updateApprovedApplicationAmount = async (id, payload) => {
    const response = await api.patch(`/api/applications/${id}/approve-amount`, payload);
    return response.data;
};
