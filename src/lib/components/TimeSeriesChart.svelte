<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import type {ECharts} from "echarts";
    import * as echarts from "echarts";
    import type {MetalsTimeSeries} from "$lib/model/MetalsTimeSeries";
    import type {Investment} from "$lib/model/Investment";
    import type {CurrentCurrencies} from "$lib/model/CurrentCurrencies";

    let {data = $bindable(), chart_data = $bindable(),current_currencies}: {
        data: MetalsTimeSeries,
        chart_data: Investment
        current_currencies: CurrentCurrencies
    } = $props();

    let chartContainer: HTMLDivElement;
    let chartInstance: ECharts;

    $effect(() => {
        chart_data.currency
        chart_data.karat
        if (chartInstance) {
            render();
        }
    });

    let width = "100%";

    onMount(() => {
        if (chartContainer) {
            // initialize ECharts instance
            chartInstance = echarts.init(chartContainer);


            // resize chart on window resize
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


    function render() {
        const chartOptions: any = {
            tooltip: {
                trigger: "axis",
                formatter: (params: any) => {
                    let tooltip = `<strong>${params[0].name}</strong></br>`;
                    params.forEach((param: any) => {
                        tooltip += `${param.marker} ${param.seriesName}: ${param.value.toLocaleString(undefined, {
                            style: 'currency',
                            currency: chart_data.currency,
                        })}`;
                    })
                    return tooltip;
                },
            },
            xAxis: {
                type: "category",
                data: Object.keys(data.rates),
            },
            yAxis: {
                type: "value",
            },
            textStyle: {
                color: 'white'
            },
            series: [
                {
                    name: "Price",
                    type: "line",
                    data: Object.values(data.rates).map((rate) => (+((rate.metals.gold / 31.1034768) / current_currencies.currencies[chart_data.currency] * (chart_data.karat / 24)).toFixed(2))),
                    smooth: true,
                },
            ],
            animationEasing: 'cubicOut',
        };

        // apply options
        setTimeout(() => {
            chartInstance.setOption(chartOptions);
        }, 1);
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