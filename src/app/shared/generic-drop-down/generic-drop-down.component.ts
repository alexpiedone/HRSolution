import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { environment } from '../../../environment/environment';
import { FormsModule } from '@angular/forms';
interface DropdownItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-generic-dropdown',
  templateUrl: './generic-drop-down.component.html',
  styleUrls: ['./generic-drop-down.component.css'],
  imports: [DropdownModule, FormsModule]
})
export class GenericDropdownComponent implements OnInit {
  @Input() entityName!: string; // Numele entității (ex: 'Countries', 'Categories')
  @Input() methodName: string = 'GetAll'; // Numele metodei (ex: 'GetAll', 'GetById')
  @Input() placeholder: string = 'Selectează...'; // Text placeholder opțional
  @Input() showClear: boolean = true; // Opțiune pentru a afișa butonul de clear

  items: SelectItem[] = [];
  selectedItem: SelectItem | undefined;
  @Input() selectedValue: number | string | undefined; // 👈 Input pentru valoarea inițială
  @Output() selectionChange = new EventEmitter<number | string>(); // 👈 Output pentru a emite valoarea selectată


  constructor(private http: HttpClient) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedValue'] && this.items.length > 0) {
      this.setInitialSelection();
    }
  }
  
  ngOnInit(): void {
    if (this.entityName) {
      this.loadDropdownData();
    } else {
    }
  }

  loadDropdownData(): void {
    const fullUrl = `${environment.apiUrl}/${this.entityName}/${this.methodName}`;
    this.http.get<DropdownItem[]>(fullUrl).subscribe({
      next: (data) => {
        this.items = data.map(item => ({ label: item.name, value: item.id }));
      },
      error: (error) => {
        console.error(`Eroare la încărcarea datelor pentru ${this.entityName}:`, error);
      }
    });
  }

  onChange(event: any): void {
  }

  setInitialSelection(): void {
    if (this.selectedValue !== undefined && this.items.length > 0) {
      this.selectedItem = this.items.find(item => item.value === this.selectedValue);
    } else {
      this.selectedItem = undefined;
    }
  }

}