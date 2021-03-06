import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IBrandForm } from '../../interfaces';
import { DnbhubBrand } from '../../interfaces/brand/brand.interface';
import { DnbhubFirebaseService } from '../../state/firebase/firebase.service';
import { IRegExpPatterns } from '../../utils/regexp.util';

@Component({
  selector: 'dnbhub-brand-dialog',
  templateUrl: './brand-dialog.component.html',
  styleUrls: ['./brand-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubBrandDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { brand: DnbhubBrand; regexp: IRegExpPatterns['links']; minNameLength: number },
    private readonly dialogRef: MatDialogRef<DnbhubBrandDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly firebase: DnbhubFirebaseService,
  ) {}

  public readonly form = this.fb.group({
    name: [
      this.data.brand.name ?? '',
      Validators.compose([Validators.required, Validators.minLength(this.data.minNameLength)]),
    ],
    bandcamp: [
      this.data.brand.bandcamp ?? '',
      Validators.compose([Validators.required, Validators.pattern(this.data.regexp.bandcamp)]),
    ],
    facebook: [
      this.data.brand.facebook ?? '',
      Validators.compose([Validators.required, Validators.pattern(this.data.regexp.facebook)]),
    ],
    instagram: [
      this.data.brand.instagram ?? '',
      Validators.compose([Validators.required, Validators.pattern(this.data.regexp.instagram)]),
    ],
    soundcloud: [
      this.data.brand.soundcloud ?? '',
      Validators.compose([Validators.required, Validators.pattern(this.data.regexp.soundcloud)]),
    ],
    twitter: [
      this.data.brand.twitter ?? '',
      Validators.compose([Validators.required, Validators.pattern(this.data.regexp.twitter)]),
    ],
    website: [
      this.data.brand.website ?? '',
      Validators.compose([Validators.required, Validators.pattern(this.data.regexp.website)]),
    ],
    youtube: [
      this.data.brand.youtube ?? '',
      Validators.compose([Validators.required, Validators.pattern(this.data.regexp.youtube)]),
    ],
  }) as IBrandForm;

  public submitForm(): void {
    if (this.form.valid) {
      if (Boolean(this.data.brand.key)) {
        void this.createBrand();
      } else {
        void this.updateBrand();
      }
    }
  }

  public updateBrand() {
    if (this.form.valid && !this.form.pristine) {
      // TODO: send update request
      const dbKey = this.data.brand.key;
      const newBrandValues: DnbhubBrand = this.form.value;
      return this.firebase
        .getList<DnbhubBrand>('brands')
        .update(dbKey ?? '', newBrandValues)
        .then(() => {
          console.warn(`brand id ${dbKey} was successfully deleted`);
          this.closeDialog();
        })
        .catch((error: string) => {
          console.warn('updateBrand, error', error);
        });
    }
  }

  public createBrand() {
    if (this.form.valid && !this.form.pristine) {
      const formData = this.form.value;
      return this.firebase
        .getList<DnbhubBrand>('brands')
        .set(this.form.controls.name.value, formData)
        .then(() => {
          console.warn('brand values set');
          this.closeDialog();
        })
        .catch(error => error);
    }
  }

  public deleteBrand() {
    if (this.form.valid && !this.form.pristine) {
      const dbKey = this.data.brand.key;
      return this.firebase
        .getListItem<DnbhubBrand>(`brands/${dbKey}`)
        .remove()
        .then(() => {
          console.warn(`brand id ${dbKey} was successfully deleted`);
          this.closeDialog();
        })
        .catch((error: string) => {
          console.warn('deleteBrand, error', error);
        });
    }
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
