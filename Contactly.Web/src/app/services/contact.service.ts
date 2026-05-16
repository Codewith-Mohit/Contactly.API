import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('ENVIRONMENT') private environment: any
  ) {
    this.apiUrl = this.environment.apiUrl;
  }

  getContacts() {
    return this.http.get(`${this.apiUrl}/api/contacts`);
  }

  addContact(contact: any) {
    return this.http.post(`${this.apiUrl}/api/contacts`, contact);
  }
}
