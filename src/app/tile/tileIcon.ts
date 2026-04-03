import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tile } from '../tiles';

@Component({
  selector: 'app-tile-icon',
  imports: [],
  templateUrl: './tileIcon.html',
  styleUrl: './tileIcon.scss',
})
export class TileIcon {
  @Input() tileData: tile = {letter: 'a', letters: ['a'], points: 1};

  @Output() leftclick = new EventEmitter<tile>();
  @Output() rightClick = new EventEmitter<tile>();

  private holdTimeout: any;
  private holdDuration = 500;

  onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.holdTimeout = setTimeout(() => {
        this.rightClick.emit(this.tileData);
        this.holdTimeout = null;
      }, this.holdDuration);
    }
  }

  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      if (this.holdTimeout) {
        clearTimeout(this.holdTimeout);
        this.leftclick.emit(this.tileData);
      }
      this.holdTimeout = null;
    }
  }

  onMouseLeave() {
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout);
      this.holdTimeout = null;
    }
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.rightClick.emit(this.tileData);
  }
}
