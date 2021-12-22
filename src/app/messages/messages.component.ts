import { Directive, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogComponent } from './dialog.component';
import { MessagesService } from './messages.service';

@Directive({
  selector: 'app-messages',
})
export class MessagesComponent implements OnInit, OnDestroy {
  messagesSubscription!: Subscription;
  constructor(
    private messageService: MessagesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.messagesSubscription = this.messageService.messages$.subscribe((message) => {
      if (message) {
        this.dialog.open(DialogComponent, { data: message });
      }
    })
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

}
