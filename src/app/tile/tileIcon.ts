import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { tile } from '../tiles';
import { InfoModal } from "../info-modal/info-modal";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tile-icon',
  imports: [InfoModal, CommonModule],
  templateUrl: './tileIcon.html',
  styleUrl: './tileIcon.scss',
})
export class TileIcon {
  @Input() tileData: tile = { letter: 'a', letters: ['a'], points: 1 };

  @Output() leftclick = new EventEmitter<tile>();
  @Output() openInfo = new EventEmitter<{ x: number; y: number; tile: tile }>();

  private holdTimeout: any;
  private holdDuration = 400;
  private justOpenedFromHold = false;
  public isAlt = false;
  public infoX = 0;
  public infoY = 0;

  onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      const element = event.currentTarget as HTMLElement;

      this.holdTimeout = setTimeout(() => {
        this.openFromElement(element, event);
        this.justOpenedFromHold = true;
        this.holdTimeout = null;
      }, this.holdDuration);
    }
  }

  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      if (this.holdTimeout) {
        clearTimeout(this.holdTimeout);
        this.leftclick.emit(this.tileData);
        event.stopPropagation();
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

  openFromElement(element: HTMLElement, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const rect = element.getBoundingClientRect();

    this.openInfo.emit({
      x: rect.left,
      y: rect.bottom,
      tile: this.tileData
    });
  }

  onRightClick(event: MouseEvent) {
    this.openFromElement(event.currentTarget as HTMLElement, event);
  }
}
