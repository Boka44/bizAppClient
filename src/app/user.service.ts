import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare const FB:any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { 
  	FB.init({
  		appId: '303145383557662',
  		status: false,
  		cookie: false,
  		xfbml: false,
  		version: 'v2.8'
  	});
  }

   fbLogin() {    
   	return new Promise((resolve, reject) => {
		  FB.login(result => {
		  	console.log(result.authResponse.accessToken);
		    if (result.authResponse) {
		      return this.http.get(`http://localhost:3000/authFacebook/?access_token=${result.authResponse.accessToken}`, {headers: new HttpHeaders()
		        .set('Content-Type', 'application/json'), observe: 'response'})
		          .subscribe((response) => {
		          	console.log(response);
		            const token = response.headers.get('x-auth-token');
		            console.log(token)
		            if (token) {
		              localStorage.setItem('id_token', token);
		              console.log(localStorage)
		              resolve(response);
		            }
		          }) 
		           reject();
		    } else {
		   		reject();
		    }
		  })
		});
  }

  logout() {
    localStorage.removeItem('id_token');
    console.log('Logged out')
    console.log(localStorage);
  }

  isLoggedIn() {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(user => resolve(true)).catch(() => reject(false));
    });
  }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      return this.http.get(`http://localhost:3000/authCheck`).toPromise().then(response => {
        resolve(response.json());
      }).catch(() => reject());
    });
  }

}
