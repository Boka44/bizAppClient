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

  favoritesArray = [];
  stocksArray = [];

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
		            if (token) {
		              localStorage.setItem('id_token', token);
		              console.log(localStorage)
		              this.favoritesArray = response.body['favorites'];
		              resolve(response);
		            }
		          }) 
		           
		    } else {
		   		reject();
		    }
		  })
		});
  }

  googleLogin(userData) {
  	return new Promise((resolve, reject) => {
  		if(userData.token) {
  			return this.http.post(`http://localhost:3000/authGoogle`, {'id_token': userData.idToken, 'name': userData.name , headers: new HttpHeaders()
		        .set('Content-Type', 'application/json')}, {observe: 'response'})
  						.subscribe((response) => {
  							console.log(response)
  							const token = response.headers.get('x-auth-token');
		            if (token) {
		              localStorage.setItem('id_token', token);
		              console.log(localStorage)
		              this.favoritesArray = response.body['favorites'];
		              resolve(response);
		            }
  						})
  		} else {
  			reject();
  		}
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
        resolve(response);
      }).catch(() => reject());
    });
  }

  updateUser(array) {
  	return this.http.post(`http://localhost:3000/update`, {"favorites": array})
  		.subscribe((response) => {
  			console.log(response);
  			this.favoritesArray = array;
  		})
  }

  getUser() {
  	return new Promise((resolve, reject) => {
	  	return this.http.get(`http://localhost:3000/getUser`)
	  		.subscribe((response) => {
	  			this.favoritesArray = response["favorites"];
	  			resolve();
	  		}) 
	  })
  }

  updateFavorites() {
  	return this.favoritesArray;
  }

  getStocks() {
  	return new Promise((resolve, reject) => {
  		return this.http.get(`http://localhost:3000/finance`)
  			.subscribe((response) => {
  				this.stocksArray = response['data'];
  				console.log(this.stocksArray)
  				resolve();
  			})
  	})
  }

}
