import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { Order } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3002';

  // HTTP options mặc định
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  /** 🔹 Lấy tất cả đơn hàng (Admin) */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`)
      .pipe(
        tap(() => console.log('Fetched all orders')),
        catchError(this.handleError<Order[]>('getAllOrders', []))
      );
  }

  /** 🔹 Lấy danh sách đơn hàng của một khách hàng */
  getOrdersByCustomer(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}?Customer_id=${customerId}`)
      .pipe(
        tap(() => console.log(`Fetched orders for customer ID=${customerId}`)),
        catchError(this.handleError<Order[]>('getOrdersByCustomer', []))
      );
  }

  /** 🔹 Lấy chi tiết một đơn hàng */
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`)
      .pipe(
        tap(() => console.log(`Fetched order ID=${orderId}`)),
        catchError(this.handleError<Order>('getOrderById'))
      );
  }

  /** 🔹 Tạo đơn hàng mới (Khách hàng đặt hàng) */
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}`, order, this.httpOptions)
      .pipe(
        tap((newOrder: Order) => console.log(`Created order with TrackingNumber=${newOrder.TrackingNumber}`)),
        catchError(this.handleError<Order>('createOrder'))
      );
  }

  /** 🔹 Cập nhật đơn hàng (Admin cập nhật trạng thái, thông tin giao hàng, v.v.) */
  updateOrder(orderId: string, updatedOrder: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, updatedOrder, this.httpOptions)
      .pipe(
        tap(() => console.log(`Updated order ID=${orderId}`)),
        catchError(this.handleError<Order>('updateOrder'))
      );
  }

  /** 🔹 Xóa đơn hàng (Admin) */
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`, this.httpOptions)
      .pipe(
        tap(() => console.log(`Deleted order ID=${orderId}`)),
        catchError(this.handleError<any>('deleteOrder'))
      );
  }

  /** 🔹 Cập nhật trạng thái đơn hàng */
  updateOrderStatus(orderId: string, status: 'Cancelled' | 'In transit' | 'Delivered' | 'Completed' ): Observable<Order> {
    return this.updateOrder(orderId, { Status: status })
      .pipe(
        tap(() => console.log(`Updated status of order ID=${orderId} to ${status}`)),
        catchError(this.handleError<Order>('updateOrderStatus'))
      );
  }

  /** 🔹 Thêm sản phẩm vào đơn hàng */
  addProductToOrder(orderId: string, productId: string, quantity: number): Observable<Order> {
    return this.getOrderById(orderId).pipe(
      switchMap(order => {
        const updatedProducts = [...order.OrderProduct];
        const existingProduct = updatedProducts.find(p => p._id === productId);

        if (existingProduct) {
          existingProduct.Quantity += quantity;
        } else {
          updatedProducts.push({ _id: productId, Quantity: quantity });
        }

        return this.updateOrder(orderId, { OrderProduct: updatedProducts });
      }),
      tap(() => console.log(`Added product ID=${productId} to order ID=${orderId}`)),
      catchError(this.handleError<Order>('addProductToOrder'))
    );
  }

  /** 🔹 Xử lý lỗi */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
