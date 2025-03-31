// dashboard.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
declare var google: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  passedLoginAttempts: number = 0;
  failedLoginAttempts: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    //const attempts = this.authService.getLoginAttempts();
    //Decided to use random numbers for the charts bec
    this.passedLoginAttempts = Math.floor(Math.random() * 100);
    this.failedLoginAttempts = 100 - this.passedLoginAttempts;
    this.drawCharts();

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawCharts());
  }

  drawCharts() {
    if (typeof google !== 'undefined' && google.visualization) {
      // Pie Chart
      this.drawPieChart();

      // Bar Chart
      this.drawBarChart();
    }
  }

  drawPieChart() {
    const pieData = google.visualization.arrayToDataTable([
      ['Login Attempt', 'Number'],
      ['Passed', this.passedLoginAttempts],
      ['Failed', this.failedLoginAttempts],
    ]);

    const pieOptions = {
      title: 'Login Attempt Distribution',
      is3D: true,
    };

    const pieChart = new google.visualization.PieChart(
      document.getElementById('piechart')
    );
    pieChart.draw(pieData, pieOptions);
  }

  drawBarChart() {
    const barData = google.visualization.arrayToDataTable([
      ['Attempt Type', 'Number', { role: 'style' }],
      ['Passed', this.passedLoginAttempts, '#2c3e50'],
      ['Failed', this.failedLoginAttempts, '#e74c3c'],
    ]);

    const barOptions = {
      title: 'Login Attempts',
      hAxis: {
        title: 'Number of Attempts',
        minValue: 0,
      },
      vAxis: {
        title: 'Attempt Type',
      },
      colors: ['#2c3e50', '#e74c3c'],
    };

    const barChart = new google.visualization.BarChart(
      document.getElementById('barchart')
    );
    barChart.draw(barData, barOptions);
  }
}
