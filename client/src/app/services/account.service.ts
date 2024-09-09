import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { RegisterRequest } from '../models/registerRequest';
import { User } from '../models/user';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/loginRequest';
import { ChangePasswordRequest } from '../models/changePasswordRequest';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    public currentUser = signal<User | null>(null);
    private http = inject(HttpClient);
    private baseUrl = environment.baseAPIUrl + 'user/';

    public login(loginRequest: LoginRequest): Observable<User> {
        return this.http.post<User>(this.baseUrl + 'login', loginRequest).pipe(
            tap(user => {
                this.setCurrentUser(user)
            })
        )
    }

    public register(registerRequest: RegisterRequest): Observable<User> {
        return this.http.post<User>(this.baseUrl + 'register', registerRequest).pipe(
            tap((user) => {
                this.setCurrentUser(user);
            })
        )
    }

    public changePassword(changePasswordRequest: ChangePasswordRequest): Observable<User> {
        return this.http.post<User>(this.baseUrl + 'change-password', changePasswordRequest).pipe(
            tap(user => {
                this.setCurrentUser(user);
            })
        )
    }

    public logOut(): void {
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }

    public setCurrentUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
    }

}
