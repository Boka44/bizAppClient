import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
    AuthService,
    GoogleLoginProvider
} from 'angular-6-social-login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private socialAuthService: AuthService, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }
  
  // sign in for google and facebook login options.

  public socialSignIn(socialPlatform : string) {
    let socialPlatformProvider;
    if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } 
    
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform+" sign in data : " , userData);
        this.userService.googleLogin(userData).then(() => {
        	console.log("User has been logged in");
  			this.router.navigate(['/dashboard']);
        });          
      }
    );
  }

  fbLogin() {
  	this.userService.fbLogin().then(() => {
  		console.log("User has been logged in");
  		this.router.navigate(['/dashboard']);
  	});
  }

}
