import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry, } from 'ag-grid-community';

@Component({
  selector: 'app-groups-popup',
  templateUrl: './groups-popup.component.html',
  styleUrls: ['./groups-popup.component.css'],
   standalone: true,   // Make sure this component is standalone too
    imports: [  // ✅ Import the standalone component
      AgGridModule,
      FormsModule,
      MatNativeDateModule,
      MatDatepickerModule,
      
    ]
})
export class GroupsPopupComponent {
  @Input() isVisible = false;
  @Input() selectedItem: any;
  @Input() selectedDate: Date | null = null;
  @Input() data: any; // escalationData

  @Output() close = new EventEmitter<void>();

onGridReady(params: GridReadyEvent) {
  params.api.sizeColumnsToFit();
  setTimeout(() => {
    params.api.expandAll();
  }, 100);
}



  // Column Definitions
columnDefs: ColDef[] = [
  {
    headerName: 'SITE ID',
    field: 'siteId',
    // rowGroup: true,
    // hide: true, // Hide the column, only show as group header
  },
  {
    headerName: 'SITE NAME',
    field: 'siteName',
    cellClass: 'custom-cell',
  },
  {
    headerName: "CAMERA'S",
    field: 'cameras',
    cellClass: 'custom-cell',
  },
  {
    headerName: '',
    field: 'actions',
    cellRenderer: (params: any) => `<span style="cursor:pointer;">&#10006;</span>`, // X icon
    width: 60,
  },
];

  // Default column behavior
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  // Row Data
rowData = [
  { siteId: '01234567', siteName: 'Paradise - Tadepally', cameras: '8/12' },
  { siteId: '01234567', siteName: 'Paradise - Benz Circle', cameras: '8/12' },
  { siteId: '01234568', siteName: 'KFC - Tadepally', cameras: '6/6' },
  { siteId: '01234569', siteName: 'Pizzahut - Tadepally', cameras: '10/12' },
  { siteId: '01234565', siteName: 'Belgian waffle - Tadepally', cameras: '8/10' },
  // Add camera details as child rows if needed
];

  
}
