import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductItem } from '../types/productItem';
import { CustomPipePrice } from '../pipes/custom-price.pipe';
import { CustomNamePipe } from '../pipes/custom-name.pipe';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CustomPipePrice, NgIf, FormsModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent implements OnInit {
  product: ProductItem | undefined;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(productId).subscribe((data) => {
      this.product = data;
    });
  }

  changeQuantity(change: number) {
    if (this.quantity + change >= 1) {
      this.quantity += change;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      // Show success message
      alert(
        `${this.product.name} đã được thêm vào giỏ hàng (Số lượng: ${this.quantity})`
      );
    }
  }
}
