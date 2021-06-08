import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { DnbhubTwitterService } from 'src/app/services/twitter/twitter.service';

@UntilDestroy()
@Component({
  selector: 'dnbhub-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubIndexComponent implements AfterViewInit, OnDestroy {
  @ViewChild('virtualScrollContainer') public virtualScrollContainer?: ElementRef<HTMLDivElement>;

  public readonly sections = [
    {
      title: 'Playlists',
      subtitle: 'Playlists collection.',
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
      description: 'Dnbhub project details.',
      link: '/about',
    },
  ];

  private readonly playerHeightSubject = new BehaviorSubject<string>('150px');

  public readonly playerHeight$ = this.playerHeightSubject.asObservable();

  constructor(private readonly twitter: DnbhubTwitterService) {}

  public ngAfterViewInit(): void {
    this.twitter.initTwitterJsSDK();

    const playerHeight =
      `${this.virtualScrollContainer?.nativeElement.clientHeight ?? 0}px` ??
      this.playerHeightSubject.value;
    this.playerHeightSubject.next(playerHeight);
  }

  public ngOnDestroy(): void {
    this.twitter.removeTwitterJsSDK();
  }
}
