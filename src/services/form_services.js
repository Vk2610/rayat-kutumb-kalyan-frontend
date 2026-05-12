import axios from "axios";
import axiosInstance from "../pages/admin/axiosInstance";

export const updateFormStatus = async (status, id) => {
    try {
        const payload = {
            status: status,
            id: id
        };
        await axios.patch('https://rayat-backend-1.onrender.com/admin/update-form-status', payload);
        alert(`Form Status changed to ${status}`);
        return true;
    } catch (error) {
        console.log('Error updating form status: ', error);
        alert('Error updating form status');
        return false;
    }
}

export const updateApprovalAmount = async (amount, id) => {
    try {
        const payload = {
            amt: amount,
            id: id
        };
        await axios.patch('https://rayat-backend-1.onrender.com/admin/update-appr-amt', payload);
        alert('Form approval amount updated successfully');
    } catch (error) {
        console.log('Error updating approval amount: ', error);
        alert('Error updating apprroval amount');
    }
}

export const getApprovedApplications = async (params = {}) => {
    const response = await axiosInstance.get("/api/applications", {
        params,
    });

    return response.data;
};

export const getReportApplications = async (params = {}) => {
    const response = await axiosInstance.get("/api/applications/reports", {
        params,
    });

    return response.data;
};

export const getFormDetailByRequestId = async (requestId) => {
    const response = await axiosInstance.get("/admin/get-form-detail", {
        params: { requestId },
    });

    return response.data;
};

export const deleteFormEntry = async (id) => {
    await axios.delete(`https://rayat-backend-1.onrender.com/admin/delete-form/${id}`);
    return true;
};

export const updateApprovedApplicationAmount = async (id, payload) => {
    const response = await axiosInstance.patch(
        `/api/applications/${id}/approve-amount`,
        payload
    );

    return response.data;
};

