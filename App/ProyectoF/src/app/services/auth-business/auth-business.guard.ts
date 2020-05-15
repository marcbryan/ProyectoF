import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthBusinessService } from './auth-business.service';

@Injectable({
  providedIn: 'root'
})
export class AuthBusinessGuard implements CanActivate {
  constructor (public authService: AuthBusinessService, public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {  
    if (this.authService.isLoggedIn !== true) {
      return this.router.parseUrl('/negocios/login');
    }
    return true;
  }
}
