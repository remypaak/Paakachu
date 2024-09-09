import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { BurgerMenuComponent } from "./burger-menu/burger-menu.component";
import { FooterComponent } from "./footer/footer.component";
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, BurgerMenuComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  private accountService = inject(AccountService);  

  ngOnInit(): void {
    this.setCurrentUser();

  }

  setCurrentUser(): void{
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
