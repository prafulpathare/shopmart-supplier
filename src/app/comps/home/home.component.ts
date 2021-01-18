import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router} from '@angular/router';
import { CartService } from '../../serv/cart.service';
import { Product, UserService } from '../../serv/user.service';
import { HttpClient } from '@angular/common/http';
import { ProductService } from 'src/app/serv/product.service';
import { MainService } from 'src/app/serv/main.service';
import { async } from 'rxjs/internal/scheduler/async';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // animations: [ 
  //   trigger('sidebarAnimation', [
  //     state('void', style({
  //       marginLeft: '-340px'
  //     })),
  //     state('*', style({
  //       marginLeft: '0px'
  //     })),
  //     transition('* <=> void', [
  //       animate(2500)
  //     ])
  //   ]),
  //   trigger('rightPaneAnimation', [
  //     state('min', style({
  //       width: 'calc(100% - 350px)'
  //     })),
  //     state('max', style({
  //       width: '100%'
  //     })),
  //     transition('min <=> max', [
  //       animate(250)
  //     ])
  //   ]),
  // ]
})
export class HomeComponent implements OnInit {

  showSideMenu: boolean = true;
  selectedProductForAnalytics: string = null;
  fromDate: Date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  toDate: Date = new Date();
  fromDates: Date[] = [];
  toDates: Date[] = [];

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Sales' },
    { data: [], label: 'Views' }
  ];

  //Labels shown on the x-axis
  lineChartLabels: Label[] = [];

  // Define chart options
  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
         gridLines: {
            display: false
         }
      }],
      yAxes: [{
         gridLines: {
            display: false
         }
      }]
 }

  };

  // Define colors of chart segments
  lineChartColors: Color[] = [

    { // dark grey
      backgroundColor: 'rgba(8, 183, 51, 0.35)',
      borderWidth: 0,
      borderColor: 'transparent',
      pointRadius: 0
    },
    {
      backgroundColor: 'rgba(8, 183, 252, 0.35)',
      borderWidth: 0,
      borderColor: 'transparent',
      pointRadius: 0
      // borderColor: '',
    }
  ];

  // Set true to show legends
  lineChartLegend = true;

  // Define type of chart
  lineChartType = 'line';

  lineChartPlugins = [];

  // events
  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }



  doughnutChartLabels: Label[] = ['Mumbai', 'Delhi', 'Chennai', 'Calcutta', 'Noida'];
  doughnutChartData: MultiDataSet = [
    [53, 30, 17]
  ];
  doughnutChartType: ChartType = 'doughnut';
barChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  barChartLabels: Label[] = ['2013', '2014', '2015', '2016', '2017', '2018'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [2500, 5900, 6000, 8100, 8600, 8050, 1200], label: 'Company A' },
    { data: [2800, 4800, 4000, 7900, 9600, 8870, 1400], label: 'Company B' }
  ];



  constructor(
    private router: Router,
    public serv: UserService,
    public cartServ: CartService,
    public prdServ: ProductService,
    public mainServ: MainService,
    public http: HttpClient
  ) {
    
  }

  ngOnInit(): void {
    this.loadDates();
    this.loadLineChart();
  }

  loadLineChart() {
    console.log(this.selectedProductForAnalytics);
    this.http.post<AnalyticsResponse[]>(
      "http://127.0.0.1:8080/product/analytics",
      {
          "product_id": this.selectedProductForAnalytics,
          "from_date": this.fromDate,
          "to_date": this.toDate
      },
			{
				headers:  this.serv.getHeaders()
			}
    ).subscribe(data => {
      console.log(this.selectedProductForAnalytics, data);
      this.lineChartData[0].data = [];
      this.lineChartData[1].data = [];
      this.lineChartLabels = [];
        data.forEach(e => {
          this.lineChartData[0].data.push(e.orders);
          this.lineChartData[1].data.push(e.views);
          let date = new Date(e.date);
          this.lineChartLabels.push(
            date.getDate().toLocaleString() + "/" + (date.getMonth() + 1).toLocaleString() +"/"+ date.getFullYear()
          );
        })
    });
  }

  onChangeAnalyticsProduct(event_data: any){
    // this.selectedProductForAnalytics = product_id;
      this.loadLineChart();
  }
  loadDates(){
    // load toDates
    for (let i = 1; i < 100; i++) {
      this.fromDates.push(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000) ) );
    } 
    // load fromDates
    for (let i = 0; i < 99; i++) {
      this.toDates.push(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000) ) );
    }
  }


}


class AnalyticsResponse {
  public product_id: string;
  public orders: number;
  public views: number;
  public date: string;
}