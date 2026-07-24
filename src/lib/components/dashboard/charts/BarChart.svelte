<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    let {
        labels = [],
        values = [],
        label = "Value",
        color = "#14b8a6",
        horizontal = false
    } = $props();

    let canvas;
    let chart;

    function buildChart() {

        if (!canvas) return;

        chart?.destroy();

        chart = new Chart(canvas, {

            type: "bar",

            data: {

                labels,

                datasets: [

                    {

                        label,

                        data: values,

                        backgroundColor: color,

                        borderRadius: 8,

                        borderSkipped: false,

                        maxBarThickness: 40

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                indexAxis: horizontal ? "y" : "x",

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    x: {

                        grid: {

                            display: false

                        },

                        ticks: {

                            color: "#64748b"

                        }

                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            precision: 0,

                            color: "#64748b"

                        },

                        grid: {

                            color: "#e2e8f0"

                        }

                    }

                }

            }

        });

    }

    $effect(() => {

        buildChart();

    });

    onMount(() => {

        buildChart();

        return () => chart?.destroy();

    });

</script>

<div class="chart-container">

    <canvas bind:this={canvas}></canvas>

</div>

<style>

.chart-container{

    position: relative;

    width: 100%;

    height: 100%;

}

canvas{

    width:100% !important;

    height:100% !important;

}

</style>