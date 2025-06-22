
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwic3ViIjoic3RyaW5nQGVtYWlsLmNvbSIsImlhdCI6MTc1MDU5NTYxMiwiZXhwIjoxNzUxMjAwNDEyfQ.5fjaXLNfe9JO5HXm08lU6_T85NuqhEIV5QCHXJ4haLY';
  console.log('[authInterceptorFn] Agregando token:', token);

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
