import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DnbhubBrand } from '../../interfaces/brand/brand.interface';

@Component({
  selector: 'dnbhub-admin-brands',
  templateUrl: './admin-brands.component.html',
  styleUrls: ['./admin-brands.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubAdminBrandsComponent {
  @Input() public brands: DnbhubBrand[] | null = [];

  @Output() public readonly showCreateBrand = new EventEmitter<void>();

  @Output() public readonly showEditBrand = new EventEmitter<DnbhubBrand>();

  public createBrand() {
    this.showCreateBrand.emit();
  }

  public editBrand(brand: DnbhubBrand): void {
    this.showEditBrand.next(brand);
  }
}
