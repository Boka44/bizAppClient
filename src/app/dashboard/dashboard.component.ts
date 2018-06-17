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
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
