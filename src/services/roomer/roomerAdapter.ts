import {Bookable} from "./interface";

export default class RoomerAdapter{

    public static async getBookableData(): Promise<Bookable>{
        return {
            "@contactGuest": "idvalue0",
            "@externalBookingReference": "TEST-BKNG-005",
            "@profileGuest": "idvalue0",
            "@useStayTax": "true",
            "@schemaLocation": "http://roomer.promoir.nl/datamodel/booking/modelobjects/2014/01/ ../../main/schema/BookingDataModel/RoomerBookingDataModel_ModelObjects.xsd",
            "guest": [
                {
                    "@id": "idvalue0",
                    "@nationalityCode": "NL",
                    "firstName": "ROOMER",
                    "middleNames": "PROMOIR",
                    "lastName": "TESTER",
                    "gender": "MALE",
                    "title": "MR",
                    "dateOfBirth": "1980-07-03",
                    "guestAgeCategory": "ADULT",
                    "address": {
                        "houseNumber": "15",
                        "extension": "a",
                        "street": "Testweg",
                        "postalCode": "1234AB",
                        "municipality": "Testendam",
                        "state": "Noord-Brabant",
                        "country": "NL"
                    },
                    "contactDetails": {
                        "telephone": "+31612345678",
                        "mobile": "+31612345678",
                        "email": "r.p.tester@test.roomerpms.com"
                    },
                    "preferredLanguage": "nl_NL"
                },
                {
                    "@id": "idvalue1",
                    "@nationalityCode": "NL",
                    "firstName": "ROOMER",
                    "middleNames": "PROMOIR",
                    "lastName": "TESTER",
                    "gender": "MALE",
                    "title": "MR",
                    "dateOfBirth": "1980-07-03",
                    "guestAgeCategory": "ADULT",
                    "address": {
                        "houseNumber": "15",
                        "extension": "a",
                        "street": "Testweg",
                        "postalCode": "1234AB",
                        "municipality": "Testendam",
                        "state": "Noord-Brabant",
                        "country": "NL"
                    },
                    "contactDetails": {
                        "telephone": "+31612345678",
                        "mobile": "+31612345678",
                        "email": "r.p.tester@test.roomerpms.com"
                    },
                    "preferredLanguage": "nl_NL"
                }
            ],
            "BaseRoomRequest": {
                "@arrivalDateTime": "2020-03-12T12:00:00",
                "@departureDateTime": "2020-03-13T10:00:00",
                "@externalRoomReference": "TEST-BKNG-0",
                "@mainGuestId": "idvalue0",
                "@roomType": "SGL",
                "@roomNotes": "Room note 0",
                "guest": "idvalue0",
                "ratePlan": {
                    "@ratePlan": "DR_0",
                    "@roomType": "SGL"
                },
                "remarks": {
                    "remark": "Room remark 1"
                },
                "Commission": {
                    "@amount": "5.75",
                    "@currency": "EUR"
                }
            },
            "remarks": {
                "remark": "Booking remark 0"
            },
            "channel": {
                "@code": "BDC",
                "@name": "Booking.com",
                "@location": "HOTEL",
                "CustomerProfileRef": "0000000024"
            },
            "PaymentGuarantee": {
                "CreditCard": {
                    "@cardHolderName": "R.P. Tester",
                    "@cardType": "VISA",
                    "@primaryAccountNumber": "411111******1111",
                    "verificationData": {
                        "expiryDate": "2022-05-31",
                        "CVC2": "***"
                    }
                }
            }
        };
    }
}