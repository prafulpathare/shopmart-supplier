import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainService } from "./main.service";
import { Product } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private mainServ : MainService
  ) { }

  cnt: number = 0;
  getProductFromId(pid: string) {
      return this.http.get<Product>(this.mainServ.getProductApi()+"/"+pid);
  }
  getProductNameFromId(pid: string){
    console.log(this.cnt);
    this.cnt = this.cnt + 1;
    return "Product name "+this.cnt;
  }
}
