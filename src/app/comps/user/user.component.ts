import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Address, Product, UserService } from '../../serv/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MainService } from 'src/app/serv/main.service';
import { ProductService } from 'src/app/serv/product.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css'],
	animations: [ 
		trigger('formAnimation', [
		  state('void', style({
			opacity: 0,
			transform : 'rotate(90deg) scale(0)'
		  })),
		  state('*', style({
			opacity: 1,
			transform : 'rotate(0deg) scale(1)'
		  })),
		  transition('* <=> void', [
			animate(250)
		  ])
		]),
		trigger('coverAnimation', [
		  state('void', style({
			opacity: 0,
		  })),
		  state('*', style({
			opacity: 0.7,
		  })),
		  transition('* <=> void', [
			animate(250)
		  ])
		]),
	  ]
})
export class UserComponent implements OnInit {

	seller: any;
	updateFormType: string = null;
	updateFormTitle: string = null;
	address_type = "UNKNOWN";

	singleUpdateForm = new FormGroup({
		field_value : new FormControl('')
	});

	addressForm = new FormGroup({
		line_one : new FormControl(''),
		line_two : new FormControl(''),
		line_three : new FormControl(''),
		state : new FormControl(''),
		pincode : new FormControl(''),
		city : new FormControl('')
	});

	constructor(
		private router: Router,
		private http: HttpClient,
		public serv: UserService,
		public prdServ: ProductService,
		private mainServ: MainService
	) { }

	ngOnInit(): void {
		if (localStorage.getItem("jwt") === null) {
			this.router.navigate(['/signin'])
		}
		this.mainServ.showMegaMenu = false;
	}


	addAddress() {
		let tempAddress = new Address();
		tempAddress.line_one = this.addressForm.controls['line_one'].value;
		tempAddress.line_two = this.addressForm.controls['line_two'].value;
		tempAddress.line_three = this.addressForm.controls['line_three'].value;
		tempAddress.state = this.addressForm.controls['state'].value;
		tempAddress.pincode = this.addressForm.controls['pincode'].value;
		tempAddress.city = this.addressForm.controls['city'].value;
		tempAddress.address_type  = this.address_type;

		console.log(tempAddress.address_type)
		this.http.post(
			'http://127.0.0.1:8080/address',
			tempAddress,
			{
				headers:  this.serv.getHeaders(),
			}
		).subscribe(data => {
			if(this.address_type == 'home_address') {
				this.serv.user.home_address = tempAddress;
			}
			if(this.address_type == 'office_address') {
				this.serv.user.office_address = tempAddress;
			}
			this.updateFormType = null;
			
		}, err => {
			console.log(err)
		});
	}

	selectedFile : File = null;
	onFileSelected(event){
		this.selectedFile = event.target.files[0];

		const fd = new FormData();
		fd.append('profile_img', this.selectedFile, this.selectedFile.name);
		fd.append('uid', this.serv.user.user_id.toString());
		
		this.http.post(this.mainServ.profile_upload_uri, fd)
		.subscribe(res => {
			
			},err => {
				console.log('update profile err',err)
			}
		)
	}

	update(){
		let inputData = this.singleUpdateForm.controls['field_value'].value;
		this.http.put(
			"http://127.0.0.1:8080/user/"+this.updateFormType,
			inputData,
			{
				headers: this.serv.getHeaders()
			}
		).subscribe(
			data => {
				if(this.updateFormType === 'name') this.serv.user.name = inputData;
				if(this.updateFormType === 'email') this.serv.user.email = inputData;
				if(this.updateFormType === 'contact') this.serv.user.contact = inputData;
				this.updateFormType = null;
			},
			err => {
				console.log(err)
			}
		)

		this.singleUpdateForm.controls['field_value'].setValue(null);

	}


}

