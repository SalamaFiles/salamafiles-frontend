<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    let {
        labels = [],
        values = [],
        label = "Reports"
    } = $props();

    let canvas;
    let chart;

    function buildChart() {

        if (!canvas) return;

        chart?.destroy();

        chart = new Chart(canvas, {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label,

                        data: values,

                        borderColor: "#14b8a6",

                        backgroundColor: "rgba(20,184,166,.12)",

                        borderWidth: 3,

                        fill: true,

                        tension: .35,

                        pointRadius: 4,

                        pointHoverRadius: 6,

                        pointBackgroundColor: "#14b8a6"

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {

                    intersect: false,

                    mode: "index"

                },

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    x: {

                        grid: {

                            display: false

                        }

                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            precision: 0

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

    position:relative;

    width:100%;

    height:100%;

}

canvas{

    width:100%!important;

    height:100%!important;

}

</style>