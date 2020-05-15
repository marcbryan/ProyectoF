import * as moment from 'moment';
export class Event {
    _id: string;
    name: string;
    description: string;
    price: number;
    starts: string;
    ends: string;
    location: string;
    ticketsForSale: number;
    tickets_available: number;
    img_url: string;
    business_id: string;
    status: number;

    constructor(
        _id: string,
        name: string,
        description: string,
        price: number,
        starts: string,
        ends: string,
        location: string,
        ticketsForSale: number,
        tickets_available: number,
        img_url: string,
        business_id: string,
        status: number
    ) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.starts = starts;
        this.ends = ends;
        this.location = location;
        this.ticketsForSale = ticketsForSale;
        this.tickets_available = tickets_available;
        this.img_url = img_url;
        this.business_id = business_id;
        this.status = status;
    }

    ticketsSold(): number {
        return this.ticketsForSale - this.tickets_available;
    }

    revenue(): number {
        return this.ticketsSold() * this.price;
    }

    getDate(date, index): string {
        return date.split(' ')[index];
    }

    ended(): boolean {
        let formated = moment(this.ends, 'DD/MM/YYYY HH:mm');       
        return formated < moment();
    }
}