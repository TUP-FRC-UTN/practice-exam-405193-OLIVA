import { Routes } from '@angular/router';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';

export const routes: Routes = [
    {path: '', component: OrderFormComponent},
    {path: 'create-order', component: OrderFormComponent},
    {path: 'orders', component: OrderListComponent},
];
