import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Words } from './words';
import { TileClass, Tiles, TileTag, TileTrait } from './tiles';
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
    //this.tilesService.drawStartingHand();
    this.tilesService.addTileToHand(
      { letter: 'a', letters: ['a'], points: 1, class: TileClass.STONE }
    )
    this.tilesService.addTileToHand(
      { letter: 'a', letters: ['a'], points: 1, class: TileClass.FIRE }
    )
    this.tilesService.addTileToHand(
      { letter: 'a', letters: ['a'], points: 1, trait: TileTrait.DUPLICATING }
    )
    this.tilesService.addTileToHand(
      { letter: 'a', letters: ['a'], points: 1, tags: [TileTag.DOUBLE], trait: TileTrait.PH }
    )
    console.log(this.tilesService.getHand());
  }
}
