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

  // arrays defined and updated before sending to dashboard component.

  favoritesArray = [];
  stocksArray = [];

  // facebook and google login methods. Send data to server and stores the JWT token sent back
  // in local storage.

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

  // checks if user is logged in. Used in guards to allow access to dashboard component.

  isLoggedIn() {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(user => resolve(true)).catch(() => reject(false));
    });
  }

  // gets current user info from server to authenticate endpoints.

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      return this.http.get(`http://localhost:3000/authCheck`).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }

  // updates user favorites to server

  updateUser(array) {
  	return this.http.post(`http://localhost:3000/update`, {"favorites": array})
  		.subscribe((response) => {
  			console.log(response);
  			this.favoritesArray = array;
  		})
  }

  // gets current users favorites from server

  getUser() {
  	return new Promise((resolve, reject) => {
	  	return this.http.get(`http://localhost:3000/getUser`)
	  		.subscribe((response) => {
	  			this.favoritesArray = response["favorites"];
	  			resolve();
	  		}) 
	  })
  }

  // used to update favorites

  updateFavorites() {
  	return this.favoritesArray;
  }

  // used to get current stock info from server API.

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
