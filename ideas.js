/*
// EXAMPLE: regex pattern, an object in Mongo
RegexPattern {
        pattern: "\d{1,2}\.\w{3\.\d{3 \d{1,2}:\d{2}",
        type: dateFormat,
        description: "31-12-2015 23:59",
        subPatterns: {
                key: "val",
                foo: "bar",
                day: "\d{1,2}"
        }
}

--------------------------------------------

class Parser;

Parser class needs data and parseConfig

parseConfig is a key / value object

like { start, end, names, isAmendment  }

a parseConfig key can only be selected from a set of "allowed keys" defined by EmailParser

a value to each key is a "recipe" to suck out the correct value (explained below)

Parser class iterates through each key and it's recipe and outputs an object (Reservation)
with same keys as the config and the value retrieived from the email data according to that keys recipe
in the parseConfig

// EXAMPLE: config -> reservation
{ start: Recipe, end: Recipe ... } -> { start: Date, start: Date  ... }

An recipe has the the following properties
	* instructions
	* parameters
	* retrieve type // boolean, string, arrray of strings
	* can be nested


Interface Recipe{
	instruction      // any of the following PATTERN, STRING_BETWEEN, STRING_AFTER, STRING_BEFORE, EXACT_PHRASE, REGEX_STRING
	parameters: {    // not fixed, required params depend on instructions... examples include
		start: string, // for STRING_BEETWEEN, STRING_AFTER etc
		end: string // for STRING_BEFORE, STRING_BETWEEN
		index: number // to select match number i out of an array of matches
	}
	retrieveType
	sub // short for subrecipes
}

*/


// Example for a parseconfig for one agency

const config = {
    /**
	 * there will be designated method to handle dates
	 */
    start: {
        retrieveType: "date",
        instruction: "PATTERN",
        parameters: {
            pattern: "507f1f77bcf86cd799439011",
            index: 0
        }
    },
    end: {
        retrieveType: Date,
        instruction: "PATTERN",
        parameters: {
            pattern: "507f1f77bcf86cd799439011",
            index: 0
        }
    },
    /**
	 * In this case it would use the parameters to retrieve the value
	 */
    bookingRef: {
        retrieveType: String,
        instruction: "STRING_AFTER",
        parameters: {
            start: "confirmation #",
            multiline: false
        }
    },
    /**
	 * would return true only if amended appears in text
	 * the word "amended" is chosen by random and would only
	 * be chosen if said agency had "amended" in amendment mails
	 */
    isModification: {
        retrieveType: Boolean,
        instruction: "EXACT_PHRASE",
        parameters: {
            phrase: "amended"
        }
    },

    /**
	 * best representation of rooms is an arrray
	 * of objects where each object has
	 * name of guest and roomType
	 *
	 * starts by getting the relevant string where
	 * info about guests resides in the booking by
	 * finding all text between "rooming list" and
	 * "tour guide"
	 *
	 * it will recursively iterate through
	 * the retrieved value by changing it
	 * according to the subrecipe
	 */

    rooms: {
        retrieveType: String,
        instructions: "c",
        parameters: {
            start: "rooming list",
            end: "tour guide",
            multiline: true
        }, 

        /**
		 * a subrecipe is called on the string to modify 
		 * it.. in this case splitting it by a new line
		 */

        sub: {                         // a sub contains info on how to manipulate the retrieved Value
            retrieveType: [],          
            instructions: "SPLIT_BY",
            parameters: {
                splitter: "\r"
            },

            /**
			* a subrecipe is called on each element in the array 
			*/

            sub: {                     // on array a sub will be done forEach for each array Element
                retrieveType: {}, 
				

                /**
				* a subrecipe is called to generate roomType, guest on the object
				*/     

                sub: {                 // on object sub is an object of recipies for each key
                    roomType: {
                        retrieveType: String,
                        instructions: "STRING_BEFORE",
                        parameters: {
                            end: ":"
                        }
                    },
                    guest: {
                        retrieveType: String,
                        instructions: "STRING_AFTER",
                        parameters: {
                            start: ":"
                        }
                    }
                }
            }
        }
    }
};