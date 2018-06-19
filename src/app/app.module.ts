import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserService } from './user.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { AnonymousGuard } from './anonymous.guard';
import { AuthGuard } from './auth.guard';
import { AppRoutingModule } from './app.routing.module';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from "angular-6-social-login";

export function tokenGetter() {
  return localStorage.getItem('id_token');
}
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("67283599540-mrctmvvfuesruronp0p4vaahofueg6td")
        }
      ]
  );
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    SocialLoginModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3000'],
        authScheme: ''
      }
    })
  ],
  providers: [
  {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  },
    AuthGuard,
    AnonymousGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
