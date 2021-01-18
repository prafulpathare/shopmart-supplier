import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from 'src/app/serv/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/serv/cart.service';
import { MainService } from 'src/app/serv/main.service';
import { Product, UserService } from 'src/app/serv/user.service';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: [
		'../home/home.component.css',
		'./product.component.css'
	]
})
export class ProductComponent implements OnInit {

	tnc : boolean = false;
	err : string = "";
	suc: boolean = false;

  // review form 
  productForm = new FormGroup({
	name: new FormControl(''),
	price: new FormControl(''),
	type: new FormControl(''),
	category: new FormControl(''),
	company: new FormControl(''),
	description: new FormControl(''),
	tnc: new FormControl('')
  });

	constructor(
		public http: HttpClient,
		private router: Router,
		public route: ActivatedRoute,
		public prdServ: ProductService,
		public mainServ: MainService,
		public serv: UserService,
		public cartServ: CartService
	) {

	}

	ngOnInit(): void {
			
	}


	selectedFiles : any[] = [];
	onFileSelected(event){
		this.selectedFiles = event.target.files;

		const fd = new FormData();
		for (let i = 0; i < this.selectedFiles.length; i++) {
			fd.append("files", this.selectedFiles[i], this.selectedFiles[i].name);
		}
		let productInfo = {
			'name' :  this.productForm.controls['name'].value,
			'price' :  parseFloat(this.productForm.controls['price'].value),
			'category': this.productForm.controls['category'].value,
			'type' : this.productForm.controls['type'].value,
			'company': this.productForm.controls['company'].value,
			'description': this.productForm.controls['description'].value.split("\n")
		};

		fd.append('product', JSON.stringify(productInfo));
		
		this.http.post(
			"http://127.0.0.1:8080/product",
			fd,
			{
				headers: new HttpHeaders({					
					'Authorization': localStorage.getItem("jwt")
				})
			}
		)
		.subscribe(res => {
				console.log('done')			
			},err => {
				console.log('update profile err',err)
			}
		)
	}
  addProduct(){
    this.http.post("http://127.0.0.1:8080/product", {
		
    },
    {
        headers:  this.serv.getHeaders()
      }
    ).subscribe(
      data => {
		  
      },
      error => {
        console.log(error)
      }
    )
  }
}
