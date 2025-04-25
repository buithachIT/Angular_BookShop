import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomPipePrice } from '../pipes/custom-price.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CustomPipePrice],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems!: Observable<CartItem[]>;
  totalPrice!: Observable<number>;

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', Validators.required],
      zipCode: [
        '',
        [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)],
      ],
      paymentMethod: ['credit-card', Validators.required],
    });
  }

  ngOnInit(): void {
    // Kiểm tra cart trống
    this.cartService.currentCart$.subscribe((items) => {
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    this.cartItems = this.cartService.currentCart$;
    this.totalPrice = this.cartService.currentCart$.pipe(
      map((items) =>
        items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      )
    );
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const order = {
      ...this.checkoutForm.value,
      userId: this.authService.getCurrentUserId(),
      items: this.cartService.currentCartSubject.value,
      total: this.cartService.getCartCount(),
      date: new Date().toISOString(),
    };

    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        localStorage.setItem('lastOrderId', response.orderId);
        this.router.navigate(['/order-confirmation', response.orderId]);
      },
      error: (err) => {
        console.error('Order submission failed:', err);
      },
    });
  }

  get f() {
    return this.checkoutForm.controls;
  }
}
