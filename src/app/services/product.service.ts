import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order, Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private url = "http://localhost:3000/";

  getProducts(){
    return this.http.get<Product[]>(`${this.url}products`);
  }

  getOrders() {
    return this.http.get<Order[]>(`${this.url}orders`);
  }

  getOrdersByEmail(email: string) {
    return this.http.get<Order[]>(`${this.url}orders?email=${email}`);
  }

  postOrder(orden: Order){
    return this.http.post(`${this.url}orders`, {orden})
  }
}
