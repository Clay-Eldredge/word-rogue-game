import { Injectable } from '@angular/core';
import { Words, WordValidity } from './words';
import { Observable } from 'rxjs';

export enum Tag {
  STONE = 'STONE',
  
}
export interface tile {
  letter: string;
  letters: string[];
  points: number;
  tags?: Tag[];
}

export const baseTiles: { [key: string]: tile } = {
  a: { letter: 'a', letters: ['a'], points: 1 },
  e: { letter: 'e', letters: ['e'], points: 1 },
  i: { letter: 'i', letters: ['i'], points: 1 },
  l: { letter: 'l', letters: ['l'], points: 1 },
  n: { letter: 'n', letters: ['n'], points: 1 },
  o: { letter: 'o', letters: ['o'], points: 1 },
  r: { letter: 'r', letters: ['r'], points: 1 },
  s: { letter: 's', letters: ['s'], points: 1 },
  t: { letter: 't', letters: ['t'], points: 1 },
  u: { letter: 'u', letters: ['u'], points: 1 },

  d: { letter: 'd', letters: ['d'], points: 2 },
  g: { letter: 'g', letters: ['g'], points: 2 },

  b: { letter: 'b', letters: ['b'], points: 3 },
  c: { letter: 'c', letters: ['c'], points: 3 },
  m: { letter: 'm', letters: ['m'], points: 3 },
  p: { letter: 'p', letters: ['p'], points: 3 },

  f: { letter: 'f', letters: ['f'], points: 4 },
  h: { letter: 'h', letters: ['h'], points: 4 },
  v: { letter: 'v', letters: ['v'], points: 4 },
  w: { letter: 'w', letters: ['w'], points: 4 },
  y: { letter: 'y', letters: ['y'], points: 4 },

  k: { letter: 'k', letters: ['k'], points: 5 },

  j: { letter: 'j', letters: ['j'], points: 8 },
  x: { letter: 'x', letters: ['x'], points: 8 },

  q: { letter: 'q', letters: ['q'], points: 10 },
  z: { letter: 'z', letters: ['z'], points: 10 },

  wild: {
    letter: '*', 
    letters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 
    points: 1,
  },
  vowel: {
    letter: '*', 
    letters: ['a','e','i','o','u','y'], 
    points: 1,
  },
  consonant: {
    letter: '*', 
    letters: ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'], 
    points: 1,
  },
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

@Injectable({
  providedIn: 'root',
})
export class Tiles {
  private pile: tile[] = [];
  private hand: tile[] = [];
  private discard: tile[] =  [];

  public getPile(): tile[] {
    return [...this.pile];
  }

  public getHand(): tile[] {
    return [...this.hand];
  }

  public getDiscard(): tile[] {
    return [...this.discard];
  }

  constructor(private wordsService: Words) {
    
  }

  public createPile(tileDistribution: {[key: string]: number} = {
    a: 4, b: 2, c: 2, d: 2, e: 5, f: 2, g: 2, h: 2, i: 4, j: 1, k: 1, l: 2,
    m: 2, n: 3, o: 4, p: 2, q: 1, r: 3, s: 2, t: 3, u: 3, v: 2, w: 2, x: 1, y: 2, z: 1
  }) {
    for (const key in tileDistribution) {
      const tile = baseTiles[key];
      const count = tileDistribution[key];
      for (let i = 0; i < count; i++) {
        this.pile.push({...tile});
      }
    }
    this.pile = shuffle(this.pile);
  }

  public containsVowel(array: string[]) {
    return array.some(s => {
      return s === 'a' 
        || s === 'e'
        || s === 'i'
        || s === 'o'
        || s === 'u'
        || s === 'y'
    })
  }

  public containsConsonant(array: string[]) {
    return array.some(s => {
      return !(s === 'a' 
        || s === 'e'
        || s === 'i'
        || s === 'o'
        || s === 'u')
    })
  }

  public drawTop(isVowel: boolean = false, mustMatch: boolean = false) {
    if (this.pile.length <= 0) {
      throw Error("Pile is empty");
    } else {
      var depth: number = 0;
      var topTile: tile = this.pile.at(depth)!;

      while (mustMatch 
        && (
          (isVowel && !this.containsVowel(topTile.letters))
          || (!isVowel && !this.containsConsonant(topTile.letters))
        )
        && depth < this.pile.length) {
        depth = depth + 1;
        topTile = this.pile.at(depth)!;
      }

      const tileDrawn: tile = this.pile.splice(depth,1)[0];
      this.hand.push(tileDrawn);
    }
  }

  public discardTile(tileDiscarded: tile) {
    const indexToRemove: number = this.hand.findIndex(t => {return t === tileDiscarded})
    const tileRemoved: tile = this.hand.splice(indexToRemove, 1)[0];
    this.discard.push(tileRemoved);
  }

  public drawStartingHand() {
    this.drawTop(true, true);
    this.drawTop(true, true);
    this.drawTop(false, true);
    this.drawTop(false, true);
    this.drawTop(false, true);
    this.drawTop();
    this.drawTop();
  }

  public addTileToHand(tile: tile) {
    this.hand.push(tile);
  }

  public submitWord(wordTiles: tile[]): Observable<WordValidity> {
    const word = wordTiles.map(t => t.letter).join('');

    return new Observable(observer => {
      this.wordsService.checkWord(word).subscribe(validity => {

        if (validity === WordValidity.VALID) {
          wordTiles.forEach(t => this.discardTile(t));

          const tilesNeeded = 7 - this.hand.length;
          for (let i = 0; i < tilesNeeded; i++) {
            this.drawTop();
          }
        }

        observer.next(validity);
        observer.complete();
      });
    });
  }
}
