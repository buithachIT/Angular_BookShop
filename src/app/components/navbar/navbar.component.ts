import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isUserMenuOpen = false;
  isSearchOpen = false;
  userName: string = 'Người dùng';
  cartItemCount = 0;
  private userSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.userName = this.authService.getCurrentUserName();
    });
    this.cartService.cartCount$.subscribe((count) => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  handleUserClick() {
    if (localStorage.getItem('access_token')) {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    } else {
      this.router.navigate(['/login']);
    }
  }

  handleCartClick() {
    if (!localStorage.getItem('access_token')) {
      Swal.fire({
        icon: 'error',
        title: 'Vui lòng đăng nhập!',
        text: 'Bạn cần đăng nhập để xem giỏ hàng',
        timer: 2500,
      });
      this.router.navigate(['/login']);
    } else if (this.authService.getCurrentUser()) {
      this.router.navigate(['/cart']); // Navigate to cart page
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/cart' },
      });
    }
  }

  handleLogOut() {
    this.authService.logout();
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  searchQuery = '';
  search() {
    console.log('Tìm kiếm:', this.searchQuery);
  }
}
