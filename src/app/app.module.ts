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

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

const appRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
        canActivate: [AnonymousGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3000']
      }
    })
  ],
  providers: [
    AuthGuard,
    AnonymousGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
