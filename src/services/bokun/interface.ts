export interface ApiConfig{
    accessKey: string;
    secretKey: string;
    vendorId: number;
    defaultCurrency: string;
    defaultLang: string;
}

export interface RequestConfig{
    route: string;
    headers: any;
}
export interface Bookable {
    session: string;
    rentalId: number;
    language: string;
    dateFrom: string;
    dateTo: string;
    classId: any;
    pickupLocationId: any;
    dropoffLocationId: any;
    extras: string[][];
    insurances: string[][];
    comments: string;
    customer: CustomerInfo;
    confirmReservation: boolean;
    pickupLocationExtraInfo: string;
    affiliate?: string;
    
}

export interface ParsedData {
    dateFrom: Date;
    dateTo: Date;
    activity: string;
    bookingRef: string;
    pickupLocation: string;
    comment?: string;
    customer: CustomerInfo;
    pax: PaxType[];
}

export interface PaxType{
    paxType: string;
    paxCount: string;
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

