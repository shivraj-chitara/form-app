import { signal } from '@angular/core';

export interface FormData {
  id: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  profilePicture: any;
  resume: any;
  hobbies: string[];
  educations: {
    institution: string;
    degree: string;
    year: string;
  }[];
  terms: boolean;
}

export class FormStore {
  private forms = signal<FormData[]>(
    JSON.parse(localStorage.getItem('forms') || '[]'),
  );

  getAllForms(): FormData[] {
    return this.forms();
  }

  getForm(id: number) {
    return this.forms().find((r) => r.id === id);
  }

  addForm(form: Omit<FormData, 'id'>) {
    const newForm = { ...form, id: Date.now() };
    const updatedForms = [...this.forms(), newForm];
    this.forms.set(updatedForms);
    localStorage.setItem('forms', JSON.stringify(updatedForms));
  }

  deleteForm(id: number) {
    const updatedForms = this.forms().filter((f) => f.id !== id);
    this.forms.set(updatedForms);
    localStorage.setItem('forms', JSON.stringify(updatedForms));
  }

  updateForm(id: number, updatedData: Partial<FormData>) {
    const updatedForms = this.forms().map((f) =>
      f.id === id ? { ...f, ...updatedData } : f,
    );
    this.forms.set(updatedForms);
    localStorage.setItem('forms', JSON.stringify(updatedForms));
  }
}

export const formStore = new FormStore();
