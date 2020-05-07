export class Event {
    _id: String;
    name: String;
    description: String;
    price: number;
    starts: String;
    ends: String;
    location: String;
    ticketsForSale: number;
    tickets_available: number;
    img_url: String;
    business_id: String;
    status: number;

    constructor(
        _id: String,
        name: String,
        description: String,
        price: number,
        starts: String,
        ends: String,
        location: String,
        ticketsForSale: number,
        tickets_available: number,
        img_url: String,
        business_id: String,
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
}