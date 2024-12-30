import type {PageServerLoad} from './$types';
import {metalApi} from "$lib/server/MetalApi";
import {cacheApiResponse} from "$lib/server/Cache";


export const load: PageServerLoad = async () => {

    let metalsTimeSeries = await cacheApiResponse.getMetalsTimeSeries();
    if (!metalsTimeSeries) {

        const now = new Date();
        const nowMinus30Days = new Date();
        nowMinus30Days.setDate(now.getDate() - 30);

        metalsTimeSeries = await metalApi.getMetalTimeSeries(nowMinus30Days, now);

        if(metalsTimeSeries.status === "success")
            await cacheApiResponse.cacheMetalsTimeSeries(metalsTimeSeries);
    }

    let currentMetalsPrice = await cacheApiResponse.getCurrentMetalPrice();
    if (!currentMetalsPrice) {
        currentMetalsPrice = await metalApi.getCurrentMetalPrice();

        if(currentMetalsPrice.status === "success")
            await cacheApiResponse.cacheCurrentMetalPrice(currentMetalsPrice);
    }

    let currentCurrencies = await cacheApiResponse.getCurrentCurrencies();
    if (!currentCurrencies) {
        currentCurrencies = await metalApi.getCurrentCurrencies();

        if(currentCurrencies.status === "success")
            await cacheApiResponse.cacheCurrentCurrencies(currentCurrencies);

    }

    return {
        metalsTimeSeries: metalsTimeSeries,
        currentMetalsPrice: currentMetalsPrice,
        currentCurrencies: currentCurrencies
    };

};