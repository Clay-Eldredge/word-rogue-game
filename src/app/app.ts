import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Words } from './words';
import { Tiles } from './tiles';
import { Hand } from "./hand/hand";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Hand],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('word-game');

  constructor(private wordsService: Words, private tilesService: Tiles) {}

  ngOnInit() {
    this.tilesService.createPile();
    this.tilesService.drawStartingHand();
    console.log(this.tilesService.getHand());
  }
}
