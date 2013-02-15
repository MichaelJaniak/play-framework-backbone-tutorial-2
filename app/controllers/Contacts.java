package controllers;

import java.io.IOException;

import org.codehaus.jackson.map.ObjectMapper;

import models.Contact;
import play.mvc.*;
import views.html.*;
import actions.CORSAction;

public class Contacts extends Controller {
	
	public static Result index() {
		return ok(views.html.index.render());
	}

	@With(CORSAction.class)
	public static Result all(){
		return ok(play.libs.Json.toJson(Contact.find.all()));
	}

	@With(CORSAction.class)
	public static Result get(String id){
		return ok(play.libs.Json.toJson(Contact.find.byId(id)));
	}

	@With(CORSAction.class)
	public static Result update(String id){
		Contact contact = null;
		try {
			contact =  new ObjectMapper().readValue(request().body().asJson(), Contact.class);
		} catch (IOException e) {
			return Results.notFound("json is not of format");
		}
		
		Contact dbContact = Contact.find.byId(id);
		if(dbContact!= null){
			dbContact.fill(contact);
			dbContact.update();			
		}
		return ok(play.libs.Json.toJson(dbContact));
	}

	@With(CORSAction.class)
	public static Result delete (String id){
		Contact.find.byId(id).delete();
		return ok(play.libs.Json.toJson(new Contact()));
	}
	
	@With(CORSAction.class)
	public static Result create (){
		Contact contact = null;
		try {
			contact =  new ObjectMapper().readValue(request().body().asJson(), Contact.class);
		} catch (IOException e) {
			return Results.notFound("json is not  of format Task");
		}
		contact = Contact.verifyNew(contact);
		
		if(contact == null)
			return ok(play.libs.Json.toJson(""));

		return ok(play.libs.Json.toJson(Contact.create(contact)));
	}

	
	public static Result options(String id) {
		return ok();
	}
	
	public static Result optionsPost() {
		return ok();
	}

	
}