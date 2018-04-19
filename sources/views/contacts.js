import {JetView} from "webix-jet";
import {contacts} from "models/contacts";

export default class ContactsView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		let header = {
			view: "template", 
			template:_("Contacts"),
			type:"header"
		};

		let contactsList = {
			view: "list",
			id:"mylistSorting",
			select:true,
			borderless:true,
			template:"<span class='webix_icon fa-user-circle'></span>#FirstName# #LastName# #Email#",
			on:{
				onAfterSelect: (id) =>{
					this.setParam("id", id, true);
				}
			}
		};

		let listFilter = {
			view:"text", 
			id:"mytextFilter",
			name:"type filter",
			placeholder:"Types of filter...",
			on: {
				onTimedKeyPress () {
					let value = this.getValue().toLowerCase();
					$$("mylistSorting").filter((obj) => {
						return obj.FirstName.toLowerCase().indexOf(value) == 0;
					});
				}
			}
		};

		let button = {
			view:"button",
			label:_("Add contact"),
			type:"iconButton", 
			inputWidth:170,
			align:"center",
			icon:"plus",
			click:() => {
				this.show("../contacts?id=new/contactsForm");
			}
		};

		return { 
			cols: [
				{gravity:0.4, 
					rows: [
						header,
						listFilter,
						contactsList,
						button						
					]
				},
				{$subview:true}				
			]
		};
	}
	init(){
		this.$$("mylistSorting").parse(contacts);
	}
	urlChange(){
		contacts.waitData.then(() => {
			const id = this.getParam("id",true);
			if (id === undefined || contacts.getIndexById(id) == -1 && id !=="new") this.show(`../contacts?id=${contacts.getFirstId()}/contactsTemplate`);
			else if (id && id !=="new") this.$$("mylistSorting").select(id);
		});
	}
}