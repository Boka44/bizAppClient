import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	public currentUser : any = {};

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  // Retrieves user info from server after authentication, then updates stock array and favorites
  // array. Also updates favorites with current pricing info not reflected in database.
  // calling favorites first does cause a short delay when page is loaded, but is needed to reflect 
  // which button is active for each stock. 

  ngOnInit() {
  	this.userService.getCurrentUser().then(profile => this.currentUser = profile)
  		.catch(() => this.currentUser = {});
		this.userService.getUser().then(() => {
			return new Promise((resolve,reject) => {
				this.favorites = this.userService.updateFavorites()
				this.checkFav();
				resolve();
			}).then(() => {
				return new Promise((resolve,reject) => {
					this.userService.getStocks().then(() => {
						this.array = this.userService.stocksArray;
			  		this.checkFav();
			  		resolve()
					})
				}).then(() => {
					this.updateFavoritesPrice()	
				})
			})
		})
  		
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  // checks if selected stock is currently a favorite, otherwise adds to favorites and updates
  // database.

  addToFavorites(e: string) {
  	console.log(e)
  	let match = this.array.find((i) => {
	  		console.log(i.identifier)
	  	 return i.identifier == e;
	  	})
  	if(this.favorites.length == 0) {
  		this.favorites.push(match);
  	} else {
	  	let isFavorite = this.favorites.some((i) => {
	  		return i.identifier == match.identifier;
	  	})
	  	if(isFavorite) {
	  		console.log("Already a favorite!")
	  	} else {
	  		this.favorites.push(match);
	  	}
  	}
  	this.checkFav();
  	this.userService.updateUser(this.favorites);
  }

  // deletes selected stock from favorites and updates database

  deleteFavorite(e: number) {
  	let index = this.favorites.findIndex((i) => {
  		return i.identifier == e;
  	})
  	this.favorites.splice(index, 1);
  	this.checkFav();
  	this.userService.updateUser(this.favorites);
  }

  // toggles active dashboard from Show All and Show Favorites

  clickFav() {
  	this.showFavorites = true;
  	this.showAll = false;
  }

  clickAll() {
  	this.showFavorites = false
  	this.showAll = true;
  }

  // check used to update the stock array with the current favorites array so that 
  // the appropriate button, addToFavorites() or deleteFavorite(), is displayed per stock.

  checkFav() {
  	console.log("checkFav()")
  	this.array.forEach((j) => {
  		let isFavorite = this.favorites.some((i) => {
	  		return i.identifier == j.identifier;
	  		})	
  		if(isFavorite) {
  			j.isFav = true;
  		} else {
  			j.isFav = false;
  		}
  	})
  }

  // updates favorite price with current price not refelcted in previous database storage.

  updateFavoritesPrice() {
  	this.favorites.forEach((i) => {
  		let index = this.array.findIndex((j) => {
  		 	return i.identifier == j.identifier;
  		})
  		console.log(i)
  		console.log(index)
  		i.value = this.array[index].value;
  	})
  }

  showAll = true;
  showFavorites = false;

  favorites = [];
  array = [];
}
