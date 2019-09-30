# Functional Requirements & implementation details

## A Hotel booking
### Dates
Hotel bookings usually contain a check-in date and check-out date. These are typically dates, with out time. It is important to note that some agencies might only specify a check-in date and length of stay. Email parser must thus be able to handle specified start & dates and also a start date & stay length.

### Individual vs. group reservations
Group reservations usually share the samae reservation ID.

### Names
It is not uncommon for agencies to send names for all adult guests staying in the same room

### Room types
A individual reservation is always assigned to a specified room type. Room types are unique per hotel. That is each hotel has many room types. A double room at Hotel Keflavik is not the same as a double room at Hotel Berg.

Group reservations typically contain varying room types.

### Room type and name examples
New booking: 2 Twin + 4 Single
* 1 twin: mr/mrs A
* 2 twin: mr/mrs B
* 3 single: mr C
* 4 single: ms D
* 5 single: mr E
* 6 single: ms F

The only data that is different per room in a group reservation is the name, and the room type

### Possible Problems with room types and names

### Reservation comments
Some reservations might provide reservation comments.

## Possible structure for reservation
The reservation could be represented in the following format **during** parsing

```
date fromDate;
date toDate;
[ string: string[] ] rooms; 
number price;

example:

{
    fromDate: new Date(),
    toDate: new Date(),
    rooms: {
        twin: [
            "mr/mrs A",
            "mr/mrs B"
        ],
        single: [
            "mr C",
            "ms D",
            "mr E",
            "ms F"
        ]
    },
    price: 123,
    currency: 320
}
```