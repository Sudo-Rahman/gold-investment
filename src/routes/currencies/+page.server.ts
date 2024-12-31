import type {PageServerLoad} from './$types';
import {metalApi} from "$lib/server/MetalApi";
import {cacheApiResponse} from "$lib/server/Cache";


export const load: PageServerLoad = async () => {

    let currentCurrencies = await cacheApiResponse.getCurrentCurrencies();
    if (!currentCurrencies) {
        currentCurrencies = await metalApi.getCurrentCurrencies();

        if(currentCurrencies.status === "success")
            await cacheApiResponse.cacheCurrentCurrencies(currentCurrencies);

    }

    return {
        currentCurrencies: currentCurrencies
    };

};