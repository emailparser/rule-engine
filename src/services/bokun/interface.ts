export interface ApiConfig{
    accessKey: string;
    secretKey: string;
    vendorId: number;
    defaultCurrency: string;
    defaultLang: string;
    tourIds: string;
}

export interface RequestConfig{
    route: string;
    headers: any;
}
// export interface Bookable {
    
// }

export interface ParsedData {
    dateFrom: DateFrom;
    activity: string;
    bookingRef: string;
    pickupLocation: PickupLocation;
    comment?: string;
    customer: CustomerInfo;
    pax: PaxType[];
}

export interface PickupLocation{
    needsPickup: boolean;
    location: string;
}

export interface DateFrom{
    startTime: Date;
    flightTime: string;
    flightNumber: string;
}

export interface PaxType{
    paxType: string;
    paxCount: string;
    birthYear?: string;
    age?: string;
}

export interface ParsedExtras{
    item: string;
    quantity: string;
}

export interface CustomerInfo{
    firstName: string;
    lastName: string;
    email: string;
}

