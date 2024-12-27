<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as echarts from "echarts";
    import type {ECharts} from "echarts";

    let { data = $bindable() } = $props();

    let chartContainer : HTMLDivElement;
    let chartInstance : ECharts;


    onMount(() => {
        if (chartContainer) {
            // Initialisation de l'instance ECharts
            chartInstance = echarts.init(chartContainer);


            const chartOptions = {
                title: {
                    text: "Investissement",
                },
                tooltip: {},
                xAxis: {
                    type: "category",
                    data : ["lundi", "mardi"]
                    // data: Array.from({ length: data.invsetissement_duration }, (_, i) => (new Date().getFullYear()) + i),
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        name: "years",
                        type: "line",
                        data: [120,120],
                    },
                ],
            };

            // Appliquer les options
            chartInstance.setOption(chartOptions as any);

            // Gestion de redimensionnement
            const resizeObserver = new ResizeObserver(() => {
                chartInstance.resize();
            });

            resizeObserver.observe(chartContainer);

            onDestroy(() => {
                resizeObserver.disconnect();
                chartInstance.dispose(); // Nettoyage
            });
        }
    });
</script>


<div
        bind:this={chartContainer}
        class="w-full h-full"
></div>
