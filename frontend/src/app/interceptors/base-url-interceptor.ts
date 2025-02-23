import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private readonly baseUrl = 'http://localhost:9000/'; // Set your base URL here

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const apiReq = req.clone({
      url: this.baseUrl + req.url // Prepend the base URL
    });
    return next.handle(apiReq);
  }
}
