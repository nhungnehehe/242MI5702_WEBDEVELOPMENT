import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerComponent } from './customer/customer.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: "", redirectTo:"dashboard", pathMatch:"full"},
  { path: "admin-dashboard", component: DashboardComponent },
  { path: "admin-customer", component: CustomerComponent},
  { path: "admin-product", component: ProductComponent },
  { path: "admin-category", component: CategoryComponent},
  { path: "admin-order", component:OrderComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
