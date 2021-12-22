import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog',
    template: `<h1 mat-dialog-title>Error</h1>
        <div mat-dialog-content><p>{{ data }}</p></div>`
})
export class DialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}