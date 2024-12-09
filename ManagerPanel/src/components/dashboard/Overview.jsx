import React, { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, Typography, FormControl, Select, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // For the dropdown icon
import { fetchTopProducts } from '../../API/Dashboard/dashboardAPIs';

const Overview = () => {
    const [period, setPeriod] = useState('weekly'); // Selected period
    const [chartData, setChartData] = useState([]);
    const [isChartVisible, setIsChartVisible] = useState(false); // State for controlling the visibility of the chart

    // Fetch data whenever the period changes
    useEffect(() => {
        const getChartData = async () => {
            try {
                const data = await fetchTopProducts(period); // Use the API utility function
                setChartData(data);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };
        getChartData();

        // Set timeout to show the chart after 5 seconds
        const timeout = setTimeout(() => {
            setIsChartVisible(true); // Make the chart visible after 5 seconds
        }, 1000); // 5000 ms = 5 seconds

        // Clear the timeout when the component unmounts or when the period changes
        return () => clearTimeout(timeout);
    }, [period]);

    return (
        <Card sx={{ mb: 2, backgroundColor: 'charts.bg', boxShadow: 5 }}>
            {/* Card Header with Period Dropdown and Title */}
            <CardHeader
                title={<Typography variant="h4" sx={{ fontWeight: 'bold' }}>Top Products Overview</Typography>}
                subheader={`Analyze the performance of your top products by period.`}
                sx={{
                    padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'charts.heading',
                    '& .MuiCardHeader-subheader': {
                        color: 'charts.text',
                    }
                }}
                action={
                    <FormControl sx={{ minWidth: 120, borderRadius: "5px", borderColor: "charts.text", boxShadow: 4, backgroundColor: 'charts.text' }}>
                        <Select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            displayEmpty
                            IconComponent={ArrowDropDownIcon}
                            sx={{ paddingRight: 1, color: 'charts.period', fontWeight: 'bold' }}
                        >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                    </FormControl>
                }
            />

            {/* Chart Section */}
            <CardContent>
                <div style={{ width: '100%', height: 450 }}>
                    {isChartVisible ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                animationDuration={1000} // Duration of the bar animation (in ms)
                                animationEasing="ease-out" // Easing effect for the animation
                            >
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        padding: '8px',
                                    }}
                                    cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#3f51b5"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1000} // Animation duration for individual bars
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Typography variant="body1" color="text.secondary">...</Typography>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default Overview;
