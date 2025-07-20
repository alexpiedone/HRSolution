// src/app/shared/generic-drop-down/generic-drop-down.component.ts
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { environment } from '../../../environment/environment';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; 

interface DropdownItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-generic-dropdown',
  templateUrl: './generic-drop-down.component.html',
  styleUrls: ['./generic-drop-down.component.css'],
  standalone: true,
  imports: [DropdownModule, CommonModule, ReactiveFormsModule] // 👈 FOLOSIM ReactiveFormsModule acum
})
export class GenericDropdownComponent implements OnInit, OnChanges {
  @Input() entityName!: string;
  @Input() methodName: string = 'GetAll';
  @Input() placeholder: string = 'Selectează...';
  @Input() showClear: boolean = true;

  items: SelectItem[] = [];
  
  @Input() control!: FormControl; 

  @Output() selectionChange = new EventEmitter<number | string | null>();

  constructor(private http: HttpClient) { } 

  ngOnInit(): void {
    if (this.entityName) {
      this.loadDropdownData();
    } else {
      console.warn('GenericDropdownComponent: entityName is not set.');
    }
    // Debug: Ascultăm schimbările de valoare ale controlului
    this.control.valueChanges.subscribe(value => {
      console.log(`DEBUG GenericDropdownComponent (${this.entityName}): FormControl value changed:`, value);
    });
  }

  // ngOnChanges devine mai simplu, deoarece FormControl-ul gestionează binding-ul
  ngOnChanges(changes: SimpleChanges): void {
      if (changes['control']) {
          console.log(`DEBUG GenericDropdownComponent (${this.entityName}): @Input control changed.`);
      }
      // Nu mai avem nevoie să gestionăm 'selectedValue' aici
  }

  loadDropdownData(): void {
    const fullUrl = `${environment.apiUrl}/${this.entityName}/${this.methodName}`;
    console.log(`DEBUG GenericDropdownComponent (${this.entityName}): Loading data from: ${fullUrl}`);
    this.http.get<DropdownItem[]>(fullUrl).subscribe({
      next: (data) => {
        this.items = data.map(item => ({ label: item.name, value: item.id }));
        console.log(`DEBUG GenericDropdownComponent (${this.entityName}): Items loaded:`, this.items);
        console.log(`DEBUG GenericDropdownComponent (${this.entityName}): Type of first item.value:`, typeof this.items[0]?.value);
        
        // PrimeNG cu formControlName ar trebui să sincronizeze automat
        // valoarea din control cu lista de items, odată ce ambele sunt disponibile.
        // Nu mai e nevoie de setTimeout sau setInitialSelection explicit.
      },
      error: (error) => {
        console.error(`Eroare la încărcarea datelor pentru ${this.entityName}:`, error);
      }
    });
  }

  // Acest handler de evenimente ar trebui să fie activat doar dacă este nevoie de logică suplimentară
  // P-dropdown cu formControlName actualizează direct controlul.
  onDropdownChange(event: any): void {
    // PrimeNG p-dropdown cu optionValue="value" emite direct valoarea (ID-ul)
    // FormControl-ul este deja actualizat de p-dropdown, așa că emit doar către părinte.
    this.selectionChange.emit(event.value);
    console.log(`DEBUG GenericDropdownComponent (${this.entityName}): Dropdown value changed by user. New value:`, event.value);
  }

  // Eliminăm setInitialSelection() și compareFn()
}