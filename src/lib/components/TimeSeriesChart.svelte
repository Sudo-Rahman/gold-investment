<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import type {ECharts} from "echarts";
    import * as echarts from "echarts";
    import type {MetalsTimeSeries} from "$lib/model/MetalsTimeSeries";
    import type {Investment} from "$lib/model/Investment";

    let { data = $bindable(), chart_data = $bindable() } : {
        data: MetalsTimeSeries,
        chart_data: Investment
    } = $props();

    let chartContainer : HTMLDivElement;
    let chartInstance : ECharts;

    $effect(() => {
        chart_data.currency
        if(chartInstance) {
            render();
        }
    });

     let width = "100%";

    onMount(() => {
        if (chartContainer) {
            // initialize ECharts instance
            chartInstance = echarts.init(chartContainer);



            // Gestion de redimensionnement
            const resizeObserver = new ResizeObserver(() => {
                chartInstance.resize();
            });

            resizeObserver.observe(chartContainer);

            render();


            onDestroy(() => {
                resizeObserver.disconnect();
                chartInstance.dispose(); // Nettoyage
            });
        }
    });


    function render(){
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
                    name: "Price",
                    type: "line",
                    data: Object.values(data.rates).map((rate)=> (+((rate.metals.gold / 31.1034768)/rate.currencies[chart_data.currency]).toFixed(2))),
                    tooltip: {
                        trigger: 'item', // Définir le déclencheur global si nécessaire
                        formatter: (params: any) => {
                            return `${params.marker} ${params.seriesName}: ${params.value.toLocaleString(undefined, {
                                style: 'currency',
                                currency: chart_data.currency,
                            })}`;
                        },
                    },
                    smooth: true,
                },
            ],
            animationEasing: 'cubicOut',
        };

        setTimeout(() => {
            chartInstance.setOption(chartOptions);
        }, 1);
        // apply options
    }

</script>

<style>
    .chart-container {
        width: var(--chart-width, 100%);
    }
</style>

<div
        bind:this={chartContainer}
        class="chart-container h-full"
        style="--chart-width: {width};"
></div>