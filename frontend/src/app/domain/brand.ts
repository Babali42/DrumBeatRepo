export declare const brand: unique symbol;

export type Brand<T, B> = T & { readonly [brand]: B };
