import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { flatMap, first, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private baseUrl: string = 'http://localhost:51595/api/product/getproducts';

  private productUrl: string = 'http://localhost:51595/api/product/addproduct';

  private deleteUrl: string = 'http://localhost:51595/api/product/deleteproduct/';

  private updateUrl: string = 'http://localhost:51595/api/product/updateproduct/';

  private product$: Observable<Product[]>;

  getProducts(): Observable<Product[]> {
    if (!this.product$) {
      this.product$ = this.http
        .get<Product[]>(this.baseUrl)
        .pipe(shareReplay());
    }

    // if products cache exists return it
    return this.product$;
  }

  // Get Product by its ID
  getProductById(id: number): Observable<Product> {
    return this.getProducts().pipe(
      flatMap((result) => result),
      first((product) => product.productId == id)
    );
  }

  // Insert the Product
  insertProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.productUrl, newProduct);
  }

  // Update the Product

  updateProduct(id: number, editProduct: Product): Observable<Product> {
    return this.http.put<Product>(this.updateUrl + id, editProduct);
  }

  // Delete Product

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.deleteUrl + id);
  }

  // Clear Cache
  clearCache() {
    this.product$ = null;
  }
}
