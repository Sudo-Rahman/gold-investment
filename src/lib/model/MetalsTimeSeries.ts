export interface Rates {
    [date: string]: {
        currencies: {
            [currencyCode: string]: number;
        };
        date: string;
        metals: {
            gold: number;
            silver: number;
            platinum: number;
            palladium: number;
        };
    };
}

export interface MetalsTimeSeries {
    status: string;
    currency: string;
    unit: string;
    start_date: string;
    end_date: string;
    rates: Rates;
}
