import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})

export class HeaderComponent {
  quantity: number = 0; // Tổng số lượng sản phẩm trong giỏ hàng
  displayedQuantity: string = '0';  // Biến hiển thị số lượng trên giao diện

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Lắng nghe sự kiện khi giỏ hàng thay đổi
    this.cartService.cartCountChanged.subscribe((count: number) => {
      this.quantity = count;  // Cập nhật số lượng giỏ hàng
      this.updateDisplayedQuantity();  // Cập nhật số lượng hiển thị
    });

    // Lấy số lượng giỏ hàng từ CartService khi component khởi tạo
    this.cartService.updateCartCount();  // Cập nhật giỏ hàng
  }

  // Cập nhật số lượng hiển thị (99+ nếu số lượng > 99)
  updateDisplayedQuantity(): void {
    if (this.quantity > 99) {
      this.displayedQuantity = '99+';  // Hiển thị 99+ nếu số lượng lớn hơn 99
    } else {
      this.displayedQuantity = this.quantity.toString();  // Hiển thị số lượng nếu nhỏ hơn hoặc bằng 99
    }
  }
}
