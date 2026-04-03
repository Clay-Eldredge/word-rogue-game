import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';

export enum WordValidity {
  VALID = 'VALID',
  TOO_SHORT = 'TOO_SHORT',
  NOT_FOUND = 'NOT_FOUND',
  INAPPROPRIATE = 'INAPPROPRIATE',
}

@Injectable({
  providedIn: 'root',
})
export class Words {
  baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  constructor(private http:HttpClient) {
    
  }

  public checkWord(word: string): Observable<WordValidity> {
    const url: string = this.baseUrl + word
    return this.http.get(url).pipe(
      map((data: any) => {
        if (word.length <= 2) {
          return WordValidity.TOO_SHORT;
        }
        if (!data) {
          return WordValidity.NOT_FOUND;
        }
        return WordValidity.VALID;
      }), catchError(() => of(WordValidity.NOT_FOUND))
    );
  }
}
