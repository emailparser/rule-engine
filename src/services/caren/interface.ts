export interface ApiConfig{
    Apikey: string;
    Username: string;
    Password: string;
    rentalId: number;
}

export interface Bookable {
    session: string;
    rentalId: number;
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
    pickupLocation: string;
    dropoffLocation: string;
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