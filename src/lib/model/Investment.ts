
export const currencies = ["AUD", "BRL", "CAD", "CHF", "CNY", "EUR", "GBP", "HKD", "INR", "JPY", "SGD", "USD","TRY"] as const;
export type Currency = typeof currencies[number];

export const karats = [22, 24] as const;
export type Karat = typeof karats[number];

export interface Investment{
    start_invsetissement : number,
    invsetissement_duration : number,
    additional_invsetissement : number,
    additional_freq : "month" | "year",
    currency : Currency,
    karat : Karat,
    zakat : boolean,
    remove_zakat_investment : boolean,
    gold_return : number,
}