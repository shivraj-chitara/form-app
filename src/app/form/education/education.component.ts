import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './education.component.html',
})
export class EducationComponent {
  educations: FormArray;

  @Output() register = new EventEmitter<FormArray>();

  constructor(private fb: FormBuilder) {
    this.educations = this.fb.array([this.createEducationGroup()]);
  }

  ngOnInit() {
    this.register.emit(this.educations);
  }

  createEducationGroup(): FormGroup {
    return this.fb.group({
      degree: ['', Validators.required],
      institute: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });
  }

  addEducation(): void {
    this.educations.push(this.createEducationGroup());
  }

  removeEducation(index: number): void {
    this.educations.removeAt(index);
  }

  get educationFormGroups(): FormGroup[] {
    return this.educations.controls as FormGroup[];
  }
}
