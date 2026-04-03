import { Component, Input, OnInit} from '@angular/core';
import { tile, Tiles } from '../tiles';
import { TileIcon } from '../tile/tileIcon';

@Component({
  selector: 'app-hand',
  imports: [TileIcon],
  templateUrl: './hand.html',
  styleUrl: './hand.scss',
})
export class Hand implements OnInit {
  handTiles: tile[] = [];
  wordTiles: tile[] = [];
  unusedTiles: tile[] = [];
  
  constructor(private tilesService: Tiles) {

  }

  ngOnInit() {
    this.handTiles = this.tilesService.getHand();
    this.unusedTiles = this.unusedTiles = [...this.handTiles];
  }

  addTileToWord(tile: tile) {
    const indexToRemove: number = this.unusedTiles.findIndex(t => {return t === tile});
    if (indexToRemove == -1) {console.error('Cannot add tile that doesnt exist'); return;}
    const tileToAdd: tile = this.unusedTiles.splice(indexToRemove, 1)[0];
    this.wordTiles.push(tileToAdd);
  }

  removeTileFromWord(tile: tile) {
    const indexToRemove: number = this.wordTiles.findIndex(t => {return t === tile});
    if (indexToRemove == -1) {console.error('Cannot remove tile that doesnt exist'); return;}
    const tileToAdd: tile = this.wordTiles.splice(indexToRemove, 1)[0];
    this.unusedTiles.push(tileToAdd);
  }

  onTileRightClick(tile: tile) {
    console.log(tile, "Right click");
  }
}
