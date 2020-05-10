import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { TwitterService } from 'src/app/services/twitter/twitter.service';

@UntilDestroy()
@Component({
  selector: 'app-index',
  templateUrl: './app-index.component.html',
  styleUrls: ['./app-index.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppIndexComponent implements OnInit, AfterViewInit {
  constructor(
    private readonly media: MediaObserver,
    private readonly facebook: FacebookService,
    private readonly twitter: TwitterService,
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
