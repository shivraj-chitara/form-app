import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { formStore } from '../store/form.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  form: FormGroup;
  isEdit = false;
  // @ts-ignore
  formId: number;
  hobbyList: string[] = ['Reading', 'Traveling', 'Cooking', 'Sports', 'Music'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
      }),
      contactInfo: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        preferredContact: ['', Validators.required],
        address: this.fb.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zip: ['', Validators.required],
        }),
      }),
      profilePicture: [null],
      resume: [null],
      hobbies: this.fb.array([]),
      educations: this.fb.array([this.createEducationGroup()]),
      terms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.formId = +id;
        this.loadFormData(+id);
      }
    });
  }

  loadFormData(id: number) {
    const record = formStore.getForm(id);
    console.log(record);
    if (record) {
      this.form.patchValue({
        personalInfo: record.personalInfo,
        contactInfo: record.contactInfo,
        terms: record.terms,
        profilePicture: record.profilePicture,
        resume: record.resume,
      });

      this.hobbiesArray.clear();
      record.hobbies.forEach((hobby) => {
        this.hobbiesArray.push(this.fb.control(hobby));
      });

      this.educationsArray.clear();
      record.educations.forEach((education) => {
        this.educationsArray.push(this.fb.group(education));
      });
    }
  }

  get hobbiesArray() {
    return this.form.get('hobbies') as FormArray;
  }

  get educationsArray(): FormArray {
    return this.form.get('educations') as FormArray;
  }

  toggleHobby(hobby: string, event: any) {
    const hobbies = this.hobbiesArray;
    if (event.target.checked) {
      hobbies.push(new FormControl(hobby));
    } else {
      const index = hobbies.controls.findIndex((x) => x.value === hobby);
      hobbies.removeAt(index);
    }
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    this.form.get(controlName)?.setValue(file);
  }

  filePreviewUrl(fileControl: string) {
    const file = this.form.get(fileControl)?.value;
    return file ? URL.createObjectURL(file) : null;
  }

  createEducationGroup(): FormGroup {
    return this.fb.group({
      degree: ['', Validators.required],
      institute: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });
  }

  addEducation(): void {
    this.educationsArray.push(this.createEducationGroup());
  }

  removeEducation(index: number): void {
    this.educationsArray.removeAt(index);
  }

  submitForm() {
    if (this.form.valid) {
      if (this.isEdit) {
        formStore.updateForm(this.formId, this.form.value);
        // alert('Form updated successfully!');
      } else {
        formStore.addForm(this.form.value);
        // alert('Form submitted successfully!');
      }

      this.router.navigate(['/dashboard']);
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
