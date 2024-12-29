<script lang="ts">
    import {Input} from "$lib/components/ui/input/index.js";
    import {Label} from "$lib/components/ui/label/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import {Button} from "$lib/components/ui/button";
    import InvestmentChart from "$lib/components/InvestmentChart.svelte";
    import TimeSeriesChart from "$lib/components/TimeSeriesChart.svelte";
    import type {Investment} from "$lib/model/Investment";
    import {Switch} from "$lib/components/ui/switch";

    let {data} = $props()


    let chartData = $state<Investment>({
        start_invsetissement: 0,
        invsetissement_duration: 10,
        additional_invsetissement: 100,
        additional_freq: "month",
        currency: "USD",
        karat: 24,
        zakat: false,
        remove_zakat_investment: false,
        gold_return: 1.1
    })

    $effect(() => {
        chartData.remove_zakat_investment = chartData.zakat ? chartData.remove_zakat_investment : false;

    })

    const frequency = [
        {value: "month", label: "Monthly"},
        {value: "year", label: "Yearly"},
    ];


    const triggerAdditional_freq = $derived(
        frequency.find((f) => f.value === chartData.additional_freq)?.label ?? "month"
    );

    function reset() {
        chartData = {
            start_invsetissement: 0,
            invsetissement_duration: 10,
            additional_invsetissement: 100,
            additional_freq: "month",
            karat: 24,
            currency: "USD",
            zakat: false,
            remove_zakat_investment: false,
            gold_return: 1.1
        };
    }


</script>


<div class="flex items-center h-full space-y-24 p-12 w-full flex-col bg-[url('/Dark-Z17Pro.jpg')] bg-cover min-w-[56rem]">

    <h1 class="text-4xl mt-10 font-bold">Gold Investisment</h1>

    <div class="flex justify-center w-full ">
        <div class="items-center flex w-[50%] min-w-[52rem] h-[48rem]  border-white/20 border bg-background/20 backdrop-blur-md rounded-xl">
            <TimeSeriesChart data={data.metalsTimeSeries} bind:chart_data={chartData}/>
        </div>
    </div>

    <div class="w-[50%] min-w-[52rem] flex flex-col items-center subpixel-antialiased p-12 rounded-xl space-y-10 border-white/20 border bg-background/20 backdrop-blur-md">

        <div class="flex items-center w-full">
            <Label class="text-xl font-bold w-96 ">Starting possession: </Label>
            <div class="flex items-center space-x-1 w-full justify-end">
                <Input bind:value={chartData.start_invsetissement} type="number"
                       class="w-fit transition-all duration-500 ease-in-out"/>
                <Label class="text-xl">{chartData.start_invsetissement > 1 ? "grams" : "gram" }</Label>
            </div>
        </div>

        <div class="flex  items-center w-full ">
            <Label class="text-xl font-bold w-96">years to invest: </Label>
            <div class="flex items-center space-x-1 w-full justify-end">
                <Input bind:value={chartData.invsetissement_duration} type="number"
                       class="w-fit transition-all duration-500 ease-in-out"></Input>
                <Label class="text-xl">{chartData.invsetissement_duration > 1 ? "years" : "year" }</Label>
            </div>
        </div>

        <div class="flex items-center w-full ">
            <Label class="text-xl font-bold w-96">Additional contributions : </Label>

            <div class="flex items-center space-x-1 w-full justify-end">
                <Input bind:value={chartData.additional_invsetissement} type="number" step={100}
                       class="w-fit transition-all duration-500 ease-in-out"></Input>
                <Select.Root type="single" bind:value={chartData.additional_freq}>
                    <Select.Trigger class="w-[180px]">
                        {triggerAdditional_freq}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            {#each frequency as freq}
                                <Select.Item value={freq.value} label={freq.label}
                                >{freq.label}</Select.Item
                                >
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </div>
        </div>

        <div class="flex items-center w-full">
            <Label class="text-xl font-bold w-96">Gold return : </Label>

            <div class="flex items-center space-x-1 w-full justify-end">
                <Input type="number" class="w-fit transition-all duration-500 ease-in-out" step={0.05} min={1}
                       max={2}
                       bind:value={chartData.gold_return}></Input>
                <Label class="text-xl">%</Label>
            </div>
        </div>

        <div class="flex items-center w-full ">
            <Label class="text-xl font-bold w-96">Zakat : </Label>

            <div class="flex flex-col items-center space-y-4 w-full">
                <div class="flex w-full justify-end items-center space-x-4">
                    <Switch bind:checked={chartData.zakat}></Switch>
                </div>
                <div class="flex w-full justify-end items-center space-x-4">
                    <Label class="text-xl">Remove zakat from investment</Label>
                    <Switch bind:checked={chartData.remove_zakat_investment} disabled={!chartData.zakat}></Switch>
                </div>
            </div>
        </div>

        <div class="flex items-center w-full justify-end">
            <Button class="w-40" onclick={reset}>Reset</Button>

        </div>

        <div class="w-full flex items-center h-[36rem]">
            <InvestmentChart data={chartData} current_metals_price={data.currentMetalsPrice}/>
        </div>

    </div>

</div>
