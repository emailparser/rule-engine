import {remove} from "remove-accents";
export default class GooglePlaces {


    public static async getPlaceIdForString(nameInput: string, cityInput: string){
        const str = remove(nameInput).replace(/-/g, " ").replace(/\s\s+/g, " ");
        const len = str.length;
        let city = cityInput ? cityInput : "";
        let curr = str;
        let i = 0;
        let id: string;
        if(city) city = ` ${city}`;

        while(i < len - 2 && id === undefined){
            let query: string;
            if(city) query = `${curr}${city}`;
            const strings = [curr, query];
            if(query === curr) strings.pop();

            for(const string of strings){
                
            }

            const lastIndex = curr.lastIndexOf(" ");
            curr = curr.substring(0, lastIndex);
            i++;
        }
    }
}