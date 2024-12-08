import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Typography, Grid, CircularProgress } from "@mui/material";
import { ArrowUpward, PersonAdd, ShoppingCart, TrendingUp } from "@mui/icons-material";
import { motion } from "framer-motion";
import { fetchKPIData } from "../../API/Dashboard/dashboardAPIs"; // for KPI

function KPI() {
    const [kpiData, setKpiData] = useState({
        totalRevenue: 0,
        totalUsers: 0,
        totalOrders: 0,
        inventoryTurnover: 0,
    });

    const [loading, setLoading] = useState(true);
    const [isContentVisible, setIsContentVisible] = useState(false); // State to control content visibility

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchKPIData(); // Use the function from api.js
                setKpiData(data);
            } catch (error) {
                console.error("Error fetching KPI data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Set a timeout to show the content after 5 seconds
        const timeout = setTimeout(() => {
            setIsContentVisible(true); // Make the content visible after 5 seconds
        }, 950); // 5000 ms = 5 seconds

        // Clear the timeout when the component unmounts or when the data is re-fetched
        return () => clearTimeout(timeout);
    }, []);

    if (loading) {
        return <CircularProgress />; // Show loading spinner while data is being fetched
    }

    return (
        <Grid container spacing={4}>
            {isContentVisible && (
                <>
                    {/* Total Revenue Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card sx={{ backgroundColor: 'charts.bg', boxShadow: 5 }}>
                                <CardHeader
                                    title="Total Revenue"
                                    action={<ArrowUpward sx={{ color: 'charts.text' }} />}
                                    subheader="+20.1% from last month"
                                    sx={{
                                        color: 'charts.text', '& .MuiCardHeader-subheader': {
                                            color: 'charts.text',
                                        }
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                        ${kpiData.totalRevenue.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Total Users Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card sx={{ backgroundColor: 'charts.bg', boxShadow: 5 }}>
                                <CardHeader
                                    title="Total Users"
                                    action={<PersonAdd color="primary" />}
                                    subheader="+180.1% from last month"
                                    sx={{
                                        color: 'charts.text', '& .MuiCardHeader-subheader': {
                                            color: 'charts.text',
                                        }
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {kpiData.totalUsers.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Total Orders Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card sx={{ backgroundColor: 'charts.bg', boxShadow: 5 }}>
                                <CardHeader
                                    title="Total Orders"
                                    action={<ShoppingCart color="secondary" />}
                                    subheader="+19% from last month"
                                    sx={{
                                        color: 'charts.text', '& .MuiCardHeader-subheader': {
                                            color: 'charts.text',
                                        }
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {kpiData.totalOrders.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Inventory Turnover Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Card sx={{ backgroundColor: 'charts.bg', boxShadow: 5 }}>
                                <CardHeader
                                    title="Inventory Turnover"
                                    action={<TrendingUp color="warning" />}
                                    subheader="+201 since last hour"
                                    sx={{
                                        color: 'charts.text', '& .MuiCardHeader-subheader': {
                                            color: 'charts.text',
                                        }
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {kpiData.inventoryTurnover.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </>
            )}
        </Grid>
    );
}

export default KPI;
