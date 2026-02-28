import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export function TrafficLineChart({ data }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#ccc' } },
            title: { display: true, text: 'Prediction Activity Timeline', color: '#fff' },
        },
        scales: {
            y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };

    const chartData = {
        labels: data.map(d => d.date),
        datasets: [
            {
                label: 'Total Predictions',
                data: data.map(d => d.count),
                borderColor: '#00F5D4',
                backgroundColor: 'rgba(0, 245, 212, 0.5)',
                tension: 0.4
            }
        ],
    };

    return <div className="h-64"><Line options={options} data={chartData} /></div>;
}

export function AttackPieChart({ normal, attack }) {
    const data = {
        labels: ['Normal', 'Attack'],
        datasets: [
            {
                data: [normal, attack],
                backgroundColor: ['#22C55E', '#F43F5E'],
                borderColor: ['#14532d', '#881337'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#ccc' } }
        }
    };

    return <div className="h-64"><Pie data={data} options={options} /></div>;
}

export function FeatureBarChart({ labels, values }) {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'SHAP Value / Impact',
                data: values,
                backgroundColor: values.map(v => v > 0 ? 'rgba(244, 63, 94, 0.8)' : 'rgba(0, 245, 212, 0.8)'), // Red if raises risk, Cyan if lowers
                borderWidth: 0,
            }
        ]
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Local SHAP Explanation', color: '#fff' }
        },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#ccc' } },
            y: { grid: { display: false }, ticks: { color: '#ccc' } }
        }
    }

    return <div className="h-80"><Bar options={options} data={data} /></div>;
}
