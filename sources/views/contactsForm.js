import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";

export default class contactForm extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		let form = {
			view:"form",
			elements: [
				{view:"template", template:"", borderless:true, height:40, name:"labelForm"},
				{margin:40, cols: [
					{margin:10, rows:[
						{view:"text", label:_("First Name"), name:"FirstName", invalidMessage:"Please, enter your first name.", labelWidth:100},
						{view:"text", label:_("Last Name"), name:"LastName", invalidMessage:"Please, enter your last name.", labelWidth:100},
						{view:"text", label:_("Email"), name:"Email",invalidMessage:"Wrong email.", labelWidth:100},
						{view:"combo", label:_("Status"), name:"StatusID", labelWidth:100, options:{data:statuses, body:{template:"#Value#"}}},
						{view:"text", label:_("Job"), name:"Job", labelWidth:100},
						{view:"text", label:_("Company"), name:"Company", labelWidth:100},
						{view:"text", label:_("Website"), name:"Website", labelWidth:100},
						
						{}
					]},
					{margin:10, rows:[
						{view:"text", label:_("Address"), name:"Address", labelWidth:100},
						{view:"text", label:_("Skype"), name:"Skype", labelWidth:100},
						{view:"text", label:_("Phone"), name:"Phone", labelWidth:100},
						{view:"datepicker", label:_("Birthday"), name:"Birthday", labelWidth:170},
						{view:"datepicker", label:_("Joining date"), name:"StartDate", labelWidth:170},
						{cols:[
							{view:"template", id:"img", height:120, width:130, borderless:true},
							{
								rows: [
									{},
									{
										view:"uploader",
										value:_("Upload image"),
										accept:"image/jpeg, image/png",
										autosend:false,
										multiple:false,
										on:{
											onBeforeFileAdd:(upload)=>{this.beforeAdd(upload);}
										}
									},
									{
										view:"button", 
										label:_("Delete photo"), 
										click:() => {
											this.form.setValues({Photo:""}, true);
											this.showImage();
										}
									}
									
								]
							}
						]
						},
						{}
					]}
				]},
				{cols: [
					{},
					{view:"button", label:_("Cancel"), width:100, align:"right", click:() => {
						let id = this.getParam("id",true);
						id == "new" ? this.app.show("top/contacts") : this.show("../contactsTemplate");
					}},
					{view:"button", name:"buttonSaveAdd", width:100, align:"right",
						click: () => {
							if( this.form.validate() ){
								let values = this.form.getValues();
								if(values.id){
									contacts.updateItem(values.id, values);
								} else{
									contacts.add(values);
								}
								this.app.show(`top/contacts?id=${values.id}/contactsTemplate`);
							}
						},
						on:{
							onHide () {
								this.clear();
								this.clearValidation();
							}
						}
					}
				]}
			],
			rules:{
				"FirstName":webix.rules.isNotEmpty,
				"LastName":webix.rules.isNotEmpty,
				"Email":webix.rules.isEmail
			}
		};

		return {rows: [form]};
	}
	init(view){
		this.form = view.queryView({view:"form"});
	}
	urlChange(view) {
		const _ = this.app.getService("locale")._;

		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() =>{
			var id = this.getParam("id", true);
			if (id && id !== "new") {
				let data = contacts.getItem(id);
				this.form.setValues(data);
				view.queryView({name:"labelForm"}).setHTML(_("Edit contact"));
				view.queryView({name:"buttonSaveAdd"}).setValue(_("Save"));
			}
			else {
				view.queryView({name:"labelForm"}).setHTML(_("Add contact"));
				view.queryView({name:"buttonSaveAdd"}).setValue(_("Add")); 
				
			}
			this.showImage();
		});
	}
	showImage() {
		let photo = this.form.getValues().Photo;
		this.$$("img").setHTML(`<img src='${photo || "https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png"}' class='contactsFormImg'>`);
	}
	beforeAdd(upload){    
		let file = upload.file;
		let reader = new FileReader();
		reader.onload = (event) =>{
			this.form.setValues({Photo:event.target.result}, true);
			this.showImage();
		};
		reader.readAsDataURL(file);
		return false;
	}
}