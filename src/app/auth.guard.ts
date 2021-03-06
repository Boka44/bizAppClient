import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	
	constructor(private userService: UserService, private router: Router) {};

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin();
  }

  checkLogin(): Promise<boolean> {
  	return new Promise((resolve, reject) => {
  		this.userService.isLoggedIn().then(() => {
  			resolve(true);
  		}).catch(() => {
  			this.router.navigate(['']);
  			reject(false);
  		})
  	})
  }
}

