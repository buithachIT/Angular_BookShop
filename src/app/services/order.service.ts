import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private storageKey = 'orders';

  constructor() {}

  createOrder(
    orderData: any
  ): Observable<{ success: boolean; orderId: string }> {
    return new Observable((observer) => {
      setTimeout(() => {
        const userId = orderData.userId || 'GUEST';
        const randomCode = Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase();
        const orderId = `ORD-${userId}-${randomCode}`;

        const fullOrder = {
          ...orderData,
          orderId,
          date: new Date().toISOString(),
        };

        this.saveOrderToLocalStorage(fullOrder);

        observer.next({
          success: true,
          orderId,
        });
        observer.complete();
      }, 1000);
    });
  }

  private saveOrderToLocalStorage(order: any): void {
    const existingOrders = this.getAllOrders();
    existingOrders.push(order);
    localStorage.setItem(this.storageKey, JSON.stringify(existingOrders));
  }

  getAllOrders(): any[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  getOrderById(orderId: string): any | undefined {
    return this.getAllOrders().find((order) => order.orderId === orderId);
  }

  clearAllOrders(): void {
    localStorage.removeItem(this.storageKey);
  }
}
