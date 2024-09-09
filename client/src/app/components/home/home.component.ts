import { AfterViewInit, Component, inject } from '@angular/core';
import { RenderNotificationService } from '../../services/render-notification.service';
import { HeroComponent } from "./hero/hero.component";
import { HomePokemonComponent } from "./home-pokemon/home-pokemon.component";
import { LatestSubmissionsComponent } from "./latest-submissions/latest-submissions.component";
import { JoinCommunityComponent } from "./join-community/join-community.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, HomePokemonComponent, LatestSubmissionsComponent, JoinCommunityComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit{
    private renderService = inject(RenderNotificationService)

    ngAfterViewInit(): void {
        this.setUpObserver()
        
    }

    private setUpObserver(): void{
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.05
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
            this.renderService.notifyElementRendered(entry.isIntersecting)
 
            })
        }, options)
        const observedElement = document.querySelector('.background-image');
        if (observedElement){
            observer.observe(observedElement)
        }
    }
}
