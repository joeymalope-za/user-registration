import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-chart', // Renamed to a more generic name
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chart', { static: false })
  chart!: ElementRef;
  @Input() chartType: 'bar' | 'pie' = 'bar'; // Input to specify chart type
  @Input() chartTitle: string = 'Chart Title';
  @Input() chartData: any[] = []; // Input for data

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
  }

  drawChart(): void {
    if (!this.chartData || this.chartData.length === 0) {
      return; // Prevent drawing if data is empty
    }

    const data = google.visualization.arrayToDataTable(this.chartData);

    let options: any = {
      title: this.chartTitle,
      width: 600,
      height: 400,
    };

    let googleChart;
    if (this.chartType === 'bar') {
      options = {
        ...options, // Spread the base options
        hAxis: { title: 'X-Axis', titleTextStyle: { color: '#333' } },
        vAxis: { minValue: 0 },
      };
      googleChart = new google.visualization.BarChart(this.chart.nativeElement);
    } else if (this.chartType === 'pie') {
      googleChart = new google.visualization.PieChart(this.chart.nativeElement);
    } else {
      console.error('Invalid chart type:', this.chartType);
      return;
    }

    googleChart.draw(data, options);
  }
}
