import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';  // Adaugă acest import
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-pielist',
  imports: [CardModule, Checkbox, CommonModule, Button, FormsModule, RouterModule, Dialog],
  templateUrl: './pielist.component.html',
  styleUrl: './pielist.component.css'
})
export class PielistComponent {
  @Input() items: any[] = [];
  @Input() itemType: string = '';
  @Input() listTitle: string = '';
  displayDialog: boolean = false;
  selectedItem: any = null;

  constructor(private router: Router) { }
  markAsDone(item: any) {
    item.done = true;
  }


  goToPage(url: string) {
    this.router.navigate([url]);
  }

  dismissNotification(item: any) {
    item.isDismissed = true;
  }

  showDialog(item: any) {
    console.log('stirea este ',item);
    this.selectedItem = item;
    this.displayDialog = true;
  }
  
}
