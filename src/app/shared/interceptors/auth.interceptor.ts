
import { HttpInterceptorFn } from '@angular/common/http';
/**
 * HTTP interceptor that adds the Authorization header with a Bearer token to outgoing requests.
 * Skips requests directed to Cloudinary.
 *
 * @param req The outgoing HTTP request.
 * @param next The next handler in the HTTP request chain.
 */
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
