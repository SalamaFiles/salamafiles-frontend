<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    let {
        labels = [],
        values = [],
        colors = [
            "#ef4444",
            "#f59e0b",
            "#22c55e",
            "#3b82f6",
            "#8b5cf6",
            "#14b8a6"
        ]
    } = $props();

    let canvas;
    let chart;

    function buildChart() {

        if (!canvas) return;

        chart?.destroy();

        chart = new Chart(canvas, {

            type: "doughnut",

            data: {

                labels,

                datasets: [

                    {

                        data: values,

                        backgroundColor: colors,

                        borderColor: "#ffffff",

                        borderWidth: 3,

                        hoverOffset: 8

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "65%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            padding: 18,

                            usePointStyle: true,

                            pointStyle: "circle"

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

    width:100% !important;

    height:100% !important;

}

</style>