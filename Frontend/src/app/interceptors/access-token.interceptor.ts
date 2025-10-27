import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken()?.replace(/"/g, '');

  if (!token || req.url.includes('/auth')) {
    return next(req);
  }

  const headers = {
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  };

  const clonedRequest = req.clone(headers);

  return next(clonedRequest);
};
