using Contactly.Data;
using Contactly.Models.Domain;
using Contactly.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.AccessControl;

namespace Contactly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContactlyDbContext dbContext;

        public ContactsController(ContactlyDbContext _dbContext)
        {
                dbContext = _dbContext; 
        }

        [HttpGet]
        public IActionResult GetAllContacts()
        {
            var contacts = dbContext.Contacts.ToList();
            return Ok(contacts);
        }

        [HttpPost]
        public IActionResult AddContact(AddContactDTO dto)
        {
            var contact = new Contact 
            {
                Id= Guid.NewGuid(),
                Name = dto.Name, 
                Email = dto.Email, 
                Phone = dto.Phone, 
                Favorite = dto.Favorite 
            };            
            dbContext.Contacts.Add(contact);
            dbContext.SaveChanges();
            return Ok(contact);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteContact(Guid id)
        {
            var contact = dbContext.Contacts.Find(id);
            if (contact is not null)
            {
                dbContext.Contacts.Remove(contact);
                dbContext.SaveChanges();
            }
            return Ok();
        }
    }
}
