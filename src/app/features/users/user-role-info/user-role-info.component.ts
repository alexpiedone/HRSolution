import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRoleInfo, UpdateRoleDto } from '../../../models/user'; // Asigură-te că path-ul este corect!
import { GenericDropdownComponent } from '../../../shared/generic-drop-down/generic-drop-down.component'; // Asigură-te că path-ul este corect!

@Component({
  selector: 'app-user-role-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericDropdownComponent],
  templateUrl: './user-role-info.component.html',
  styleUrl: './user-role-info.component.css'
})
export class UserRoleInfoComponent implements OnInit, OnChanges {
  // @Input() - datele primite de la componenta părinte
  @Input() userRoleinfo: UserRoleInfo | undefined;

  // @Output() - evenimentul emis către componenta părinte la salvare
  @Output() roleUpdated = new EventEmitter<UpdateRoleDto>();

  editRoleForm!: FormGroup;
  isEditingRole = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Inițializarea formularului la prima încărcare a componentei
    this.initRoleForm();
  }

  // `ngOnChanges` este esențial pentru a reinițializa formularul când datele
  // primite prin `@Input()` (`userRoleinfo`) se modifică din componenta părinte.
  // Aceasta se asigură că formularul reflectă cele mai recente date ale utilizatorului.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userRoleinfo'] && this.userRoleinfo) {
      this.initRoleForm();
    }
  }

  /**
   * Inițializează sau reinițializează Reactive Form cu datele curente ale rolului.
   */
  initRoleForm(): void {
    this.editRoleForm = this.fb.group({
      position: [this.userRoleinfo?.positionId || null, Validators.required],
      department: [this.userRoleinfo?.departmentId || null, Validators.required],
      team: [this.userRoleinfo?.teamId || null],
      manager: [this.userRoleinfo?.managerId || null]
    });
  }

  /**
   * Intră în modul de editare, permițând modificarea câmpurilor.
   */
  enterEditModeRole(): void {
    this.isEditingRole = true;
    this.initRoleForm(); // Reinițializăm formularul pentru a ne asigura că este la zi cu valorile curente
  }

  /**
   * Salvează modificările făcute în formular.
   * Emite un eveniment către componenta părinte cu datele actualizate.
   */
  saveRoleChanges(): void {
    if (this.editRoleForm.valid) {
      const updatedData: UpdateRoleDto = {
        positionId: this.editRoleForm.get('position')?.value,
        departmentId: this.editRoleForm.get('department')?.value,
        teamId: this.editRoleForm.get('team')?.value,
        managerId: this.editRoleForm.get('manager')?.value
      };
      // Emit evenimentul către componenta părinte. Părintele va gestiona apelul API.
      this.roleUpdated.emit(updatedData);
      this.isEditingRole = false; // Ieșim din modul de editare după emitere
    } else {
      // Afișează erorile de validare dacă formularul este invalid
      this.editRoleForm.markAllAsTouched();
    }
  }

  /**
   * Anulează modificările și iese din modul de editare.
   */
  cancelEditRole(): void {
    this.isEditingRole = false;
    this.initRoleForm(); // Resetează formularul la valorile originale
  }

  /**
   * Metodă utilitară pentru a obține un FormControl din FormGroup.
   * Necesara pentru binding-ul din GenericDropdownComponent.
   */
  getFormControl(formGroup: FormGroup, controlName: string): FormControl {
    const control = formGroup.get(controlName);
    if (control instanceof FormControl) {
      return control;
    }
    // Această eroare ar trebui să apară doar în timpul dezvoltării dacă se face o greșeală
    throw new Error(`Control '${controlName}' not found or is not a FormControl in the provided FormGroup.`);
  }
}