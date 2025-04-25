import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { ProductItem } from '../components/types/productItem';

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  currentCartSubject = new BehaviorSubject<CartItem[]>([]);
  currentCart$ = this.currentCartSubject.asObservable();
  cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadInitialCart();
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.handleUserLogin();
      } else {
        this.switchToGuestCart();
      }
    });
  }

  private handleUserLogin(): void {
    const guestCart = this.loadCart('cart_guest');
    const userCartKey = `cart_${this.authService.getCurrentUserId()}`;
    const existingUserCart = this.loadCart(userCartKey);

    if (existingUserCart.length === 0 && guestCart.length > 0) {
      this.mergeGuestCartIntoUserCart(guestCart, userCartKey);
    } else {
      this.switchCart();
    }
    this.updateCartCount();
  }

  private mergeGuestCartIntoUserCart(
    guestCart: CartItem[],
    userCartKey: string
  ): void {
    localStorage.setItem(userCartKey, JSON.stringify(guestCart));
    localStorage.removeItem('cart_guest');
    this.currentCartSubject.next(guestCart);
    this.updateCartCount();
  }

  private switchToGuestCart(): void {
    this.switchCart();
    this.updateCartCount();
  }

  private getCartKey(): string {
    const userId = this.authService.getCurrentUserId();
    return userId ? `cart_${userId}` : 'cart_guest';
  }

  private loadInitialCart(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.authService.currentUserSubject.next(JSON.parse(savedUser));
    }
    this.switchCart();
    this.updateCartCount();
  }

  private loadCart(cartKey: string): CartItem[] {
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : [];
  }

  private switchCart(): void {
    const cartKey = this.getCartKey();
    this.currentCartSubject.next(this.loadCart(cartKey));
  }

  private saveCart(): void {
    const cartKey = this.getCartKey();
    localStorage.setItem(
      cartKey,
      JSON.stringify(this.currentCartSubject.value)
    );
    this.updateCartCount();
  }

  private updateCartCount(): void {
    const count = this.currentCartSubject.value.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.cartCountSubject.next(count);
  }

  addToCart(product: ProductItem, quantity: number = 1): void {
    const currentItems = this.currentCartSubject.value;
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.currentCartSubject.next([...currentItems]);
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.currentCartSubject.value.filter(
      (item) => item.product.id !== productId
    );
    this.currentCartSubject.next(updatedItems);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = [...this.currentCartSubject.value];
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.currentCartSubject.next(items);
      this.saveCart();
    }
  }

  clearCart(): void {
    this.currentCartSubject.next([]);
    localStorage.removeItem(this.getCartKey());
    this.updateCartCount();
  }

  getCartCount(): number {
    return this.cartCountSubject.value;
  }
}
