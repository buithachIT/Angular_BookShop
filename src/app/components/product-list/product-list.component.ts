import { Component, OnInit } from '@angular/core';
import { RouterLink} from '@angular/router';
import {ProductItem} from '../types/productItem';
import { NgFor,} from '@angular/common';
import { CustomPipePrice } from '../pipes/custom-price.pipe';
import { CustomNamePipe } from '../pipes/custom-name.pipe';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-product-list',
  imports: [
    NgFor, 
    CustomNamePipe,
    CustomPipePrice,
    RouterLink,
  FormsModule ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: ProductItem[] = [];
  filteredProducts: ProductItem[] = []; //Dữ liệu lọc
  currentPage = 1;
  itemsPerPage = 10;

  
  minPrice: number = 0;
  maxPrice: number = 999999999;
  sortOption: string = 'price_desc';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
  this.productService.getProducts().subscribe(data => {
    this.products = data;
    this.applyFilters();
  });
}

  applyFilters() {
  this.products = this.products.filter(p =>
    p.price >= this.minPrice && p.price <= this.maxPrice
  );
  this.sortProducts();
  this.changePage(1);
}

sortProducts() {
  if (this.sortOption === 'price_desc') {
    this.products.sort((a, b) => b.price - a.price);
  } else if (this.sortOption === 'price_insc') {
    this.products.sort((a, b) => a.price - b.price);
  }
}

onSortChange(event: any) {
  this.sortOption = event.target.value;
  this.sortProducts();
  this.changePage(1);
}

  
  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}