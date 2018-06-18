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

  ngOnInit() {
  	this.userService.getCurrentUser().then(profile => this.currentUser = profile)
  		.catch(() => this.currentUser = {});
		this.userService.getStocks().then(() => {
			this.array = this.userService.stocksArray;
		})
		this.userService.getUser().then(() => {
			this.favorites = this.userService.updateFavorites();
  		console.log(this.favorites)
  		this.checkFav();
		})
  		
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

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

  deleteFavorite(e: number) {
  	let index = this.favorites.findIndex((i) => {
  		return i.identifier == e;
  	})
  	this.favorites.splice(index, 1);
  	this.checkFav();
  	this.userService.updateUser(this.favorites);
  }

  clickFav() {
  	this.showFavorites = true;
  	this.showAll = false;
  }

  clickAll() {
  	this.showFavorites = false
  	this.showAll = true;
  }

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
  	// this.favorites = this.currentUser.favorites;

  }

  showAll = true;
  showFavorites = false;

  favorites = [];
  test = 'Test is complete!';
  // array = [
  // 	{
  // 		id: 1,
  // 		test: 'stock 1',
  // 		num: 3.8,
  // 		isFav: false
  // 	},
  // 	{
  // 		id: 2,
  // 		test: 'stock 2',
  // 		num: 45.87,
  // 		isFav: false
  // 	},
  // 	{
  // 		id: 3,
  // 		test: 'stock 3',
  // 		num: 17,
  // 		isFav: false
  // 	},
  // 	{
  // 		id: 4,
  // 		test: 'stock 4',
  // 		num: 1.47,
  // 		isFav: false
  // 	},
  // 	{
  // 		id: 5,
  // 		test: 'stock 5',
  // 		num: 6,
  // 		isFav: false
  // 	}
  // ]
  array = [];
}
