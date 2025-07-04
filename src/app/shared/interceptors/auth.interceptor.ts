
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const isCloudinary = req.url.includes('https://api.cloudinary.com/');

    if (token && !isCloudinary) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
