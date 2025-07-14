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
  educationArray: FormArray;

  @Output() register = new EventEmitter<FormArray>();

  constructor(private fb: FormBuilder) {
    this.educationArray = this.fb.array([this.createEducationGroup()]);
  }

  ngOnInit() {
    this.register.emit(this.educationArray);
  }

  createEducationGroup(): FormGroup {
    return this.fb.group({
      degree: ['', Validators.required],
      institute: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });
  }

  addEducation(): void {
    this.educationArray.push(this.createEducationGroup());
  }

  removeEducation(index: number): void {
    this.educationArray.removeAt(index);
  }

  get educationFormGroups(): FormGroup[] {
    return this.educationArray.controls as FormGroup[];
  }
}
