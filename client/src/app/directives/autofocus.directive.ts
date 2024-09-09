import { AfterContentInit, Directive, ElementRef, input } from "@angular/core";

@Directive({
    selector: "[appAutofocus]",
    standalone: true
})

export class AutofocusDirective implements AfterContentInit {
    public appAutofocus = input<boolean>(false);

    public constructor(private el: ElementRef) { }

    public ngAfterContentInit() {
        if (this.appAutofocus()) {
            setTimeout(() => {
                this.el.nativeElement.focus();
            }, 100);
        }
    }
}