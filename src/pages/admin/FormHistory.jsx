import {
    Box,
    Typography,
    Card,
    Grid,
    CircularProgress,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import FormHistoryCard from "../../components/FormHistoryCard";

export default function FormHistory() {

    const [isLoading, setLoading] = useState(true);
    const [forms, setForms] = useState([]);
    const [update, setUpdate] = useState(false);
    const location = useLocation();
    const { username, hrmsNo } = location.state;

    const [stats, setStats] = useState({
        approved: 0,
        pending: 0,
        rejected: 0,
        totalReqAmt: 0.0,
        totalApprAmt: 0.0,
        remBalance: 0.0
    });

    const { approved, pending, rejected, totalReqAmt, totalApprAmt, remBalance } = stats;

    const statsArr = [
        { label: "Total", value: forms.length, color: "rgb(7,170,23)" },
        { label: "Approved", value: approved, color: "rgb(7,170,23)" },
        { label: "Pending", value: pending, color: "rgb(255,152,0)" },
        { label: "Rejected", value: rejected, color: "rgb(211,47,47)" },
        { label: "Total Requested Amt", value: totalReqAmt, color: "#223f89ff" },
        { label: "Total Approved Amt", value: totalApprAmt, color: "rgb(7,170,23)" },
        { label: "Balance Remaining", value: remBalance, color: "#223f89ff" }
    ];

    const getStatusColor = (status) => {
        if (status === "Approved") return "rgb(7,170,23)";
        if (status === "Rejected") return "rgb(211,47,47)";
        return "rgb(255,152,0)";
    };

    const handleUpdate = () => {
        setUpdate(!update);
    }

    const getStats = (data) => {

        console.log('getStats called ', data);
        
        let approved = 0;
        let pending = 0;
        let rejected = 0;
        let totalReqAmt = 0;
        let totalApprAmt = 0;
        data.forEach((form) => {

            if (form.formStatus === 'Approved') {
                approved++;
            } else if (form.formStatus === 'Pending') {
                pending++;
            } else {
                rejected++;
            }

            totalReqAmt += Number(form.requestedAmountNumbers);
            totalApprAmt += Number(form.approvedAmount);
        });

        const temp = {
            approved,
            pending,
            rejected,
            totalReqAmt,
            totalApprAmt,
            remBalance: 100000 - totalApprAmt
        };

        setStats(temp);
    }

    const fetchForms = async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/get-user-forms', {
                params: { hrmsNo: hrmsNo }
            });

            const data = response.data;
            console.log(data.forms);
            getStats(data.forms || []);
            setForms(data.forms || []);
            setLoading(false);
        } catch (error) {
            console.error('Error retrieving forms: ', error);
            alert('Error retrieving forms');
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchForms();
    }, [update]);

    return (
        <Box
            sx={{
                width: "100%",
                p: 3,
            }}
        >
            {/* Title */}
            <Typography
                sx={{
                    fontSize: 25,
                    fontWeight: 700,
                    mb: 3,
                    color: "#333",
                }}
                textAlign={"center"}
            >
                {username}'s Application History
            </Typography>

            {
                isLoading
                    ? <CircularProgress />
                    : <>
                        {/* Stats Section */}
                        <Grid container spacing={2} sx={{ mb: 4 }} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            {statsArr.map((stat, i) => (
                                <Grid item xs={3} key={i}>
                                    <Card
                                        sx={{
                                            borderRadius: 2,
                                            p: 2,
                                            textAlign: "center",
                                            bgcolor: "#f7fff9",
                                            border: "1px solid rgba(7,170,23,0.2)",
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333333ff" }}>
                                            {stat.label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 22,
                                                fontWeight: 700,
                                                color: stat.color,
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Timeline Section */}
                        <Box sx={{ width: "100%", mt: 1 }}>
                            {forms.map((form) => (
                                <FormHistoryCard 
                                    key={form.requestId} 
                                    data={form} 
                                    statusColor={getStatusColor(form.formStatus)} 
                                    handleUpdate={handleUpdate}
                                />
                            ))}
                        </Box>
                    </>
            }
        </Box>
    );
}
