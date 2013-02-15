//	new App.Views.App({ collection: App.contacts })
//	Global app view responsible for creating addContacts and allContacts views
App.Views.App = Backbone.View.extend({
	initialize: function(){
//		Added a listener here for edit view
		vent.on('contact:edit', this.editContact, this);
		
		
		
//		console.log( this.collection.toJSON() );
//		Remember when this was kicked off, we injected 	new App.Views.App({ collection: App.contacts })
		var addContactView = new App.Views.AddContact({ collection: App.contacts });
		
//		Need to kick off the allContacts view
		var allContactsView = new App.Views.Contacts({ collection: App.contacts }).render();
		
		$('#allContacts').append(allContactsView.el);
	},
	
//	vent receives a copy of the model from whence it was triggered and it becomes available in the method
	editContact: function( contact ){
		var editContactView = new App.Views.EditContact( {model: contact } );
		$('#editContact').html(editContactView.el);
		$('#editContact').modal();
		console.log('editing');
	}
});


//	The add contact view
//	Remember this is just a class , you need to instantiate it 

App.Views.AddContact = Backbone.View.extend({
	el: '#addContact',
	
//	This is why it's an MV* framework, because it's the view that's controlling
	events: {   
		'submit': 'addContact'
	},
	
//	Cache the id's so you don't need to keep looking them up them up
	initialize: function(){
		this.firstName = $('#firstName');
		this.lastName = $('#lastName');
		this.emailAddress = $('#emailAddress');
		
//		FYI the more verbose way of finding the element
		this.description = this.$el.find('#description');
	},
	
	addContact: function( e ){
		e.preventDefault();
		
//		console.log('Adding contact');
//		console.log(this.collection);
		
		var newContact = this.collection.create({
			firstName: this.firstName.val(),
			lastName: this.lastName.val(),
			emailAddress: this.emailAddress.val(),
			description: this.description.val()
		}, { wait: true });
//		Add validate: function(){} to the model, and you don't need to call something like model.set({foo: 'bar'}{validate: true})
//		{wait: true} Waits for a response from the server before setting new values executing the create method
//		Not sure how useful it is given that if you submit a blank form it still adds it
//		Need to figure out how to incorporate server side validation into backbone
//		Actually it seems to work... if the server doesn't return an id there's an error
//		But it's not the wait command that does it, I took it out and it still gives
//		an error
		
		this.clearForm();
		
		console.log(newContact);
		
	},
	
	clearForm: function(){
		this.firstName.val(''),
		this.lastName.val(''),
		this.emailAddress.val(''),
		this.description.val('')
	} 
});

//Edit contact view

App.Views.EditContact = Backbone.View.extend({
//	Don't need to give tagName 
	
//	Automatically render when it's created
	initialize: function(){
		this.render();
		
		this.form = this.$('form');
		this.firstName = this.form.find('#editFirstName');
		this.lastName = this.form.find('#editLastName');
		this.emailAddress = this.form.find('#editEmailAddress');
		this.description = this.form.find('#editDescription');
		
		
	},
	
//	Need an events object to listen to submissions
	events: {
		'submit form': 'submit',
		'click button.btn-danger': 'cancel'
	},
	
	submit: function( e ){
		e.preventDefault();
		console.log( 'edit submit ');
		
//		Get model
//		Update attributes
//		One way of doing it 
//		this.model.set({
//			firstName: ....
//		});
//		Another way to save on setting
		this.model.save({
			firstName: this.firstName.val(),
			lastName: this.lastName.val(),
			description: this.description.val(),
			emailAddress: this.emailAddress.val()
		});
		
//		Remove when you're done
		$('#editContact').modal('hide');
		this.remove();
	},
	
	cancel: function(){
		$('#editContact').modal('hide');
		this.remove();
	},
	
	template: template('editContactTemplate'),
	
	render: function(){
		var html = this.template( this.model.toJSON() );
		this.$el.html( html );
		return this;
	}
});


//	All contacts view

App.Views.Contacts = Backbone.View.extend({
//	Adding to a table
	tagName: 'tbody',
	
//	Add a listener so the collection view refreshes when the collection receives an extra object
	initialize: function(){
//		There's no way to control 'sync'  whether it's adding or editing... only
//		want it for add
		this.collection.on('add', this.addOne, this );
	},
	
	render: function() {
		this.collection.each( this.addOne, this );
		console.log( this.el );
		return this;
	},
	
	addOne: function( contact ){
		var contactView = new App.Views.Contact({ model: contact });
//		console.log( contactView.render().el );
		this.$el.append( contactView.render().el );
	}
});





//	Single contact view

App.Views.Contact = Backbone.View.extend({
	tagName: 'tr',
	
	template: template('addContactsTemplate'),
	
	initialize: function(){
//		The view listens to a model being destroyed
		this.model.on('destroy', this.unrender, this);
		
//		And being changed
		this.model.on('change', this.render, this);
	}, 
	
//	The view's events handle what's going on when someone edit's a row
//	TODO Figure out how to do this with a router 
//	Having added a button to the contact you need to add a listener for when it was clicked
	events: {
		'click button.btn-danger': 'deleteContact',
		'click button.btn-warning': 'editContact'
	},
	
	editContact: function(){
//		console.log('edit'); 
		
//		create new EditContactView
//		Bind the model
//		Could do this way but then this view is doing too much... add to the parent view up top
//		var editContactView = new App.Views.EditContact( {model: this.model } );
//		console.log( editContactView.el );
		
//		Look the even trigger passes through a reference to the model
		vent.trigger('contact:edit', this.model);
		 
//		Append the form to the dom
	},
	
	deleteContact: function(){
//		console.log('Delete');
//		Remember once you destroy the model, you need to listen to rerender the view
		this.model.destroy();
	},
	
	render: function(){
		this.$el.html( this.template( this.model.toJSON() ));
		return this;
	},
	
	unrender: function(){
		this.remove();
//		Shortcut for
//		this.$el.remove();
	}
});

