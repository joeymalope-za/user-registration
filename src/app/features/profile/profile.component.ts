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
  passedLoginAttempts: number = 70;
  failedLoginAttempts: number = 30;
  activeTab = 0; // Initialize with the first tab active

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const attempts = this.authService.getLoginAttempts();
    this.passedLoginAttempts = attempts.success;
    this.failedLoginAttempts = attempts.failed;
    this.drawCharts();

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawCharts());
  }

  drawCharts() {
    if (typeof google !== 'undefined' && google.visualization) {
      // Pie Chart
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

      // Bar Chart
      const barData = google.visualization.arrayToDataTable([
        ['Attempt Type', 'Number'],
        ['Passed', this.passedLoginAttempts],
        ['Failed', this.failedLoginAttempts],
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
      };

      const barChart = new google.visualization.BarChart(
        document.getElementById('barchart')
      );
      barChart.draw(barData, barOptions);
    }
  }
}
