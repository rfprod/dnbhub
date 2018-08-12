import { Directive, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Emits spinner stop event when iframe content is loaded.
 */
@Directive({
	selector: '[contentloaded]'
})
export class IframeContentLoadedDirective implements OnInit {

	/**
	 * @param el Element reference
	 */
	constructor(
		private el: ElementRef
	) {}

	@Input('contentloaded') public contentLoaded: boolean = true;

	@Output('loadedcallback') public loadedCallback: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Emits loaded event.
	 */
	private emitLoadedEvent(): void {
		this.loadedCallback.emit(true);
	}

	/**
	 * Lifecycle hook called after directive is initialized.
	 */
	public ngOnInit(): void {
		this.el.nativeElement.onload = () => {
			// console.log('this.el', this.el);
			this.emitLoadedEvent();
		};
	}

}
