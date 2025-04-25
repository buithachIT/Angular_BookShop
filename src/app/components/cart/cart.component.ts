// cart.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CustomPipePrice } from '../pipes/custom-price.pipe';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CustomPipePrice, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  constructor(public cartService: CartService) {}

  get cartItems$() {
    return this.cartService.currentCart$;
  }

  get totalPrice$() {
    return this.cartService.currentCart$.pipe(
      map((items) => {
        const total = items.reduce(
          (sum, item) => sum + (item.product?.price || 0) * item.quantity,
          0
        );
        return isNaN(total) ? 0 : total;
      })
    );
  }

  incrementQuantity(item: CartItem): void {
    if (item?.product?.id && item.quantity) {
      this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item?.product?.id && item.quantity && item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  removeItem(item: CartItem): void {
    if (item?.product?.id) {
      this.cartService.removeFromCart(item.product.id);
    }
  }
}
