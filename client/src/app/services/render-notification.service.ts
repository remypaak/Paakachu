import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RenderNotificationService {
    private elementRederedSource = new BehaviorSubject<boolean>(false);
    public elementRendered$ = this.elementRederedSource.asObservable();

  public notifyElementRendered(isRendered: boolean): void{
    this.elementRederedSource.next(isRendered);
  }
}
