import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DnbhubTwitterService } from 'src/app/services/twitter/twitter.service';

@UntilDestroy()
@Component({
  selector: 'dnbhub-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubIndexComponent implements AfterViewInit {
  constructor(private readonly twitter: DnbhubTwitterService) {}

  public ngAfterViewInit(): void {
    this.twitter.renderTwitterWidget();
  }
}
