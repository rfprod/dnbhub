import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dnbhub-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubPlaylistsComponent implements AfterViewInit {
  @ViewChild('virtualScrollContainer') public virtualScrollContainer?: ElementRef<HTMLDivElement>;

  private readonly playerHeightSubject = new BehaviorSubject<string>('150px');

  public readonly playerHeight$ = this.playerHeightSubject.asObservable();

  public ngAfterViewInit() {
    const playerHeight =
      `${this.virtualScrollContainer?.nativeElement.clientHeight ?? 0}px` ??
      this.playerHeightSubject.value;
    this.playerHeightSubject.next(playerHeight);
  }
}
