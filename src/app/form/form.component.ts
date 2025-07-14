import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HobbiesComponent } from './hobbies/hobbies.component';
import { EducationComponent } from './education/education.component';
import { formStore } from '../store/form.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PersonalInfoComponent,
    ContactInfoComponent,
    FileUploadComponent,
    HobbiesComponent,
    EducationComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  form: FormGroup;
  isEdit = false;
  formId!: number;
  private record: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      terms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.formId = +id;
        this.record = formStore.getForm(this.formId);
      }

      if (this.record) {
        if ('terms' in this.record) {
          this.form.get('terms')?.setValue(this.record.terms);
        }
      }
    });
  }

  registerFormGroup(key: string, control: AbstractControl) {
    this.form.addControl(key, control);

    if (this.isEdit && this.record && this.record[key]) {
      if (control instanceof FormGroup) {
        control.patchValue(this.record[key]);
      } else if (control instanceof FormArray) {
        const arrayData = this.record[key];
        control.clear();
        arrayData.forEach((item: any) => {
          if (typeof item === 'object') {
            (control as FormArray).push(this.fb.group(item));
          } else {
            (control as FormArray).push(this.fb.control(item));
          }
        });
      }
    }
  }

  submitForm() {
    // if (this.form.valid) {

    if (!this.form.get('terms')?.value) {
      alert('Please accept the terms and conditions.');
      return;
    }

    if (this.isEdit) {
      formStore.updateForm(this.formId, this.form.value);
    } else {
      formStore.addForm(this.form.value);
    }

    this.router.navigate(['/dashboard']);
    // } else {
    // alert('Please fill in all required fields.');
    // }
  }
}
