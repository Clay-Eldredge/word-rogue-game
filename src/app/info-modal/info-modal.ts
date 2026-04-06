import { Component, Input } from '@angular/core';
import { tile } from '../tiles';

@Component({
  selector: 'app-info-modal',
  imports: [],
  templateUrl: './info-modal.html',
  styleUrl: './info-modal.scss',
})
export class InfoModal {
  @Input() x = 0;
  @Input() y = 0;
  @Input() visible = false;
  @Input() tile: tile|null = null;

  
}
