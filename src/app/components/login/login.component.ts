import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
  ],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  userName: any;
  resetEmail: string = '';

  showForgotPassword: boolean = false;

  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
  }

  constructor(private authService: AuthService, private router: Router) {}

  loginWithGoogle() {
    this.authService.login('google');
  }

  async login(type: 'backend' | 'google', event: Event) {
    event.preventDefault();
    try {
      const user = await this.authService.login(
        type,
        this.email,
        this.password
      );

      this.userName =
        this.authService.getCurrentUser()?.displayName || 'Người dùng';
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Incorrect email or password!',
        showConfirmButton: false,
        timer: 1500,
      });
      this.errorMessage = 'Đăng nhập thất bại! Vui lòng thử lại.';
    }
  }
  // Forgot password
  async onResetPassword() {
    try {
      const message = await this.authService.resetPassword(this.resetEmail);
      Swal.fire(
        'Thành công!',
        message + '. Vui lòng kiểm tra email!',
        'success'
      );
      this.showForgotPassword = false;
    } catch (error) {
      Swal.fire('Lỗi!', 'Không thể gửi email đặt lại mật khẩu.', 'error');
    }
  }
}
