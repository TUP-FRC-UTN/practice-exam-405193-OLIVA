import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent {
  orderForm: FormGroup = new FormGroup({
    customerName: new FormControl(),
    email: new FormControl(),
    products: new FormArray([])
  });

  get products(){
    return this.orderForm.controls['products'] as FormArray;
  }

  addProd(){
    const productForm = new FormGroup({
      
    })
  }
}
