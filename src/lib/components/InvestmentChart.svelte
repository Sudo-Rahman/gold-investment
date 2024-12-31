<script lang="ts">
    import {onMount, onDestroy} from "svelte";
    import * as echarts from "echarts";
    import type {ECharts} from "echarts";
    import {type Investment} from "$lib/model/Investment";
    import type {CurrentMetalsPrice} from "$lib/model/CurrentMetalsPrice";
    import type {CurrentCurrencies} from "$lib/model/CurrentCurrencies";


    let {data = $bindable(), current_metals_price, current_currencies}: {
        data: Investment,
        current_metals_price: CurrentMetalsPrice,
        current_currencies: CurrentCurrencies
    } = $props();

    let chartContainer: HTMLDivElement;
    let chartInstance: ECharts;

    let width = "100%";

    let years = $derived(Array.from({length: data.invsetissement_duration}, (_, i) => (new Date().getFullYear()) + i));
    let estimations: number[] = [];
    let additionals: number[] = [];
    let golds: number[] = [];
    let zekats: number[] = [];

    $effect(() => {
        years
        data.additional_freq
        data.additional_invsetissement
        data.invsetissement_duration
        data.start_invsetissement
        data.zakat
        data.gold_return
        data.currency
        data.karat
        if (chartInstance) {
            render();
        }
    })

    function calculate() {
        let gold_g = data.start_invsetissement;
        const additional_invsetissement_ammount =data.additional_freq === "month" ? data.additional_invsetissement * 12 : data.additional_invsetissement;
        let additional_invsetissement = additional_invsetissement_ammount;

        estimations = [];
        additionals = [];
        golds = [];
        zekats = [];

        additionals.push(additional_invsetissement);
        estimations.push(+(gold_g * getGoldPrice(0)).toFixed(2) + additionals[0]);
        golds.push(gold_g + getAdditionalInvestment(0));
        if (data.zakat) {
            if (gold_g > 85) zekats.push(+(gold_g * 0.025 * current_metals_price.metals.gold).toFixed(2));
            else zekats.push(0);
        }

        for (let year = 1; year < data.invsetissement_duration; year++) {
            if (data.zakat) {
                if (gold_g > 85) zekats.push(+(gold_g * 0.025 * getGoldPrice(year + 1)).toFixed(2));
                else zekats.push(0);
            }
            gold_g += getAdditionalInvestment(year);
            golds.push(gold_g);
            additional_invsetissement += additional_invsetissement_ammount;

            if (data.remove_zakat_investment) {
                additional_invsetissement -= zekats[year];
            }

            additionals.push(additional_invsetissement);
            estimations.push(+(gold_g * getGoldPrice(year + 1) + additional_invsetissement_ammount).toFixed(2));
        }
    }

    // return the estimated price of gold for a given year
    function getGoldPrice(year: number): number {
        let start = current_metals_price.metals.gold / current_currencies.currencies[data.currency] * (data.karat / 24);
        for (let i = 1; i < year; i++) {
            start = start * (1 + (data.gold_return /100));
        }
        return start;
    }

    // return the quantity of gold in g bought with the additional investment
    function getAdditionalInvestment(year: number): number {
        let invested_amount = data.additional_invsetissement;
        if (data.additional_freq === "month") {
            invested_amount = invested_amount * 12;
        }

        return invested_amount / getGoldPrice(year);
    }


    onMount(() => {
        if (chartContainer) {
            // initialize ECharts instance
            chartInstance = echarts.init(chartContainer);

            render();

            // resize chart on window resize
            const resizeObserver = new ResizeObserver(() => {
                chartInstance.resize();
            });

            resizeObserver.observe(chartContainer);

            onDestroy(() => {
                resizeObserver.disconnect();
                chartInstance.dispose();
            });
        }
    });

    function render() {
        calculate()
        const chartOptions: any = {
            title: {
                text: "",
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {

                    // string to html element
                    let marker = new DOMParser().parseFromString(params[0].marker, 'text/html').body.firstChild as HTMLElement;

                    let tooltip = `<strong>${params[0].name}</strong></br>`;
                    params.forEach((param: any) => {
                        tooltip += `${param.marker} ${param.seriesName}: ${param.value.toLocaleString(undefined, {
                            style: 'currency',
                            currency: data.currency,
                        })}</br>`;
                    });


                    if (data.remove_zakat_investment) {
                        marker.style.backgroundColor = 'rgba(255,255,255,0)';
                        marker.innerHTML = '💰';
                        tooltip += `${marker.outerHTML} investment: ${(data.additional_invsetissement - zekats[params[0].dataIndex]).toLocaleString(undefined, {
                            style: 'currency',
                            currency: data.currency,
                        })}</br>`;
                    }

                    marker.style.backgroundColor = 'rgba(255,255,255,0)';
                    // pice of gold
                    marker.innerHTML = '🪙';
                    tooltip += `${marker.outerHTML} Total gold: ${golds[params[0].dataIndex].toFixed(2)}g`;

                    return tooltip;
                },
            },
            xAxis: {
                type: "category",
                data: years

            },
            textStyle: {
                color: 'white'
            },
            legend: {
                data: ['Total estimation', 'Total investment'],
                textStyle: {
                    color: 'white'
                }
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    name: "Total estimation",
                    type: "line",
                    data: estimations,
                },
                {
                    name: "Total investment",
                    type: "line",
                    data: additionals,
                }
            ],
        };

        if (data.zakat) {
            chartOptions.series.push({
                name: "Zakat",
                type: "line",
                data: zekats,
            });
            chartOptions.legend.data.push("Zakat");
        }

        // apply options
        setTimeout(() => {
            chartInstance.clear();
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