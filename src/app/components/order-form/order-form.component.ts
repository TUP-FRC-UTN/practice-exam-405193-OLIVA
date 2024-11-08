import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  private readonly productService = inject(ProductService);

  productList: Product[] = [];

  orderForm: FormGroup = new FormGroup({
    customerName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    products: new FormArray([], [Validators.required])
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
      quantity: new FormControl(1),
      stock: new FormControl(0),
      price: new FormControl(0)
    });

    productForm.get('productId')?.valueChanges.subscribe(id => {
      const prod = this.productList.find(p => p.id === id);
      if(prod){
        //Actualiza los valores de los controles
        productForm.patchValue({
          price: prod.price,
          stock: prod.stock
        })

        // Agrego validador al control de cantidad
        productForm.get('quantity')?.addValidators([Validators.required, Validators.min(1), Validators.max(prod.stock)]);
      }
    })

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
