import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductItem } from '../components/types/productItem';

const apiUrl = 'https://68060a97ca467c15be6ae6e0.mockapi.io/ecommerce/ProductItem'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  // Lấy danh sách sản phẩm
  getProducts(): Observable<ProductItem[]> {
    return this.http.get<ProductItem[]>(apiUrl);  // Gọi API để lấy danh sách sản phẩm
  }

  // Lấy sản phẩm theo id
  getProductById(id: number): Observable<ProductItem | undefined> {
    return this.http.get<ProductItem>(`${apiUrl}/${id}`);  // Lấy sản phẩm theo ID từ API
  }

  // Lấy sản phẩm theo category
  getProductsByCategory(idcategory: number): Observable<ProductItem[]> {
    return this.http.get<ProductItem[]>(`${apiUrl}?idcategory=${idcategory}`);  // Lọc theo category
  }
}
