import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-escalation-popup',
  templateUrl: './escalation-popup.component.html',
  styleUrls: ['./escalation-popup.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    DialogModule,
    // Import necessary modules here if needed
  ],
})
export class EscalationPopupComponent {
  @Input() isVisible = false;
  @Input() selectedItem: any;
  @Input() selectedDate: Date | null = null;
  @Input() data: any; // escalationData

  @Output() close = new EventEmitter<void>();

onGridReady(params: any) {
  params.api.sizeColumnsToFit(); // fit to grid width
  // OR auto-size each column based on content:
  params.columnApi.autoSizeAllColumns();
}



  // Column Definitions
  columnDefs: ColDef[] = [
    {
      headerName: 'USER',
      field: 'user',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
      cellRenderer: this.userCellRenderer,
    },
    {
      headerName: 'LEVEL',
      field: 'level',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'RECEIVE AT',
      field: 'receiveAt',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'REVIEW START',
      field: 'reviewStart',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'REVIEW END',
      field: 'reviewEnd',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'DURATION',
      field: 'duration',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'ACTION',
      field: 'action',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'TAG',
      field: 'tag',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'NOTES',
      field: 'notes',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'END OF SHIFT',
      field: 'endOfShift',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
  ];

  // Default column behavior
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  // Row Data
  rowData = [
    {
      user: { img: 'https://i.pravatar.cc/30?img=1' },
      level: 'Team Member',
      receiveAt: '05:43:18',
      reviewStart: '05:44:16',
      reviewEnd: '05:44:18',
      duration: '0h 1m 0s',
      action: 'Escalation',
      tag: 'Vehicle Observed',
      notes: '18-04-2025 05:43:18',
      endOfShift: '',
    },
    {
      user: {  img: 'https://i.pravatar.cc/30?img=2' },
      level: 'Team Leader',
      receiveAt: '05:43:18',
      reviewStart: '05:44:16',
      reviewEnd: '05:44:18',
      duration: '0h 2m 55s',
      action: 'Escalation',
      tag: 'Intruder Observed',
      notes: '18-04-2025 05:43:18 Near the fence',
      endOfShift: '',
    },
    {
      user: { img: 'https://i.pravatar.cc/30?img=3' },
      level: 'Manager',
      receiveAt: '05:43:18',
      reviewStart: '05:44:16',
      reviewEnd: '05:44:18',
      duration: '0h 0m 12s',
      action: 'End Escalation',
      tag: 'Staff-No Notification',
      notes: 'RC',
      endOfShift: '✏️',
    },
  ];

  // Custom cell renderer for user (image + name)
  userCellRenderer(params: any) {
    if (params.value && params.value.img) {
      return `
        <div style="display:flex;align-items:center;gap:6px;">
          <img src="${params.value.img}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;"/>
        
        </div>
      `;
    }
    return params.value?.name || '';
  }
}
