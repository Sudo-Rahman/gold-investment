<script lang="ts">
    import {currenciesFlag, type CurrenciesFlagType} from "$lib/model/currenciesFlag";
    import type {PageServerData} from "./$types";
    import * as Card from "$lib/components/ui/card/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {flip} from 'svelte/animate';
    import CurrenciesCombobox from "$lib/components/CurrenciesCombobox.svelte";
    import {Label} from "$lib/components/ui/label";
    import {Button} from "$lib/components/ui/button";
    import {ArrowUpDown} from 'lucide-svelte';
    import {browser} from "$app/environment";


    let {data}: { data: PageServerData } = $props();


    let initialRate = browser ? Number(localStorage.getItem('rate')) || 1 : 1;
    let initialFromCurrency = browser ? localStorage.getItem('fromCurrency') || "USD" : "USD";
    let initialToCurrency = browser ? localStorage.getItem('toCurrency') || "EUR" : "EUR";

    // Save the rate and selected currencies to the local storage
    $effect(() => {
        if (browser) {
            localStorage.setItem('rate', rate.toString());
            localStorage.setItem('fromCurrency', selected_currency.code);
            localStorage.setItem('toCurrency', selected_currency_to.code);
        }
    });

    const currencies_flag = $state(currenciesFlag);
    let filtered: CurrenciesFlagType[] = $state(currencies_flag);
    let search = $state("");
    let rate = $state(initialRate);
    let selected_currency = $state(currencies_flag.find((c) => c.code === initialFromCurrency))!;
    let selected_currency_to = $state(currencies_flag.find((c) => c.code === initialToCurrency))!;

    $effect(() => {
        calculateRate();
    });
    $effect(() => {
        if (search) {
            filtered = currencies_flag.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()));
        } else {
            filtered = currencies_flag;
        }
    })

    function handleClick(currency: CurrenciesFlagType) {
        selected_currency = currency;
        calculateRate();
    }

    function calculateRate() {
        currencies_flag.forEach((c) => {
            if (c.code === selected_currency.code) {
                c.rate = 1;
            } else {
                c.rate = +(data.currentCurrencies.currencies[selected_currency.code] / data.currentCurrencies.currencies[c.code]).toFixed(3);
            }
        });
    }

    function invertCurrencies() {
        const temp = selected_currency;
        selected_currency = selected_currency_to;
        selected_currency_to = temp;
        calculateRate();
    }

</script>


<div class="min-h-screen bg-gradient-to-br py-32 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto flex flex-col space-y-12">

        <h1 class="text-4xl font-bold text-center dark:text-gray-800 text-gray-900 te mb-8">🌍 World Currencies</h1>

        <div class="flex bg-card shadow-foreground/10 shadow p-4 rounded-lg">

            <div class="flex flex-col items-center w-full">
                <h1 class="text-2xl font-semibold text-gray-700">{rate.toLocaleString(undefined, {
                    style: 'currency',
                    currency: selected_currency.code,
                    minimumFractionDigits: 3,
                })}
                    = {(rate * (selected_currency_to.rate || 1)).toLocaleString(undefined, {
                        style: 'currency',
                        currency: selected_currency_to.code,
                        minimumFractionDigits: 3,
                    })}</h1>
                <Button
                        variant="outline"
                        onclick={invertCurrencies}>
                    <ArrowUpDown class="h-4 w-4"/>
                </Button>
                <h1 class="text-2xl font-semibold text-gray-700">{rate.toLocaleString(undefined, {
                    style: 'currency',
                    currency: selected_currency_to.code,
                    minimumFractionDigits: 3,
                })}
                    = {(rate * (data.currentCurrencies.currencies[selected_currency_to.code] / data.currentCurrencies.currencies[selected_currency.code])).toLocaleString(undefined, {
                        style: 'currency',
                        currency: selected_currency.code,
                        minimumFractionDigits: 3,
                    })}</h1>

                <div class="grid-cols-1 grid items-stretch md:grid-cols-3 gap-4 w-full justify-center mt-6">
                    <div class="flex w-full border rounded-lg p-4 flex-col gap-1.5">
                        <Label>Amount</Label>
                        <Input type="number" bind:value={rate}
                               class="md:text-lg duration-700 transition-all ease-in-out"/>
                    </div>

                    <div class="flex w-full border rounded-lg p-4 flex-col gap-1.5">
                        <Label>From</Label>
                        <CurrenciesCombobox currencies={currencies_flag} bind:value={selected_currency}/>
                    </div>


                    <div class="flex border rounded-lg p-4 flex-col gap-1.5">
                        <Label>To</Label>
                        <CurrenciesCombobox currencies={currencies_flag} bind:value={selected_currency_to}/>
                    </div>
                </div>

            </div>
        </div>

        <div class="flex w-full border rounded-lg p-4 flex-col gap-1.5">
            <Label>Search currencies</Label>
            <Input bind:value={search} class="duration-700 transition-all ease-in-out"></Input>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 items-stretch md:grid-cols-3 gap-8">
            {#each filtered as currency (currency.code)}
                <div animate:flip={{duration : filtered.length <=10 ? 500 : 0}}>
                    <Card.Root
                            class="h-full hover:shadow-lg hover:shadow-foreground/10 shadow-md shadow-foreground/10 cursor-pointer hover:scale-105 duration-500"
                            onclick={ _ => handleClick(currency)}>
                        <Card.Header>
                            <Card.Title class="flex bg-transparent justify-center w-full">
                                <span class="text-5xl">{currency.flag}</span>
                            </Card.Title>
                        </Card.Header>
                        <Card.Content class="flex flex-col w-full space-y-5">
                            <div class="flex flex-col w-full">
                                <h2 class="text-xl font-semibold text-gray-700">{currency.code}</h2>
                                <p class="text-gray-500">{currency.name}</p>
                            </div>
                            <div class="flex flex-col w-full items-end">
                                <div class="flex w-full justify-end">
                                    <p class="text-gray-500">{(1).toLocaleString(undefined, {
                                        style: 'currency',
                                        currency: selected_currency.code,
                                        minimumFractionDigits: 3,
                                    })}
                                        = {(currency.rate || 0).toLocaleString(undefined, {
                                            style: 'currency',
                                            currency: currency.code,
                                            minimumFractionDigits: 3,
                                        })}</p>
                                </div>
                                <div class="flex w-full justify-end">
                                    <p class="text-gray-500">{(1).toLocaleString(undefined, {
                                        style: 'currency',
                                        currency: currency.code,
                                        minimumFractionDigits: 3,
                                    })}
                                        = {(1 / (currency.rate || 1)).toLocaleString(undefined, {
                                            style: 'currency',
                                            currency: selected_currency.code,
                                            minimumFractionDigits: 3,
                                        })}</p>
                                </div>
                            </div>
                        </Card.Content>
                    </Card.Root>
                </div>
            {/each}
        </div>
    </div>
</div>


<svelte:head>
    <title>World Currencies - Currency Converter and Rates</title>

    <meta name="description"
          content="Access a comprehensive list of world currencies with up-to-date conversion rates. Convert currencies, explore exchange rates, and manage your international transactions with ease.">

    <meta name="keywords"
          content="currency converter, world currencies, exchange rates, currency exchange, forex, currency rates, international money, money conversion, global currencies">

    <meta name="author" content="Sudo Rahman">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">

    <meta property="og:title" content="World Currencies - Currency Converter and Rates">
    <meta property="og:description"
          content="Easily access all world currencies and their latest conversion rates. Simplify your currency conversions with our intuitive interface.">
    <meta property="og:url" content="https://gold-investment.sudo-rahman.fr/currencies">
    <meta property="og:type" content="website">
</svelte:head>