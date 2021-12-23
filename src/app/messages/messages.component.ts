import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogComponent } from './dialog.component';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  @Input() mode: string = 'notification';
  showMessage: boolean = false;
  message$!: Observable<string | null>;

  constructor(
    public messageService: MessagesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.message$ = this.messageService.messages$.pipe(
      tap((message) => {
        this.showMessage = !!message && this.mode == 'notification';
        if(!!message && this.mode === 'dialog') {
          this.dialog.open(DialogComponent, { data: message });
        }
      })
    )
  }

  ngOnDestroy() {}

  onClose() {
    this.showMessage = false;
  }

}
