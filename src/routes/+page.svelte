<script lang="ts">
    import {Input} from "$lib/components/ui/input/index.js";
    import {Label} from "$lib/components/ui/label/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import {Button} from "$lib/components/ui/button";
    import InvestmentChart from "$lib/components/InvestmentChart.svelte";
    import TimeSeriesChart from "$lib/components/TimeSeriesChart.svelte";
    import type {Investment} from "$lib/model/Investment";

    let {data} = $props()

    $effect(()=>{
        console.log(data)
    });


    let chartData = $state<Investment>({
        start_invsetissement: 0,
        invsetissement_duration: 10,
        additional_invsetissement: 1,
        additional_freq: "month",
    })

    const frequency = [
        { value: "month", label: "Monthly" },
        { value: "year", label: "Yearly" },
    ];


    const triggerAdditional_freq= $derived(
        frequency.find((f) => f.value === chartData.additional_freq)?.label ?? "month"
    );


    function calculate() {
    }

    function reset() {
        chartData = {
            start_invsetissement: 0,
            invsetissement_duration: 10,
            additional_invsetissement: 1,
            additional_freq: "month",
        };
    }


</script>


<div class="flex items-center h-screen w-full flex-col justify-around min-w-[52rem] p-12">

    <h1 class="text-4xl mt-10 font-bold">Gold Investisment</h1>

    <div class="items-center flex w-[50%] min-w-[52rem] h-[48rem]">
        <TimeSeriesChart bind:data={data.metalsTimeSeries}/>
    </div>

    <div class="w-[52rem] flex flex-col items-center p-12 rounded-sm space-y-10 bg-blue-300">

        <div class="flex items-center w-full">
            <Label class="text-xl font-bold w-96">Starting possession: </Label>
            <div class="flex items-center space-x-1">
                <Input bind:value={chartData.start_invsetissement} type="number" class="w-fit transition-all duration-500 ease-in-out"/>
                <Label class="text-xl">gram</Label>
            </div>
        </div>

        <div class="flex  items-center w-full">
            <Label class="text-xl font-bold w-96">years to invest: </Label>
            <div class="flex items-center space-x-1">
                <Input bind:value={chartData.invsetissement_duration} type="number" class="w-fit transition-all duration-500 ease-in-out"></Input>
                <Label class="text-xl">{chartData.invsetissement_duration > 1 ? "years" : "year" }</Label>
            </div>
        </div>

        <div class="flex items-center w-full">
            <Label class="text-xl font-bold w-96">Additional contributions : </Label>

            <div class="flex items-center space-x-1">
                <Input bind:value={chartData.additional_invsetissement} type="number" class="w-fit transition-all duration-500 ease-in-out"></Input>
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

        <div class="flex justify-between items-center w-full">

            <Button class="w-40" onclick={calculate}>Calculate</Button>

            <Button class="w-40" onclick={reset}>Reset</Button>

        </div>

        <div class="w-full flex items-center h-96">
            <InvestmentChart data={chartData} current_metals_price={data.currentMetalsPrice}/>
        </div>

    </div>

</div>