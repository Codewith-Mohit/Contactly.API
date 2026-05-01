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

  contactsForm = new FormGroup({
    name : new FormControl<string>(''),
    email : new FormControl<string | null >(null),
    phone : new FormControl<string>(''),
    favorite : new FormControl<boolean>(false)
  })

  contact$ = this.getContacts();
 

  onDelete(id : string) {
this.http.delete(`http://localhost:5029/api/Contacts/${id}`)
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


  onFormSubmit (){
    const addContactRequest = {      
      name : this.contactsForm.value.name,
      email : this.contactsForm.value.email,
      phone : this.contactsForm.value.phone,
      favorite : this.contactsForm.value.favorite
    }

    this.http.post('http://localhost:5029/api/Contacts', addContactRequest)  //obersable call
    .subscribe({ 
      next : (value) => {
        console.log(value);
        this.contact$ = this.getContacts();
        this.contactsForm.reset();
      }
    });
  }

  private getContacts() : Observable<Contact[]> {
    return this.http.get<Contact[]>('http://localhost:5029/api/Contacts');
  }
}
