import { useEffect, useState } from "react";
import FormApprovalCard from "../../components/FormApprovalCard";
import axios from "axios";
import { CircularProgress, Box, Pagination } from "@mui/material";

function FormApproval() {
    const [isLoading, setLoading] = useState(true);
    const [forms, setForms] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalForms, setTotalForms] = useState(0);

    const fetchForms = async () => {
        try {
            const response = await axios.get("http://localhost:3000/admin/get-all-forms", {
                params: { page: page, limit: limit }
            });

            const data = response.data;
            setForms(data.forms.forms);
            setTotalForms(data.total); 
            setLoading(false);
        } catch (error) {
            console.error('Error fetching forms: ', error);
            setLoading(false);
        }
    }

    const handlePageChange = (pg) => {
        console.log(pg);
        if (forms.length === 0 && page < pg) {
            return;
        }
        setPage(pg);
    }

    useEffect(() => {
        fetchForms();
    }, [page]);

    return (
        <>
            {
                isLoading
                    ? <CircularProgress />
                    : <></> 
            }

            {      
                forms.length !== 0
                        ? forms.map((form) => (
                            <FormApprovalCard
                                key={form.requestId} 
                                requestId={form.requestId}
                                username={form.applicantName}
                                formDate={form.formDate}
                                formStatus={form.formStatus}
                                disease={form.illnessNature}
                                patientName={form.patientName}
                                relation={form.relation}
                                requestedAmount={form.requestedAmountNumbers}
                            />
                        ))
                        : <h1>No Forms Available</h1>
            }
            <Box display={"flex"} justifyContent={"center"} >
                <Pagination
                count={Math.ceil(totalForms / limit)}
                page={page}
                onChange={(event, value) => handlePageChange(value)}
                color="primary"
                sx={{ mt: 2 }}
                />
            </Box>
        </>
    )
}

export default FormApproval;
