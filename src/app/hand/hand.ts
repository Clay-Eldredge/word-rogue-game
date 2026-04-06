import { Component, Input, OnInit} from '@angular/core';
import { tile, Tiles } from '../tiles';
import { TileIcon } from '../tile/tileIcon';
import { WordValidity } from '../words';
import { InfoModal } from "../info-modal/info-modal";

@Component({
  selector: 'app-hand',
  imports: [TileIcon, InfoModal],
  templateUrl: './hand.html',
  styleUrl: './hand.scss',
})
export class Hand implements OnInit {
  handTiles: tile[] = [];
  wordTiles: tile[] = [];
  unusedTiles: tile[] = [];
  
  modalX = 0;
  modalY = 0;
  selectedTile: tile | null = null;
  infoVisible = false;

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

  submitWord() {
    this.tilesService.submitWord(this.wordTiles).subscribe(validity => {
      if (validity === WordValidity.VALID) {
        this.handTiles = this.tilesService.getHand();
        this.unusedTiles = [...this.handTiles];
        this.wordTiles = [];
      }
    });
  }

  openModal(event: { x: number; y: number; tile: tile }) {
    this.modalX = event.x;
    this.modalY = event.y;
    this.selectedTile = event.tile;

    this.infoVisible = true;
  }

  @HostListener('document:click', ['$event'])
@HostListener('document:contextmenu', ['$event'])
handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (!target.closest('.modal')) {
    this.infoVisible = false;
  }
}
}
