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

  onSignIn(googleUser) {
	  var profile = googleUser.getBasicProfile();
	  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	  console.log('Name: ' + profile.getName());
	  console.log('Image URL: ' + profile.getImageUrl());
	  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	}

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
