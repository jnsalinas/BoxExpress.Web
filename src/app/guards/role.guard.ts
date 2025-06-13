// login.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as string[];
    const userRole = this.auth.role;

    if (expectedRoles && !expectedRoles.includes(userRole ?? '')) {
      // Redirige a un lugar seguro (dashboard, home, etc.)
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
