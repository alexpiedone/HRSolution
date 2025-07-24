import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Document } from '../../../models/document';

@Component({
  selector: 'app-documents-manager',
  imports: [TabViewModule, TableModule, ToastModule, FormsModule, CommonModule, ReactiveFormsModule, DropdownModule, FileUploadModule, ConfirmDialogModule],
  templateUrl: './documents-manager.component.html',
  styleUrls: ['./documents-manager.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class DocumentManagerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() documents: Document[] = [];
  @Input() entityId!: number;
  @Input() entityType!: 'user' | 'company' | 'department' | string;
  @Input() canUpload: boolean = true;
  @Input() canDelete: boolean = true;

  @Output() documentsRefreshed = new EventEmitter<void>();

  activeTabIndex: number = 0;
  isAddTabActive: boolean = false;
  isEditTabActive: boolean = false;

  filteredDocuments: Document[] = [];

  allowedFileExtensions: string[] = ['pdf', 'doc', 'docx', 'xlsx', 'txt', 'jpg', 'png'];
  allowedDocumentCategories: string[] = ['Onboarding', 'Benefits', 'Performance', 'Time Off', 'Compliance', 'Training', 'Legal'];

  searchQuery: string = '';
  filterType: string = '';
  filterCategory: string = '';

  selectedDocument: Document | null = null;

  uploadForm: FormGroup;
  editForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileForEdit: File | null = null;

  currentlyUploading: boolean = false;
  uploadProgress: number = 0;
  uploadStatus: 'uploading' | 'processing' | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private primeNg: PrimeNG,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    this.uploadForm = this.fb.group({
      documentName: ['', Validators.required],
      documentType: ['', Validators.required],
      documentFile: [null, Validators.required],
      documentDescription: ['']
    });

    this.editForm = this.fb.group({
      documentName: ['', Validators.required],
      documentType: ['', Validators.required],
      documentDescription: ['']
    });
  }

  ngOnInit(): void {
    this.primeNg.ripple.set(true);
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documents']) {
      this.applyFilters();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    this.filteredDocuments = this.documents.filter(doc => {
      const matchesSearch = this.searchQuery === '' ||
        doc.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesType = this.filterType === '' || doc.fileExtension === this.filterType;
      const matchesCategory = this.filterCategory === '' || doc.category === this.filterCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }

  getFileExtensionColor(fileExtension: string): string {
    const colors: { [key: string]: string } = {
      'pdf': 'bg-red-100 text-red-800',
      'doc': 'bg-blue-100 text-blue-800',
      'docx': 'bg-blue-100 text-blue-800',
      'xlsx': 'bg-green-100 text-green-800',
      'txt': 'bg-gray-100 text-gray-800',
      'jpg': 'bg-purple-100 text-purple-800',
      'png': 'bg-purple-100 text-purple-800'
    };
    return colors[fileExtension] || 'bg-gray-100 text-gray-800';
  }

  openAddDocumentTab(): void {
    this.activeTabIndex = 1;
    this.isAddTabActive = true;
    this.isEditTabActive = false;
    this.resetUploadForm();
  }

  openEditDocumentTab(doc: Document): void {
    this.selectedDocument = { ...doc };
    this.editForm.patchValue({
      documentName: this.selectedDocument.name,
      documentType: this.selectedDocument.category,
      documentDescription: this.selectedDocument.description
    });
    this.selectedFileForEdit = null;
    this.activeTabIndex = 2;
    this.isEditTabActive = true;
    this.isAddTabActive = false;
  }

  cancelEdit(): void {
    this.selectedDocument = null;
    this.selectedFileForEdit = null;
    this.activeTabIndex = 0;
    this.isEditTabActive = false;
  }

  onFileSelected(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadForm.patchValue({ documentFile: file });
      this.uploadForm.get('documentFile')?.updateValueAndValidity();
    }
  }

  onFileSelectedForEdit(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFileForEdit = file;
    }
  }

  uploadDocument(): void {
    if (this.uploadForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill all required fields.' });
      this.uploadForm.markAllAsTouched();
      return;
    }
    if (!this.selectedFile) {
      this.messageService.add({ severity: 'error', summary: 'File Missing', detail: 'Please select a file to upload.' });
      return;
    }

    this.currentlyUploading = true;
    this.uploadStatus = 'uploading';
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('documentName', this.uploadForm.get('documentName')?.value);
    formData.append('documentType', this.uploadForm.get('documentType')?.value);
    formData.append('documentDescription', this.uploadForm.get('documentDescription')?.value || '');

    const uploadUrl = `http://localhost:5000/api/${this.entityType}/${this.entityId}/documents/upload`;

    this.http.post(uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      finalize(() => this.currentlyUploading = false),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
          if (this.uploadProgress === 100) {
            this.uploadStatus = 'processing';
          }
        } else if (event.type === HttpEventType.Response) {
          const uploadedDoc: Document = event.body as Document;
          this.uploadStatus = null;
          this.messageService.add({ severity: 'success', summary: 'Upload Complete', detail: `${uploadedDoc.name} has been uploaded successfully.` });
          this.documentsRefreshed.emit();
          this.cancelUpload();
        }
      },
      error: (error) => {
        this.uploadStatus = null;
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'An error occurred during upload.' });
        console.error('Upload failed:', error);
      }
    });
  }

  cancelUpload(): void {
    this.resetUploadForm();
    this.currentlyUploading = false;
    this.uploadProgress = 0;
    this.uploadStatus = null;
    this.activeTabIndex = 0;
    this.isAddTabActive = false;
  }

  resetUploadForm(): void {
    this.uploadForm.reset();
    this.selectedFile = null;
    this.uploadForm.get('documentType')?.setValue('');
  }

  updateDocument(): void {
    if (this.editForm.invalid || !this.selectedDocument) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill all required fields.' });
      this.editForm.markAllAsTouched();
      return;
    }

    const updatedDoc: Document = { ...this.selectedDocument };
    updatedDoc.name = this.editForm.get('documentName')?.value;
    updatedDoc.category = this.editForm.get('documentType')?.value;
    updatedDoc.description = this.editForm.get('documentDescription')?.value;

    const updateUrl = `http://localhost:5000/api/${this.entityType}/${this.entityId}/documents/${updatedDoc.id}`;
    const formData = new FormData();
    formData.append('documentName', updatedDoc.name);
    formData.append('documentType', updatedDoc.category);
    formData.append('documentDescription', updatedDoc.description || '');

    if (this.selectedFileForEdit) {
      formData.append('file', this.selectedFileForEdit, this.selectedFileForEdit.name);
    }

    this.http.put(updateUrl, formData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Update Complete', detail: `${updatedDoc.name} has been updated successfully.` });
        this.documentsRefreshed.emit();
        this.cancelEdit();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: 'An error occurred during update.' });
        console.error('Update failed:', error);
      }
    });
  }

  confirmDelete(doc: Document): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the document "${doc.name}"? This action cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-outlined p-button-secondary',
      accept: () => {
        this.onDeleteDocument(doc.id, doc.name);
      },
      reject: (type: ConfirmEventType) => {
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Deletion cancelled' });
      }
    });
  }

  onDeleteDocument(id: number, name: string): void {
    const deleteUrl = `http://localhost:5000/api/${this.entityType}/${this.entityId}/documents/${id}`;

    this.http.delete(deleteUrl).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Document Deleted', detail: `${name} has been successfully deleted.` });
        this.documentsRefreshed.emit();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Delete Failed', detail: 'An error occurred during deletion.' });
        console.error('Delete failed:', error);
      }
    });
  }

  onDownload(fileUrl: string, fileName: string): void {
    this.messageService.add({ severity: 'info', summary: 'Download Started', detail: `Downloading ${fileName}...` });
    if (fileUrl) {
      window.open(fileUrl, '_blank');
      this.messageService.add({ severity: 'success', summary: 'Download Complete', detail: `${fileName} has been downloaded.` });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Download Failed', detail: 'Document URL is not available.' });
    }
  }
}