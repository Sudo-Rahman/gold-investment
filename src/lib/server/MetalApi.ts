import type {CurrentMetalsPrice} from '$lib/model/CurrentMetalsPrice';
import {METALS_API_KEY} from "$env/static/private";
import {format} from 'date-fns';
import type {MetalsTimeSeries} from "$lib/model/MetalsTimeSeries";


const API_URL = "https://api.metals.dev/v1/";

export class MetalApi {

    public async getMetalTimeSeries(
        startDate: Date,
        endDate: Date,
    ): Promise<MetalsTimeSeries> {

        if (startDate > endDate) {
            throw new Error('Start date must be before end date');
        }

        // if 30 days or more, return error
        if (endDate.getTime() - startDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
            throw new Error('Date range must be 30 days or less');
        }

        //formatting dates to "2023-01-31"
        const formatted_start_date = format(startDate, 'yyyy-MM-dd');
        const formatted_end_date = format(endDate, 'yyyy-MM-dd');

        const url = `${(API_URL)}timeseries?api_key=${METALS_API_KEY}&start_date=${formatted_start_date}&end_date=${formatted_end_date}`

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
        });

        return await response.json()
    }


    public async getCurrentMetalPrice(): Promise<CurrentMetalsPrice> {
        return (await fetch(`${API_URL}latest?api_key=${METALS_API_KEY}&currency=USD&unit=g`,
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        )).json();
    }
}

export const metalApi = new MetalApi()

