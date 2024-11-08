import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private url = "http://localhost:3000/";

  getProducts(){
    return this.http.get<Product[]>(`${this.url}products`);
  }
}
