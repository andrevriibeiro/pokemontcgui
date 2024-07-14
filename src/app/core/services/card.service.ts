import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Pagination } from '../../shared/models/pagination.model';
import { Card } from 'src/app/shared/models/cards.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private readonly baseUrl = environment.baseURL;
  private readonly select = 'id,name,images,supertype,types';

  constructor(private http: HttpClient) { }

  getCards(pagination: Pagination<Card>, name?: string): Observable<Pagination<Card>> { 
    let url = `${this.baseUrl}/cards?page=${pagination.page}&pageSize=${pagination.pageSize}&select=${this.select}`;
    
    if (name && name.trim() !== '') {
      url += `&q=name:${name}`;
    }
  
    return this.http.get<Pagination<Card>>(url);
  }
  
}
