import { Component, OnInit } from '@angular/core';
import data from '../../assets/json/cards-data.json';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.page.html',
  styleUrls: ['./project-info.page.css'],
})
export class ProjectInfoPage implements OnInit {
  cards: [] = data;
  slides: any = [[]];

  constructor() {}

  chunk(arr: any, chunkSize:any) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  ngOnInit() {
    this.slides = this.chunk(this.cards, 3);
  }

}
