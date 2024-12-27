<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as echarts from "echarts";
    import type {ECharts} from "echarts";
    import type {Investment} from "$lib/model/Investment";
    import type {CurrentMetalsPrice} from "$lib/model/CurrentMetalsPrice";

    let { data = $bindable(), current_metals_price } : { data : Investment , current_metals_price : CurrentMetalsPrice} = $props();

    let chartContainer : HTMLDivElement;
    let chartInstance : ECharts;

    let years = $derived(Array.from({ length: data.invsetissement_duration }, (_, i) => (new Date().getFullYear()) + i));
    let estimations : number[] = [];
    let additionals : number[]= [];
    console.log(years)
    console.log(data)

    $effect(() => {
        years
        if(chartInstance){
            render();
        }
    })

    function calculate() {
        let start_estimation = data.start_invsetissement * current_metals_price.metals.gold;
        let start_investment = data.start_invsetissement;
        let additional = data.additional_invsetissement * current_metals_price.metals.gold;
        estimations = []
        additionals = []
        estimations.push(start_estimation)
        additionals.push(0)
        for (let i = 1; i < data.invsetissement_duration; i++) {
            start_investment += data.additional_invsetissement;
            additional += data.additional_invsetissement;
            estimations.push(+(start_investment * current_metals_price.metals.gold).toFixed(2))
            additionals.push(+(additional * current_metals_price.metals.gold).toFixed(2))
        }
    }


    onMount(() => {
        if (chartContainer) {
            // initialize ECharts instance
            chartInstance = echarts.init(chartContainer);

            render();

            onDestroy(() => {
                chartInstance.dispose();
            });
        }
    });

    function render() {
        calculate()
        const chartOptions = {
            title: {
                text: "Investissement",
            },
            tooltip: {},
            xAxis: {
                type: "category",
                data : years

            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    name: "estimation",
                    type: "line",
                    data: estimations,
                },
                {
                    name: "investment",
                    type: "line",
                    data: additionals,
                }
            ],
        };

        // apply options
        chartInstance.setOption(chartOptions as any);
    }
</script>


<div
        bind:this={chartContainer}
        class="w-full h-full"
></div>
