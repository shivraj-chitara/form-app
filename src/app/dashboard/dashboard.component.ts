import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formStore, FormData } from '../store/form.store';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  formData: FormData[] = [];
  filteredFormData: FormData[] = [];
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;
  searchQuery = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.handleLoadData();
  }

  handleLoadData() {
    this.formData = formStore.getAllForms();
    this.applyFilter();
  }

  applyFilter() {
    this.filteredFormData = this.formData.filter(
      (r) =>
        r.personalInfo.firstName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        r.personalInfo.lastName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        r.contactInfo.email
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()),
    );
    this.totalPages = Math.ceil(this.filteredFormData.length / this.pageSize);
    this.currentPage = 1;
  }

  get currentPageData(): FormData[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredFormData.slice(start, start + this.pageSize);
  }

  handleNextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  handlePrevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  handleDelete(id: number) {
    if (confirm('Delete this record?')) {
      formStore.deleteForm(id);
      this.handleLoadData();
    }
  }

  handleEdit(id: number) {
    this.router.navigate(['/form', id]);
  }
}
