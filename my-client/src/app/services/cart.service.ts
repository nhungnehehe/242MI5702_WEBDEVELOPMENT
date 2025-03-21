import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CartItem } from '../interfaces/cart';
import { BuyNowItem } from '../interfaces/buynow';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3002';
  cartCountChanged = new EventEmitter<number>(); // EventEmitter để thông báo số lượng giỏ hàng thay đổi
  private buyNowItems: CartItem[] = [];
  constructor(private http: HttpClient) {

  }

   // Lấy danh sách sản phẩm trong giỏ hàng
   getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.baseUrl}/cart`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(productId: string, quantity: number): Observable<CartItem[]> {
    return this.http.post<CartItem[]>(
      `${this.baseUrl}/cart`,
      { productId, quantity },
      { withCredentials: true }
    ).pipe(
      tap((cartItems: CartItem[]) => this.emitCartCount(cartItems)),
      catchError(this.handleError)
    );
  }

  getBuyNowItems(): Observable<BuyNowItem[]> {
    return this.http.get<BuyNowItem[]>(`${this.baseUrl}/buynow`, { withCredentials: true }).pipe(
      // tap((buyNowItems) => this.emitCartCount(buyNowItems)),
      catchError(this.handleError)
    );
  }
  buyNow(productId: string, quantity: number): Observable<BuyNowItem[]> {
    return this.http.post<BuyNowItem[]>(
      `${this.baseUrl}/buynow`,
      { productId, quantity },
      { withCredentials: true }
    ).pipe(
      tap((buyNowItems) => {
        // Cập nhật lại BuyNowItems sau khi thêm sản phẩm
        this.buyNowItems = [];
        this.buyNowItems = buyNowItems;
      }),
      catchError(this.handleError)
    );
  }
  

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem(productId: string, quantity: number): Observable<CartItem[]> {
    return this.http.put<CartItem[]>(`${this.baseUrl}/cart`, { productId, quantity }, { withCredentials: true })
      .pipe(
        tap(cartItems => this.emitCartCount(cartItems)), // Phát sự kiện cập nhật giỏ hàng
        catchError(this.handleError)
      );
  }

  // Xóa một sản phẩm khỏi giỏ hàng
  removeCartItem(productId: string): Observable<CartItem[]> {
    return this.http.delete<CartItem[]>(`${this.baseUrl}/cart/${productId}`, { withCredentials: true })
      .pipe(
        tap(cartItems => this.emitCartCount(cartItems)), // Phát sự kiện khi xóa sản phẩm
        catchError(this.handleError)
      );
  }

 // Xóa toàn bộ giỏ hàng (KHÔNG phát sự kiện)
  removeAllCart(): Observable<CartItem[]> {
    return this.http.delete<CartItem[]>(`${this.baseUrl}/cart`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }


  // Cập nhật tổng số lượng giỏ hàng
  updateCartCount(): void {
    this.getCartItems().subscribe({
      next: (cartItems) => this.emitCartCount(cartItems),
      error: (err) => console.error('Error updating cart count:', err),
    });
  }

  // Phát sự kiện cập nhật số lượng giỏ hàng
  private emitCartCount(cartItems: CartItem[]): void {
    const totalCount = cartItems.reduce((total, item) => total + (item.cartQuantity || 0), 0);
    console.log('Cart updated, total items:', totalCount); // Log 
    this.cartCountChanged.emit(totalCount);
  }

  // Hàm xử lý lỗi
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Lỗi client
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Lỗi  server
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }
}