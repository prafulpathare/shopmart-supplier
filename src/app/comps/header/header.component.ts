import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/serv/user.service';
import { MainService } from 'src/app/serv/main.service';
import { CartService } from 'src/app/serv/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  searchForm = new FormGroup({
    q:  new FormControl('')
  });

  constructor(
    private router: Router,
    public serv: UserService,
    public cartServ:CartService,
    public mainServ:MainService
    ) { }

  ngOnInit(): void {
  }

}
