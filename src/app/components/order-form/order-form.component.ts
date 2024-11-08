import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Order, Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of, tap, timestamp } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  productList: Product[] = [];
  total: number = 0;
  discount: boolean = false;

  orderForm: FormGroup = new FormGroup({
    customerName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email], [this.emailOrderLimitValidator()]),
    products: new FormArray([], [Validators.required, this.uniqueProductValidator])
  });

  ngOnInit(): void {
    this.obtainProducts();
  }

  // VALIDACION SINCRONA PERSONALIZADA
  uniqueProductValidator(productsAarray: FormArray): ValidationErrors | null {
    const selectedProdIds = productsAarray.controls.map(control => control.get('productId')?.value as Number);
    const hasDuplicates = selectedProdIds.some((id, index) => selectedProdIds.indexOf(id) !== index);
    return hasDuplicates ? {duplicatedProduct: true} : null;
  }

  // VALIDACION ASINCRONICA PERSONALIZADA
  emailOrderLimitValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if(!control.value) {
        return of(null);
      }

      return this.productService.getOrdersByEmail(control.value).pipe(
        tap((orders) => {
          console.log(orders);
        }),
        map(orders => {
          const now = new Date();

          const recentOrders = orders.filter(order => {
            const orderDate = order.timestamp ? new Date(order.timestamp) : new Date();
            const diferenceInMilliseconds = now.getTime() - orderDate.getTime();
            const differenceInHours = diferenceInMilliseconds / (1000 * 60 * 60);
            return differenceInHours <= 24;
          });

          if (recentOrders.length >= 3) {
            return {errorPedido: true};
          }

          return null;
        }),
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      );
    }
  }

  //#region "PRODUCT ARRAY FORM"
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

      this.actualizarTotal();
    })

    productForm.get('quantity')?.valueChanges.subscribe(cantidad => {
      this.actualizarTotal();
    })

    this.products.push(productForm);
  }

  removeProd(i: number){
    this.products.removeAt(i);
    this.actualizarTotal();
  }
  //#endregion "PRODUCT ARRAY FORM"

  obtainProducts(){
    this.productService.getProducts().subscribe({
      next: data => this.productList = data,
      error: e => console.log(e)
    });
  }

  actualizarTotal(){
    let subtotal = 0;

    this.products.controls.forEach(control => {
      const cantidad = control.get('quantity')?.value || 0;
      const precio = control.get('price')?.value || 0;
      subtotal += precio * cantidad;
    })

    this.discount = subtotal >= 1000;

    this.total = this.discount ? Math.round((subtotal * 0.9 + Number.EPSILON) * 100) / 100 : subtotal;
  }

  saveOrder(){
    if(this.orderForm.valid){
      const formValues = this.orderForm.value;

      const orden: Order = {
        customerName: formValues.customerName,
        email: formValues.email,
        products: formValues.products,
        total: this.total,
        orderCode: this.generateOrderCode(formValues.customerName, formValues.email),
        timestamp: new Date().toISOString()
      }

      this.productService.postOrder(orden).subscribe({
        next: () => {
          this.router.navigate(['/orders']);
        }
      });
    }
  }

  generateOrderCode(name: string, email: string){
    return name.substring(0, 1).toLocaleUpperCase() + email.slice(-4) + new Date().toJSON();
  }
}
