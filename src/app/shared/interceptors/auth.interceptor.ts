
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwic3ViIjoiZW1haWwxMjNAZ21haWwuY29tIiwiaWF0IjoxNzUwNjA1MjI1LCJleHAiOjE3NTEyMTAwMjV9.LqMPXK0PdNTkjbs3l9Pgi_b-skD7OPbEZVNB7BuNu-M';

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
