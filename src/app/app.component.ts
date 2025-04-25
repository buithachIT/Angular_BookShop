import { routes } from './app.routes';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isUserMenuOpen = false;
  isSearchOpen = false;

  //Check login at user icon
  constructor(private router: Router, private authService: AuthService) {}

  handleUserClick() {
    console.log('Check access_token>>', localStorage.getItem('access_token'));

    if (localStorage.getItem('access_token')) {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    } else {
      this.router.navigate(['/login']);
    }
  }
  userName: string = ''; // Khởi tạo biến để tránh lỗi

  ngOnInit() {
    this.userName =
      this.authService.getCurrentUser()?.displayName || 'Người dùng';
  }
  //check login at cart
  handleCartClick() {
    console.log('Check access_token>>', localStorage.getItem('access_token'));

    if (localStorage.getItem('access_token')) {
      // nếu login rồi thì xử lý tại đây...
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please login!',
        showConfirmButton: false,
        timer: 2500,
      });
      this.router.navigate(['/login']);
    }
  }

  //logout
  handleLogOut() {
    const access_token = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: 'Successful!',
      showConfirmButton: false,
      timer: 1500,
    });
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.router.navigate(['/home']);
  }
  //Search
  searchQuery = '';
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  search() {
    console.log('Tìm kiếm:', this.searchQuery);
    // Xử lý tìm kiếm sản phẩm
  }
  title = 'ecommerce-app';
}
