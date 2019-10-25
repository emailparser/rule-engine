
export interface ApiConfig{
    accessKey: string;
    secretKey: string;
    vendorId: number;
    defaultCurrency: string;
    defaultLang: string;
    tourIds: string;

    defaultEmail: string;
    defaultPhone: string;
}

export interface RequestConfig{
    route: string;
    headers: any;
}

export interface Bookable{
    activityRequest: BookableActivityRequest;
    customer: BookableCustomer;
    paymentOption: string;
}

export interface BookableActivityRequest {
    activityId: string;
    pricingCategoryBookings: PricingCategory[];
    date: string;
    startTimeId: string;
    pickupPlaceId?: string;
    dropoffPlaceId?: string;
}

export interface BookableCustomer{
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    phoneNumberCountryCode?: string;
}

export interface PricingCategory {
    pricingCategoryId: string;
}

export interface ParsedData {
    fromDate: DateFrom;
    activity: string;
    bookingRef: string;
    pickupLocation: Location;
    dropoffLocation: Location;
    comment?: string;
    customer: CustomerInfo;
    pax: PaxType[];
}

export interface Location{
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
    phoneNumber: string;
}

