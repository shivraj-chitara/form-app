import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
  formGroup: FormGroup;

  @Output() register = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      profilePicture: [null],
      resume: [null],
    });
  }

  ngOnInit() {
    this.register.emit(this.formGroup);
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    this.formGroup.get(controlName)?.setValue(file);
  }

  filePreviewUrl(controlName: string): string | null {
    const file = this.formGroup.get(controlName)?.value;
    return file ? URL.createObjectURL(file) : null;
  }
}
