export interface Investment{
    start_invsetissement : number,
    invsetissement_duration : number,
    additional_invsetissement : number,
    additional_freq : "month" | "year",
    currency : "AUD" |"BRL" | "CAD" | "CHF" | "CNY" | "EUR" | "GBP" | "HKD" | "INR" | "JPY" | "SGD" | "USD",
    karat : 22 | 24,
    zakat : boolean,
    gold_return : number,
}