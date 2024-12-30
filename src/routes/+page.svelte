<script lang="ts">
    import {Input} from "$lib/components/ui/input/index.js";
    import {Label} from "$lib/components/ui/label/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import {Button} from "$lib/components/ui/button";
    import InvestmentChart from "$lib/components/InvestmentChart.svelte";
    import TimeSeriesChart from "$lib/components/TimeSeriesChart.svelte";
    import {currencies, type Currency, type Investment, karats} from "$lib/model/Investment";
    import {Switch} from "$lib/components/ui/switch";
    import type {PageServerData} from "../../.svelte-kit/types/src/routes/$types";


    let {data}: { data: PageServerData } = $props()


    let chart_data = $state<Investment>({
        start_invsetissement: 0,
        invsetissement_duration: 10,
        additional_invsetissement: 100,
        additional_freq: "month",
        currency: "USD",
        karat: 22,
        zakat: false,
        remove_zakat_investment: false,
        gold_return: 1.1
    })

    $effect(() => {
        chart_data.remove_zakat_investment = chart_data.zakat ? chart_data.remove_zakat_investment : false;
        chart_data.karat = karats_values.find(k => karat === k.value)?.int_value ?? 22;
    })

    const frequency = [
        {value: "month", label: "Monthly"},
        {value: "year", label: "Yearly"},
    ];

    const karats_values = karats.map(karats => {
        return {value: karats.toString(), label: `${karats} karat`, int_value: karats}
    })
    let karat = $state(karats_values[0].value);


    const triggerAdditional_freq = $derived(
        frequency.find((f) => f.value === chart_data.additional_freq)?.label ?? "month"
    );

    function reset() {
        chart_data = {
            start_invsetissement: 0,
            invsetissement_duration: 10,
            additional_invsetissement: 100,
            additional_freq: "month",
            karat: 22,
            currency: "USD",
            zakat: false,
            remove_zakat_investment: false,
            gold_return: 1.1
        };
    }


</script>


<div class="flex items-center h-full space-y-24 p-12 w-full flex-col bg-[url('/Dark-Z17Pro.jpg')] bg-cover min-w-[56rem]">

        <h1 class="text-4xl mt-10 font-bold">Gold Investisment</h1>

        <div class="flex justify-center w-full">
            <div class="items-center relative flex w-[50%] min-w-[52rem] h-[48rem]  border-white/20 border bg-background/20 backdrop-blur-md rounded-xl">
                <div class="flex absolute right-4 top-4 z-50">
                    <Select.Root type="single" bind:value={chart_data.currency}>
                        <Select.Trigger class="w-[180px]">
                            {chart_data.currency}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                {#each Object.keys(data.currentCurrencies.currencies) as currency}
                                    <Select.Item value={currency} label={currency}
                                    >{currency}</Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </div>
                <div class="p-4 flex w-full h-full">
                    <TimeSeriesChart data={data.metalsTimeSeries} bind:chart_data={chart_data}
                                     current_currencies={data.currentCurrencies}/>
                </div>
            </div>
        </div>

        <div class="w-[50%] min-w-[52rem] flex flex-col relative items-center subpixel-antialiased p-12 rounded-xl space-y-10 border-white/20 border bg-background/20 backdrop-blur-md">

            <div class="flex items-center w-full">
                <Label class="text-xl font-bold w-96 ">Karat : </Label>

                <div class="flex items-center w-full justify-end">
                    <Select.Root type="single" bind:value={karat}>
                        <Select.Trigger class="w-[180px]">
                            {chart_data.karat} karat
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                {#each karats_values as karat}
                                    <Select.Item value={karat.value} label={karat.label}
                                    >{karat.label}</Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>

            <div class="flex items-center w-full">
                <Label class="text-xl font-bold w-96 ">Starting possession : </Label>
                <div class="flex items-center space-x-1 w-full justify-end">
                    <Input bind:value={chart_data.start_invsetissement} type="number"
                           class="w-fit transition-all duration-500 ease-in-out"/>
                    <Label class="text-xl">{chart_data.start_invsetissement > 1 ? "grams" : "gram" }</Label>
                </div>
            </div>

            <div class="flex  items-center w-full ">
                <Label class="text-xl font-bold w-96">years to invest : </Label>
                <div class="flex items-center space-x-1 w-full justify-end">
                    <Input bind:value={chart_data.invsetissement_duration} type="number"
                           class="w-fit transition-all duration-500 ease-in-out"></Input>
                    <Label class="text-xl">{chart_data.invsetissement_duration > 1 ? "years" : "year" }</Label>
                </div>
            </div>

            <div class="flex items-center w-full ">
                <Label class="text-xl font-bold w-96">Additional contributions : </Label>

                <div class="flex items-center space-x-1 w-full justify-end">
                    <Input bind:value={chart_data.additional_invsetissement} type="number" step={100}
                           class="w-fit transition-all duration-500 ease-in-out"></Input>
                    <Select.Root type="single" bind:value={chart_data.additional_freq}>
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
                           bind:value={chart_data.gold_return}></Input>
                    <Label class="text-xl">%</Label>
                </div>
            </div>

            <div class="flex items-center w-full ">
                <Label class="text-xl font-bold w-96">Zakat : </Label>

                <div class="flex flex-col items-center space-y-4 w-full">
                    <div class="flex w-full justify-end items-center space-x-4">
                        <Switch bind:checked={chart_data.zakat}></Switch>
                    </div>
                    <div class="flex w-full justify-end items-center space-x-4">
                        <Label class="text-xl">Remove zakat from investment</Label>
                        <Switch bind:checked={chart_data.remove_zakat_investment}
                                disabled={!chart_data.zakat}></Switch>
                    </div>
                </div>
            </div>

            <div class="flex items-center w-full justify-end">
                <Button class="w-40" onclick={reset}>Reset</Button>

            </div>

            <div class="w-full flex items-center h-[36rem]">
                <InvestmentChart data={chart_data} current_metals_price={data.currentMetalsPrice}
                                 current_currencies={data.currentCurrencies}/>
            </div>

        </div>

    </div>
