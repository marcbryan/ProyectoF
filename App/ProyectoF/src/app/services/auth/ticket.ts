import * as moment from 'moment';
moment.locale('es');

export class Ticket {
    code: string;
    event_name: string;
    price: number;
    starts: string;
    ends: string;
    location: string;
    qty: number;
    bought_at: String;
    img_url: string;

    constructor(
        code: string,
        event_name: string,
        price: number,
        starts: string,
        ends: string,
        location: string,
        qty: number,
        bought_at: String,
        img_url: string
    ) {
        this.code = code;
        this.event_name = event_name;
        this.price = price;
        this.starts = starts;
        this.ends = ends;
        this.location = location;
        this.qty = qty;
        this.bought_at = bought_at;
        this.img_url = img_url;
    }

    getDate(date, index): string {
        return date.split(' ')[index];
    }

    ended(): boolean {
        let formated = moment(this.ends, 'DD/MM/YYYY HH:mm');       
        return formated < moment();
    }

    get date() {
        let starts = moment(this.starts, 'DD/MM/YYYY HH:mm');
        let date = starts.format('LLLL').split(' ');
        date.pop();
        let str_date = date.join(' ');
        str_date = str_date.substring(0, 1).toUpperCase() + str_date.substring(1);
        return str_date;
    }

    get schedule() {
        let starts = moment(this.starts, 'DD/MM/YYYY HH:mm');
        let ends = moment(this.ends, 'DD/MM/YYYY HH:mm');
        return starts.format('HH:mm')+' - '+ends.format('HH:mm');
    }
}