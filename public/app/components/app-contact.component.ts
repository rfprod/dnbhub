import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';
import { SendEmailService } from '../services/send-email.service';

import { TranslateService } from '../modules/translate/translate.service';

/**
 * Contact dialog.
 */
@Component({
	selector: 'app-contact',
	templateUrl: '/app/views/app-contact.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppContactDialog implements OnInit, OnDestroy {

	/**
	 * @param data Dialog data provided by parent controller
	 * @param dialogRef Dialog reference
	 * @param fb Form builder - user input procession
	 * @param emitter Event emitter service
	 * @param translateService Translate service - UI translation to predefined languages
	 * @param sendEmailService Send email service - sends user email to specified email address by calling cloud functions
	 * @param window Window reference
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<AppContactDialog>,
		private fb: FormBuilder,
		private emitter: EventEmitterService,
		private translateService: TranslateService,
		private sendEmailService: SendEmailService,
		@Inject('Window') private window: Window
	) {
		console.log('AppContactDialog constructor', this.data);
	}

	private subscriptions: any[] = [];

	/**
	 * Email form.
	 */
	public emailForm: FormGroup;

	/**
	 * Resets email form group.
	 */
	private resetEmailForm(): void {
		this.emailForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			name: ['', Validators.compose([Validators.required, Validators.pattern(/\w{2,}/)])],
			header: ['', Validators.compose([Validators.required, Validators.pattern(/\w{4,}/)])],
			message: ['', Validators.compose([Validators.required, Validators.pattern(/[\w\s_-]{50,}/)])],
			domain: [this.window.location.origin, Validators.compose([Validators.required, Validators.pattern(/.+/)])]
		});
	}

	/**
	 * Submits form.
	 */
	public submitForm(): void {
		if (this.emailForm.valid && !this.emailForm.pristine) {
			this.sendEmail()
				.catch((error: any) => {
					console.log('sendEmail, error', error);
				});
		}
	}

	/**
	 * UI feedback for user actions.
	 */
	public feedback: string;

	/**
	 * Dialog loading state.
	 */
	private loading: boolean = false;
	/**
	 * Use in templates to get loaded state.
	 */
	public loaded(): boolean {
		return !this.loading;
	}

	/**
	 * Starts progress.
	 */
	private startProgress(): void {
		this.loading = true;
	}
	/**
	 * Stops progress.
	 */
	private stopProgress(): void {
		this.loading = false;
	}

	/**
	 * Sends email.
	 */
	public sendEmail(): Promise<boolean> {
		const def = new CustomDeferredService<boolean>();
		this.emitter.emitProgressStartEvent();
		const formData: any = this.emailForm.value;
		this.sendEmailService.sendEmail(formData).subscribe(
			(data: any) => {
				console.log('sendEmail, data:', data);
				this.emitter.emitProgressStopEvent();
				def.resolve(true);
				this.feedback = this.translateService.instant('contact.result.success');
				setTimeout(() => {
					this.closeDialog();
				}, 1500);
			},
			(error: any) => {
				console.log('sendEmail, error', error);
				this.feedback = this.translateService.instant('contact.result.fail');
				this.emitter.emitProgressStopEvent();
				def.reject(false);
			},
			() => {
				console.log('sendEmail: done');
			}
		);
		return def.promise;
	}

	/**
	 * Closes dialog.
	 * @param [result] result returned to parent component
	 */
	private closeDialog(result?: any) {
		/*
		*	report result if it was commonly closed, or modified and closed, deleted,
		*	or optional use result is provided
		*	parent controller should listen to this event
		*/
		result = (result) ? result : 'closed';
		this.dialogRef.close(result);
	}

	/**
	 * Lifecycle hook called after component is initialized.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: AppContactDialog initialized');
		this.resetEmailForm();

		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('AppContactDialog consuming event:', event);
			if (event.progress) {
				if (event.progress === 'start') {
					console.log('AppContactDialog, starting progress');
					this.startProgress();
				} else if (event.progress === 'stop') {
					console.log('AppContactDialog, stopping progress');
					this.stopProgress();
				}
			}
		});
		this.subscriptions.push(sub);
	}
	/**
	 * Lifecycle hook called after component is destroyed.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppContactDialog destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
