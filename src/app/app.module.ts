import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent } from './shared/chart/chart.component';
import { LineChartComponent } from './shared/line-chart/line-chart.component';
import { ColumnChartComponent } from './shared/column-chart/column-chart.component';
import { HeaderComponent } from './shared/header/header.component';
import { EventsComponent } from './pages/events/events.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { SitesComponent } from './pages/sites/sites.component';
import { AgGridModule } from 'ag-grid-angular';
import { EscalationPopupComponent } from './shared/escalation-popup/escalation-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { GroupsPopupComponent } from './shared/groups-popup/groups-popup.component';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// ✅ Register all AG Grid community modules (outside @NgModule)
ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [
   
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    HighchartsChartModule,
    AgGridModule,  // only once
    HttpClientModule
  ],
  providers: [],
  bootstrap: [] // <--- must specify root component
})
export class AppModule { }
