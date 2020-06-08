import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DnbhubFacebookService } from 'src/app/services/facebook/facebook.service';
import { DnbhubTwitterService } from 'src/app/services/twitter/twitter.service';

@UntilDestroy()
@Component({
  selector: 'dnbhub-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class DnbhubIndexComponent implements OnInit, AfterViewInit {
  constructor(
    private readonly media: MediaObserver,
    private readonly facebook: DnbhubFacebookService,
    private readonly twitter: DnbhubTwitterService,
  ) {}

  public ngOnInit(): void {
    let previousMqAlias = '';
    this.media
      .asObservable()
      .pipe(untilDestroyed(this))
      .subscribe((event: MediaChange[]) => {
        if (/(xs|sm)/.test(previousMqAlias) && /!(xs|sm)/.test(event[0].mqAlias)) {
          this.facebook.renderFacebookWidget();
        }
        previousMqAlias = event[0].mqAlias;
      });
  }

  public ngAfterViewInit(): void {
    this.facebook.renderFacebookWidget();
    this.twitter.renderTwitterWidget();
  }
}
