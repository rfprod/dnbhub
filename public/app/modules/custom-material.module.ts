import { NgModule } from '@angular/core';
import {
	// form controls
	MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,
	// navigation
	MatMenuModule, MatSidenavModule, MatToolbarModule,
	// layout
	MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
	// buttons and indicators
	MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
	// popups and modals
	MatDialogModule, MatTooltipModule, MatSnackBarModule,
	// data table
	MatTableModule, MatSortModule, MatPaginatorModule,
	// misc
	MatOptionModule, MatRippleModule,
	// divider
	MatDividerModule,
	// icons
	MatIconRegistry,
	// tree
	MatTreeModule

} from '@angular/material';

import { OverlayModule } from '@angular/cdk/overlay';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
	/*
	*	note:
	*	it is ok not to use forRoot() here to achieve single depencendy injection tree for the MatIconRegistry provider,
	*	so that all instances of it are the same, because it should be used only once in the app module to register
	*	all font class aliases.
	*
	*	forRoot is used like so when declared:
	*
	*	export class SharedModule {
	*	  static forRoot(): ModuleWithProviders {
	*	    return {
	*	      ngModule: SharedModule,
	*	      providers: [CounterService]
	*	    };
	*	  }
	*	}
	*
	* and then imported in the parent module like:
	*
	*	SharedModule.forRoot()
	*
	*/
	providers: [ MatIconRegistry ],
	imports: [
		// form controls
		MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatMomentDateModule, MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,
		// navigation
		MatMenuModule, MatSidenavModule, MatToolbarModule,
		// layout
		MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
		// buttons and indicators
		MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
		// popups and modals
		MatDialogModule, MatTooltipModule, MatSnackBarModule,
		// data table
		MatTableModule, MatSortModule, MatPaginatorModule,
		// misc
		MatOptionModule, MatRippleModule,
		// divider
		MatDividerModule,
		// cdk
		OverlayModule,
		// tree
		MatTreeModule
	],
	exports: [
		// form controls
		MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatMomentDateModule, MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,
		// navigation
		MatMenuModule, MatSidenavModule, MatToolbarModule,
		// layout
		MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
		// buttons and indicators
		MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
		// popups and modals
		MatDialogModule, MatTooltipModule, MatSnackBarModule,
		// data table
		MatTableModule, MatSortModule, MatPaginatorModule,
		// misc
		MatOptionModule, MatRippleModule,
		// divider
		MatDividerModule,
		// cdk
		OverlayModule,
		// tree
		MatTreeModule
	]
})
export class CustomMaterialModule {}
