import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit{
  private readonly productService = inject(ProductService)

  orderList: Order[] = [];

  ngOnInit(): void {
    this.loadOrders();
    this.filterOrders();
  }

  // #region FILTRADO
  searchTerm = new FormControl('')

  filterOrders() {
    this.searchTerm.valueChanges.subscribe(search => {
      if(search === null || search === ''){
        this.loadOrders();
      }

      this.orderList = this.orderList.filter(order =>
        order.customerName.toLowerCase().includes(search?.toLowerCase() ?? '') ||
        order.email.toLowerCase().includes(search?.toLowerCase() ?? '')
      );
    });
  }
  // #endregion

  loadOrders(){
    this.productService.getOrders().subscribe({
      next: data => this.orderList = data,
      error: e => console.log(e)
    })
  }
}
