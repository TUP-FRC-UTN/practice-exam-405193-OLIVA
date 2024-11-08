import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  private readonly productService = inject(ProductService);

  productList: Product[] = [];

  orderForm: FormGroup = new FormGroup({
    customerName: new FormControl(),
    email: new FormControl(),
    products: new FormArray([])
  });

  ngOnInit(): void {
    this.obtainProducts();
  }

  get products(){
    return this.orderForm.controls['products'] as FormArray;
  }

  addProd(){
    const productForm = new FormGroup({
      productId: new FormControl(),
      quantity: new FormControl(),
      stock: new FormControl(),
      price: new FormControl()
    });

    this.products.push(productForm);
  }

  removeProd(i: number){
    this.products.removeAt(i);
  }

  obtainProducts(){
    this.productService.getProducts().subscribe({
      next: data => this.productList = data,
      error: e => console.log(e)
    });
  }
}
