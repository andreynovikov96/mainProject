import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import Info from "views/contactsTemplate";

export default class ContactsView extends JetView{
	config(){
		let header = {
			view: "template", 
			template:"Contacts",
			type:"header"
		};

		let contactsList = {
			view: "list",
			select:true,
			borderless:true,
			template:"<span class='webix_icon fa-user-circle'></span>#FirstName# #LastName# #Email#",
			on:{
				onAfterSelect: (id) =>{
					this.setParam("id", id, true);
				}
			}
		};

		return { 
			cols: [
				{gravity:0.5, rows: [
					header,
					contactsList,						
				]
				},
				Info
				
			]
		};
	}
	init(view){
		this.list = view.queryView({ view: "list"});
		this.list.sync(contacts);
	}
	urlChange(){
		contacts.waitData.then(() =>{
			let id = this.getParam("id");
			if(id !== this.list.getSelectedId()){
				if ( !id || !contacts.exists(id))
					id = contacts.getFirstId();
				this.list.select(id);
			}
		});
	}
}