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

  checkLogin(): boolean {
  	if(localStorage.length === 1) {
  		if(this.userService.isLoggedIn()) {
  			this.router.navigate(['dashboard']);
  			return true;
  		} else {
  			this.router.navigate(['']);
  			return false;
  		}
  	} else {
  		this.router.navigate(['']);
  		return false;
  	} 
  }
  // checkLogin(): Promise<boolean> {
  // 	return new Promise((resolve, reject) => {
  // 		this.userService.isLoggedIn().then(() => {
  // 			resolve(true);
  // 		}).catch(() => {
  // 			this.router.navigate(['']);
  // 			reject(false);
  // 		})
  // 	})
  // }
}

