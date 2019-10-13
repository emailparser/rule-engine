export interface ApiConfig{
    accessKey: string;
    secretKey: string;
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
    vehicle: string;
    bookingRef: string;
    locations: any[];
    extras: ParsedExtras[];
    insurances: string[];
    comment?: string;
    pickupInfo?: string;
    reseller: string;
    affiliate: string;
    customer: CustomerInfo;
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

