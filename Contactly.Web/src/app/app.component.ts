import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  http = inject(HttpClient);
  selectedContactId: string | null = null;

  contactsForm = new FormGroup({
    name : new FormControl<string>(''),
    email : new FormControl<string | null >(null),
    phone : new FormControl<string>(''),
    favorite : new FormControl<boolean>(false)
  })

  contact$ = this.getContacts();
 

  onDelete(id : string) {
this.http.delete(`https://localhost:7103/api/Contacts/${id}`)
.subscribe({ 
   next : (value) => {
     alert('Item deleted');
     this.contact$ = this.getContacts();
   },
   error: (err) => {
    console.error('Delete failed', err);
    alert('Failed to delete item');
  }
})
  }

  onSelectContact(contact: Contact) {
    alert(contact.id);
    this.selectedContactId = contact.id;
    this.contactsForm.patchValue({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      favorite: contact.favorite
    });
  }

  onUpdate() {

    if (!this.selectedContactId) {
      alert(this.selectedContactId);
      return;
    }
    const updateContactRequest = {
      contactId: this.selectedContactId,
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite
    };
    alert(updateContactRequest.contactId);
    this.http.patch(`https://localhost:7103/api/Contacts`, updateContactRequest)
      .subscribe({
        next: () => {
          alert('Item updated');
          this.contact$ = this.getContacts();
          this.contactsForm.reset();
          this.selectedContactId = null;
        },
        error: (err) => {
          alert(err);
          console.error('Update failed', err);
          alert('Failed to update item');
        }
      });
  }

  onFormSubmit (){
    const addContactRequest = {      
      name : this.contactsForm.value.name,
      email : this.contactsForm.value.email,
      phone : this.contactsForm.value.phone,
      favorite : this.contactsForm.value.favorite
    }

    this.http.post('https://localhost:7103/api/Contacts', addContactRequest)  //obersable call
    .subscribe({ 
      next : (value) => {
        console.log(value);
        this.contact$ = this.getContacts();
        this.contactsForm.reset();
        this.selectedContactId = null;
      }
    });
  }

  private getContacts() : Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7103/api/Contacts');
  }
}
