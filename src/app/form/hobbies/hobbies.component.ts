import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hobbies.component.html',
})
export class HobbiesComponent {
  hobbiesArray: FormArray;
  hobbyList = ['Reading', 'Traveling', 'Cooking', 'Sports', 'Music'];

  @Output() register = new EventEmitter<FormArray>();

  constructor(private fb: FormBuilder) {
    this.hobbiesArray = this.fb.array([]);
  }

  ngOnInit() {
    this.register.emit(this.hobbiesArray);
  }

  toggleHobby(hobby: string, event: any) {
    if (event.target.checked) {
      this.hobbiesArray.push(new FormControl(hobby));
    } else {
      const index = this.hobbiesArray.controls.findIndex(
        (ctrl) => ctrl.value === hobby,
      );
      if (index !== -1) this.hobbiesArray.removeAt(index);
    }
  }
}
