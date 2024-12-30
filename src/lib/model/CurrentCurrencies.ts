export interface CurrencyRates {
    [key: string]: number;
}

export interface CurrentCurrencies {
    status: string;
    base: string;
    currencies: CurrencyRates;
    timestamp: string;
}