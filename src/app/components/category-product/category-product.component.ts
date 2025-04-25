import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductItem } from '../types/productItem';
import { CustomPipePrice } from '../pipes/custom-price.pipe';
import { CustomNamePipe } from '../pipes/custom-name.pipe';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-category-product',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    CustomPipePrice,
    CustomNamePipe
  ],
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.css']
})
export class CategoryProductComponent implements OnInit {
  productsByCategory: ProductItem[] = [];
  categoryName = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idCategory = Number(this.route.snapshot.paramMap.get('idcategory'));
    
    if (!isNaN(idCategory)) {
      this.productService.getProductsByCategory(idCategory).subscribe({
        next: (products) => {
          this.productsByCategory = products;
          this.categoryName = products.length > 0 ? products[0].category || 'Không xác định' : '';
        },
        error: (err) => {
          console.error('Lỗi khi lấy sản phẩm theo thể loại:', err);
        }
      });
    } else {
      console.warn('ID thể loại không hợp lệ:', idCategory);
    }
  }
}