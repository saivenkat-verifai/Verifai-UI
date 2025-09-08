import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupsPopupComponent } from '../../shared/groups-popup/groups-popup.component';
import { AgGridModule } from 'ag-grid-angular';

interface SecondEscalatedDetail {
  label?: string;
  value: number;
  iconPath?: string;
  color: string;
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
   standalone: true,
  imports: [CommonModule, FormsModule, GroupsPopupComponent
    , AgGridModule
    
  ],
})
export class GroupsComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  private boundResize?: () => void;
  gridApi!: GridApi;
  private apiSub?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.selectedDate = new Date();
    this.loadGroups();
  }

  /** Search term for filtering */
  searchTerm: string = '';

  /** API Row Data */
  rowData: any[] = [];

  /** Escalated counts (updated dynamically) */
  secondEscalatedDetails: SecondEscalatedDetail[] = [];

  /** Popup handling */
  isPopupVisible = false;
  isTablePopupVisible = false;
  selectedItem: any = null;
  popupColumnDefs: ColDef[] = [];
  popupRowData: any[] = [];

  closePopup() {
    this.isPopupVisible = false;
    this.isTablePopupVisible = false;
  }

  /** Main table */
  selectedFilter: string = 'CLOSED';

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true },
    { headerName: 'NAME', field: 'name', sortable: true },
    { headerName: 'SITE', field: 'site' },
    { headerName: 'CAMERAS', field: 'cameras' },
    { headerName: 'EMPLOYEES', field: 'employees' },
    {
      headerName: 'STATUS',
      field: 'status',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
      cellRenderer: (params: any) => {
        const color = params.value === 'ACTIVE' ? '#53BF8B' : '#00000040';
        return `
          <span style="display:inline-flex; align-items:center; gap:6px;">
            <span style="display:inline-block; width:14px; height:14px; background:${color}; border-radius:50%;"></span>
          </span>
        `;
      },
    },
    {
      headerName: 'MORE',
      field: 'more',
      cellRenderer: () => `
        <span class="info-icon">
          <img src="assets/information-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Info"/>
        </span>
      `,
    },
  ];

  defaultColDef: ColDef = { resizable: true, filter: true };


  /** Load data from API */
  loadGroups() {
    this.apiSub = this.http
      .get<any>('http://usstaging.ivisecurity.com:8234/getGroupDetails')
      .subscribe({
        next: (res) => {
          if (res?.status === 'Success' && Array.isArray(res.groupData)) {
            // 👉 Map API response to table data
            this.rowData = res.groupData.map((g: any) => ({
              id: g.GroupId,
              name: g.GroupName,
              site: g.sites,
              cameras: g.cameras,
              employees: g.employees,
              status: g.status?.toUpperCase(),
              more: true,
            }));

            // 👉 Calculate counts
            const total = res.groupData.length;
            const active = res.groupData.filter(
              (g: any) => g.status?.toUpperCase() === 'ACTIVE'
            ).length;
            const inactive = res.groupData.filter(
              (g: any) => g.status?.toUpperCase() === 'INACTIVE'
            ).length;

            // 👉 Update summary cards
            this.secondEscalatedDetails = [
              { label: 'Total', value: total, color: '#f44336' },
              { label: 'Active', value: active, color: '#2196f3' },
              { label: 'Inactive', value: inactive, color: '#4caf50' },
            ];
          }
        },
        error: (err) => {
          console.error('Failed to load groups:', err);
        },
      });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    const resizeAll = () => {
      const ids = this.gridApi.getColumns()?.map((col) => col.getColId()) ?? [];
      this.gridApi.autoSizeColumns(ids, false);
      this.gridApi.sizeColumnsToFit();
    };
    setTimeout(resizeAll);
    this.boundResize = () => resizeAll();
    window.addEventListener('resize', this.boundResize);
    this.gridApi.addEventListener('firstDataRendered', resizeAll);
  }

  /** Search filter */
  onSearchChange() {
    if (this.gridApi) {
       (this.gridApi as any).setQuickFilter(this.searchTerm);
    }
  }

  onCellClicked(event: any) {
    if (event.colDef.field === 'more') {
      const target = event.event.target as HTMLElement;
      if (target.closest('.info-icon')) {
        this.isTablePopupVisible = true;
        this.selectedItem = event.data;
      }
    }
  }


  formatDateTime(dateStr: string) {
    const d = new Date(dateStr);
    return d
      .toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short',
      })
      .replace('GMT', 'CT');
  }

  localeText = {
    sortAscending: '',
    sortDescending: '',
    sortUnSort: '',
    columnMenu: '',
    ariaLabelSortAscending: '',
    ariaLabelSortDescending: '',
    ariaLabelSortNone: '',
    ariaLabelColumnMenu: '',
  };

  ngOnDestroy() {
    if (this.boundResize) {
      window.removeEventListener('resize', this.boundResize);
    }
    if (this.apiSub) {
      this.apiSub.unsubscribe();
    }
  }
}
