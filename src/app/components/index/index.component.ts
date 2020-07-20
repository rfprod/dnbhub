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
  public readonly sections = [
    {
      title: 'Playlists',
      subtitle: 'Playlists collection',
      description: 'A collection of playlists',
      link: '/playlists',
    },
    {
      title: 'Blog',
      subtitle: 'Blog posts',
      description: 'Featured releases.',
      link: '/blog',
    },
    {
      title: 'About',
      subtitle: 'About the project',
      description: 'Dnbhub project details',
      link: '/about',
    },
  ];

  constructor(private readonly twitter: DnbhubTwitterService) {}

  public ngAfterViewInit(): void {
    this.twitter.initTwitterJsSDK();
    this.twitter.renderTwitterWidget();
  }
}
