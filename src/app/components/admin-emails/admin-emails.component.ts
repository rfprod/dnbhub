import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { IEmailMessage } from '../../interfaces/admin/email.interface';

@Component({
  selector: 'dnbhub-admin-emails',
  templateUrl: './admin-emails.component.html',
  styleUrls: ['./admin-emails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubAdminEmailsComponent {
  @Input() public emails: IEmailMessage[] | null = [];

  @Output() public readonly messageDeleted = new EventEmitter<IEmailMessage>();

  @Output() public readonly showContent = new EventEmitter<IEmailMessage>();

  public deleteMessage(message: IEmailMessage) {
    this.messageDeleted.emit(message);
  }

  public showMessageContent(message: IEmailMessage): void {
    this.showContent.emit(message);
  }
}
