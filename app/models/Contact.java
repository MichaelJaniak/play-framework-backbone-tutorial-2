package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints;
import play.data.validation.Constraints.EmailValidator;
import play.db.ebean.Model;


@Entity
public class Contact extends Model {
	
	@Id
	public String id;

    @Constraints.Required
	public String firstName, lastName;
	
    @Constraints.Email
    @Constraints.Required
	public String emailAddress;
	
	public String description;
	
	
	public Contact(){
	}
	
    public static Finder<String,Contact> find = new Finder<String,Contact>(String.class, Contact.class);
    
    /**
     * Saves a contact to the database unless that contact is null
     * @param contact
     * @return the contact or null if the input contact is null
     */
    public static Contact create(Contact contact) {
    	if(contact!=null)
    		contact.save();
        return contact;
    }
    

	/**
	 * 
	 * @param contact
	 * @return the contact or null if verification fails
	 */
    public static Contact verifyNew(Contact contact){
    	if(contact.firstName==null | contact.lastName ==null ) return null;
    	if(contact.firstName.isEmpty() | contact.lastName.isEmpty() ) return null;
		EmailValidator valid = new EmailValidator();
		if(!valid.isValid(contact.emailAddress)) return null;
    	return contact;
    }

    public Contact fill(Contact contact){
    	System.out.println(play.libs.Json.toJson(contact));
    	
    	
    	if(contact.firstName!=null || !contact.firstName.isEmpty()) this.firstName= contact.firstName;
    	if(contact.lastName!=null || !contact.lastName.isEmpty()) this.lastName= contact.lastName;
    	if(contact.emailAddress!=null || !contact.emailAddress.isEmpty()) this.emailAddress= contact.emailAddress;
    	if(contact.description!=null || !contact.description.isEmpty()) this.description= contact.description;
    	return this;
    }

    
}
