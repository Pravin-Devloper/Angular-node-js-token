import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('jwtToken')) {

        // logged in so return true
        const token = localStorage.getItem('jwtToken');
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);

        const expirationDate = helper.getTokenExpirationDate(token);
        const isExpired = helper.isTokenExpired(token);
        // console.log(JSON.stringify(decodedToken) + decodedToken.username + '---------' + expirationDate + '------' + isExpired);
         return !isExpired;

    }

    // not logged in so redirect to login page
    this.router.navigate(['/']);
    return false;
}
}
