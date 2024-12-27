<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as echarts from "echarts";
    import type {ECharts} from "echarts";
    import type {MetalsTimeSeries, Rates} from "$lib/model/MetalsTimeSeries";

    let { data = $bindable<MetalsTimeSeries>() } = $props();

    let chartContainer : HTMLDivElement;
    let chartInstance : ECharts;

    onMount(() => {
        if (chartContainer) {
            // initialize ECharts instance
            chartInstance = echarts.init(chartContainer);

            const chartOptions : any = {
                tooltip: {},
                xAxis: {
                    type: "category",
                    data: Object.keys(data.rates),
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        name: "Price in EUR",
                        type: "line",
                        data: Object.values(data.rates).map((rate)=> (rate.metals.gold / 28.34952).toFixed(2)),
                        smooth: true
                    },
                ],
                animationEasing: 'cubicOut',
            };

            // apply options
            chartInstance.setOption(chartOptions);


            onDestroy(() => {
                chartInstance.dispose(); // Nettoyage
            });
        }
    });
</script>

<div
        bind:this={chartContainer}
        class="w-full h-full"
></div>