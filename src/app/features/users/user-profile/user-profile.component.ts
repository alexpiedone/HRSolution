import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserProfileUpdateDTO, UserRoleInfo } from '../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})export class UserProfileComponent implements OnInit, OnChanges {
  @Input() userinfo: User | undefined;
  @Input() userRoleinfo: UserRoleInfo | undefined; 

  @Output() profileUpdated = new EventEmitter<UserProfileUpdateDTO>();

  editProfileForm!: FormGroup;
  isEditingProfile = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initProfileForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userinfo'] && this.userinfo) {
      this.initProfileForm();
    }
  }

  initProfileForm(): void {
    this.editProfileForm = this.fb.group({
      email: [this.userinfo?.email || '', [Validators.required, Validators.email]],
      phone: [this.userinfo?.phone || '', [Validators.pattern(/^\+?\d{10,15}$/)]] 
    });
  }

  enterEditModeProfile(): void {
    this.isEditingProfile = true;
    this.initProfileForm();
  }

  saveProfileChanges(): void {
    if (this.editProfileForm.valid && this.userinfo) {
      const updatedProfileDTO: UserProfileUpdateDTO = {
        id: this.userinfo.id as number, 
        email: this.editProfileForm.value.email,
        phone: this.editProfileForm.value.phone
      };

      this.profileUpdated.emit(updatedProfileDTO);

      this.isEditingProfile = false; 
    }
  }

  cancelEditProfile(): void {
    this.isEditingProfile = false;
    this.initProfileForm();
  }
}