import axios from "axios";

export const updateFormStatus = async (status, id) => {
    try {
        const payload = {
            status: status,
            id: id
        };
        await axios.patch('http://localhost:3000/admin/update-form-status', payload);
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
        await axios.patch('http://localhost:3000/admin/update-appr-amt', payload);
        alert('Form approval amount updated successfully');
    } catch (error) {
        console.log('Error updating approval amount: ', error);
        alert('Error updating apprroval amount');
    }
}