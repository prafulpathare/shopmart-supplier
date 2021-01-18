import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { MainService } from './main.service';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	cntr: number = 0;
	user: User = new User();
	profile_loc: string = 'http://127.0.0.1/cdn.shopmart/profiles/';

	constructor(
		private http: HttpClient,
		private router: Router,
		private mainServ: MainService,
		private cartServ: CartService
	) {
		this.getUserInfo();
	}

	getUserInfo() {

		this.cntr = this.cntr + 1;
		this.http.get(
			this.mainServ.getUserApi(),
			{
				headers: this.getHeaders()
			}
		).subscribe(user => {
			
			this.user.isAuthenticated = true;
			this.user.user_id = user['user_id'];
			this.user.profile = user['is_profile'] == 1 ? this.profile_loc + user['user_id'] + '.png?mode=' + this.cntr : this.profile_loc + 'default.png';
			this.user.name = user['name'];
			this.user.email = user['email'];
			this.user.is_verified = user['is_verified'];
			this.user.contact = user['contact'];
			this.user.business_name = user['business_name'];
			this.user.products = user['products'];
			this.user.home_address = this.user.office_address = null;

			for (var i = 0; i < user['addresses'].length; i++) {
				if (user['addresses'][i].address_type == "HOME") this.user.home_address = user['addresses'][i];
				if (user['addresses'][i].address_type == "OFFICE") this.user.office_address = user['addresses'][i];
			}

			this.http.get<Product[]>("http://127.0.0.1:3200/product/supplier/"+this.user.user_id)
			.subscribe(data => {
				this.user.products = data['products'];
				this.user.products.forEach(prd => prd.first_imgurl = prd.imgurl[0]);
			})

		}
		);

	}
	logout() {
		localStorage.clear();
		this.user.isAuthenticated = false;
		this.router.navigate(['signin'])
	}

	checkAuth() {
		return (localStorage.getItem("jwt") === null) ? false : true;
	}
	getHomeAddr() {
		return this.user.isAuthenticated ? this.user.home_address : "Log in to set Home address";
	}
	getOfficeAddr() {
		return this.user.isAuthenticated ? this.user.office_address : "Log in to set Office address";
	}
	getHeaders() {
		return new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': localStorage.getItem("jwt")
		});
	}
}

export class User {
	public user_id: number;
	public name: string;
	public isAuthenticated: boolean = false;
	public email: string;
	public contact: string;
	public profile: string;
	public home_address: Address;
	public office_address: Address;
	public business_name: string;
	public is_verified: boolean = false;
	public products: Product[] = [];

	constructor() {
		this.home_address = new Address();
		this.office_address = new Address();
	}

}

export class Address {
	public address_id: number = 0;
	public line_one: string = "";
	public line_two: string = "";
	public line_three: string = "";
	public city: string = "";
	public state: string = "";
	public pincode: string = null;
	public address_type: string;
}

export class Product {
	public _id: any;
	public name: string = "";
	public category: string = "";
	public company: string = "";
	public quantity: number = 1;
	public views: number = 0;
	public price: number = 0.00;
	public imgurl: string[] = [];
	public first_imgurl: string;
	public description: string[] = [];
	public is_approved: boolean = false;

	constructor(_id, name,company, quantity, price, imgurl, description, is_approved, category, views) {
		this._id = _id;
		this.name = name;
		this.company = company;
		this.quantity = quantity;
		this.price = price;
		this.imgurl = imgurl;
		this.description = description;
		this.is_approved = is_approved;
		this.views = views;
		this.category = category;
	}
}

