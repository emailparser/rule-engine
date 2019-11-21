export interface Bookable{
    guest: BGuest[];
    BaseRoomRequest: BBaseRoomGuest;
    remarks: BRemark;
    channel: BChannel;
    PaymentGuarantee: BPaymentGuarantee;
    "@contactGuest": string;
    "@externalBookingReference": string;
    "@useStayTax": string;
    "@profileGuest": string;
    "@schemaLocation": string;
}

// change any later;
type BGuest = any;
type BBaseRoomGuest = any;
type BRemark = any;
type BChannel = any;
type BPaymentGuarantee = any;

export interface ParsedData {
    rooms: Room[];
    extras: string[];
    checkin: Date;
    checkout: Date;
    bookingRef: string;
    nights?: number;
    
}

export interface Room{
    guests: Guest[];
    roomType: string;
    quantity?: number;
}

export interface Guest{
    firstName: string;
    lastName: string;
}

export interface ApiConfig{
    hotelKey: string;
    applicationKey: string;
    secret: string;
}
