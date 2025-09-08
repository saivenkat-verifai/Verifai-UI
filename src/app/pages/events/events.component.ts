import { Component, OnInit } from '@angular/core';
import { ESCALATED_COLORS } from 'src/app/shared/constants/chart-colors';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { EscalationPopupComponent } from '../../shared/escalation-popup/escalation-popup.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// ✅ Register all AG Grid community modules (outside @NgModule)
ModuleRegistry.registerModules([AllCommunityModule]);

/** Icon data interface for popup cards */
interface IconData {
  iconPath: string;
  count: number;
}

/** Interface for icons inside dashboard cards */
interface CardIcon {
  iconPath: string;
  count: number;
}

/** Dashboard card data structure */
interface DashboardCard {
  title: string;
  value: number;
  percentage?: number; // optional for circle chart representation
  color: string; // background or primary color
  labelColor?: string; // optional label text color
  icons: CardIcon[];
}

/** Escalated detail data structure */
interface EscalatedDetail {
  label: string;
  value: number;
  color: string;
}

/** Second escalated detail, can be a label or icon */
interface SecondEscalatedDetail {
  label?: string; // present for the first item, else icon is used
  value: number;
  iconPath?: string; // used if no label
  color: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
   standalone: true,   // Make sure this component is standalone too
  imports: [
    CommonModule,
    EscalationPopupComponent,  // ✅ Import the standalone component
    AgGridModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    
  ]
})
export class EventsComponent implements OnInit {
  /** Date handling */
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  private boundResize?: () => void;
  /** Event counts */
  totalEvents = 37000;
  falseEvents = 33250;
  escalated = 1750;
  pending = 2000;
  gridApi!: GridApi;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    const resizeAll = () => {
      const ids = this.gridApi.getColumns()?.map((col) => col.getColId()) ?? [];

      // 1️⃣ fit columns to content
      this.gridApi.autoSizeColumns(ids, false);

      // 2️⃣ stretch columns so grid fills the width
      this.gridApi.sizeColumnsToFit();
    };

    // Initial resize after grid renders
    setTimeout(resizeAll);

    // Resize when window changes
    this.boundResize = () => resizeAll();
    window.addEventListener('resize', this.boundResize);

    // Resize after first data render
    this.gridApi.addEventListener('firstDataRendered', resizeAll);
  }

  ngOnDestroy() {
    if (this.boundResize) {
      window.removeEventListener('resize', this.boundResize);
    }
  }

  /** Mapping icon paths to their labels for popup headings */
  iconLabelMap: { [key: string]: string } = {
    'assets/home.svg': 'SITE EVENTS',
    'assets/cam.svg': 'CAMERA EVENTS',
    'assets/direction.svg': 'GROUP EVENTS',
    'assets/moniter.svg': 'MONITER EVENTS',
  };

  /** Get icon label from the icon path */
  getIconLabel(iconPath: string | undefined): string {
    if (!iconPath) return '';
    return this.iconLabelMap[iconPath] || '';
  }

  /** Dashboard card data */
  dashboardCards: DashboardCard[] = [
    {
      title: 'Total Events',
      value: this.totalEvents,
      color: 'red',
      icons: [
        { iconPath: 'assets/home.svg', count: 300 },
        { iconPath: 'assets/cam.svg', count: 1500 },
        { iconPath: 'assets/direction.svg', count: 300 },
        { iconPath: 'assets/moniter.svg', count: 1500 },
      ],
    },
    {
      title: 'False',
      value: this.falseEvents,
      percentage: 88,
      color: 'white',
      icons: [
        { iconPath: 'assets/home.svg', count: 300 },
        { iconPath: 'assets/cam.svg', count: 1500 },
        { iconPath: 'assets/direction.svg', count: 10 },
        { iconPath: 'assets/moniter.svg', count: 40 },
      ],
    },
    {
      title: 'Escalated',
      value: this.escalated,
      percentage: 5,
      color: 'white',
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
        { iconPath: 'assets/direction.svg', count: 8 },
        { iconPath: 'assets/moniter.svg', count: 30 },
      ],
    },
    {
      title: 'Pending',
      value: this.pending,
      percentage: 7,
      color: 'white',
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
        { iconPath: 'assets/direction.svg', count: 300 },
        { iconPath: 'assets/moniter.svg', count: 1500 },
      ],
    },
  ];

  /** First escalated details section */
  escalatedDetails: EscalatedDetail[] = [
    { label: 'Missed', value: 1500, color: ESCALATED_COLORS[0] },
    { label: 'Suspicious', value: 200, color: ESCALATED_COLORS[1] },
    { label: 'Deterred', value: 30, color: ESCALATED_COLORS[2] },
    { label: 'Intervention', value: 10, color: ESCALATED_COLORS[3] },
    { label: 'Arrest', value: 6, color: ESCALATED_COLORS[4] },
    { label: 'Information', value: 5, color: ESCALATED_COLORS[5] },
    { label: 'Information', value: 5, color: ESCALATED_COLORS[5] },
  ];

  /** Second escalated section - can have label or icon */
  secondEscalatedDetails: SecondEscalatedDetail[] = [
    { label: 'Total', value: 1500, color: ESCALATED_COLORS[0] },
    { iconPath: 'assets/home.svg', value: 200, color: ESCALATED_COLORS[1] },
    { iconPath: 'assets/cam.svg', value: 30, color: ESCALATED_COLORS[2] },
    { iconPath: 'assets/direction.svg', value: 10, color: ESCALATED_COLORS[3] },
    { iconPath: 'assets/moniter.svg', value: 6, color: ESCALATED_COLORS[4] },
  ];

  /** Search term for filtering second escalated section */
  searchTerm: string = '';

  /** Filter logic for search bar */
  get filteredDetails() {
    return this.secondEscalatedDetails.filter((e) => {
      const text = e.label || '';
      return text.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  /** Chart data for escalated section */
  escalatedGraph = [
    { label: 'Missed', value: 1500, height: 85 },
    { label: 'Suspicious', value: 200, height: 45 },
    { label: 'Deterred', value: 30, height: 20 },
    { label: 'Intervention', value: 10, height: 10 },
    { label: 'Arrest', value: 5, height: 5 },
    { label: 'Information', value: 5, height: 5 },
  ];

  /** Comparison graph data */
  compareGraph = [
    { label: 'Missed', current: 1500, previous: 1150 },
    { label: 'Suspicious', current: 200, previous: 450 },
    { label: 'Deterred', current: 30, previous: 60 },
    { label: 'Intervention', current: 10, previous: 30 },
    { label: 'Arrest', current: 5, previous: 5 },
    { label: 'Information', current: 5, previous: 5 },
  ];

  /** Utility for circular gradient percentage chart */
  getCircleGradient(percent: number): string {
    const deg = percent * 3.6; // convert % to degrees
    return `conic-gradient(#e53935 ${deg}deg, #fce4ec 0deg)`;
  }

  /** Popup handling */
  isPopupVisible = false;
  selectedItem: any = null;

  /** Configurations for each popup table */
  tableConfigs: { [key: string]: { rowData: any[]; columnDefs: ColDef[] } } = {
    'assets/home.svg': {
      columnDefs: [
        {
          headerName: 'CAMERA NAME',
          field: 'cameraName',
          width: 200,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'FL',
          field: 'Fl',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'MS',
          field: 'Ms',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'SS',
          width: 100,
          field: 'Ss',
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'DT',
          field: 'Dt',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'IT',
          field: 'It',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'AR',
          field: 'Ar',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'IN',
          field: 'In',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
      ],
      rowData: [
        {
          cameraName: 'Cam 01 - Entrance',
          Fl: '1',
          Ms: '2',
          Ss: '5',
          Dt: '7',
          It: '9',
          Ar: '10',
          In: '16',
        },
        {
          cameraName: 'Cam 02 - Lobby',
          Fl: '6',
          Ms: '4',
          Ss: '7',
          Dt: '0',
          It: '1',
          Ar: '6',
          In: '0',
        },
        {
          cameraName: 'Cam 03 - Parking Lot',
          Fl: '6',
          Ms: '1',
          Ss: '4',
          Dt: '0',
          It: '7',
          Ar: '9',
          In: '7',
        },
        {
          cameraName: 'Cam 04 - Cash Counter',
          Fl: '9',
          Ms: '4',
          Ss: '8',
          Dt: '7',
          It: '0',
          Ar: '0',
          In: '6',
        },
      ],
    },
    'assets/cam.svg': {
      columnDefs: [
        {
          headerName: 'CAMERA NAME',
          field: 'cameraName',
          width: 200,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'FL',
          field: 'Fl',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'MS',
          field: 'Ms',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'SS',
          field: 'Ss',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'DT',
          field: 'Dt',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'IT',
          field: 'It',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'AR',
          field: 'Ar',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
        {
          headerName: 'IN',
          field: 'In',
          width: 100,
          headerClass: 'custom-header',
          cellClass: 'custom-cell',
        },
      ],
      rowData: [
        {
          cameraName: 'Cam 01 - Entrance',
          Fl: '1',
          Ms: '2',
          Ss: '5',
          Dt: '7',
          It: '9',
          Ar: '10',
          In: '16',
        },
        {
          cameraName: 'Cam 02 - Lobby',
          Fl: '6',
          Ms: '4',
          Ss: '7',
          Dt: '0',
          It: '1',
          Ar: '6',
          In: '0',
        },
        {
          cameraName: 'Cam 03 - Parking Lot',
          Fl: '6',
          Ms: '1',
          Ss: '4',
          Dt: '0',
          It: '7',
          Ar: '9',
          In: '7',
        },
        {
          cameraName: 'Cam 04 - Cash Counter',
          Fl: '9',
          Ms: '4',
          Ss: '8',
          Dt: '7',
          It: '0',
          Ar: '0',
          In: '6',
        },
      ],
    },
    'assets/direction.svg': {
      columnDefs: [
        { headerName: 'Group ID', field: 'groupId' },
        { headerName: 'Description', field: 'desc' },
      ],
      rowData: [
        { groupId: 'G1', desc: 'Group Alpha' },
        { groupId: 'G2', desc: 'Group Beta' },
      ],
    },
    'assets/moniter.svg': {
      columnDefs: [
        { headerName: 'Monitor ID', field: 'monitorId' },
        { headerName: 'Health', field: 'health' },
      ],
      rowData: [
        { monitorId: 'M1', health: 'OK' },
        { monitorId: 'M2', health: 'Warning' },
      ],
    },
  };

  /** Popup-specific AG Grid data */
  popupColumnDefs: ColDef[] = [];
  popupRowData: any[] = [];

  /** Open popup for clicked icon */
  openPopup(item: any) {
    this.selectedItem = item;
    const config = this.tableConfigs[item.iconPath] || {
      columnDefs: [],
      rowData: [],
    };
    this.popupColumnDefs = config.columnDefs;
    this.popupRowData = config.rowData;
    this.isPopupVisible = true;
  }

  /** Close popup */
  closePopup() {
    this.isPopupVisible = false;
      this.isTablePopupVisible = false;
  }

/** Handle popup close on outside click */
escalationData = {
  escalationId: '1234567',
  ticketNo: '—',
  siteName: 'KFC - Tadepally',
  cameraName: 'MDX712 - Cam01',
  eventTimeCT: '18-04-2025 05:43:18',
  eventTimeCustomer: '18-04-2025 05:43:18',
  eventTimeIN: '18-04-2025 16:13:18',
  type: 'Escalation',
  city: 'Tadepally',
  totalDuration: 'oh 20m 18s',
  indiaDuration: 'oh 7m 27s',
  usDuration: 'oh 1m 20s',
  alarmEvents: [
    { time: '18-04-2025 05:44:16', userImg: 'assets/user1.png', status: 'Success' },
    { time: '18-04-2025 05:49:16', userImg: 'assets/user2.png', status: 'Success' },
    { time: '18-04-2025 05:54:16', userImg: 'assets/user2.png', status: 'Success' },
  ],
  report: [
    {
      userImg: 'assets/user1.png',
      user: 'Team Member',
      level: 'Team Member',
      receiveAt: '05:43:18',
      reviewStart: '05:44:16',
      reviewEnd: '05:44:18',
      duration: 'Oh 1m 0s',
      action: 'Escalation',
      tag: 'Vehicle Observed',
      notes: '18-04-2025 05:43:18',
      endOfShift: ''
    },
    {
      userImg: 'assets/user2.png',
      user: 'Team Leader',
      level: 'Team Leader',
      receiveAt: '05:43:18',
      reviewStart: '05:44:16',
      reviewEnd: '05:44:18',
      duration: 'Oh 2m 55s',
      action: 'Escalation',
      tag: 'Intruder Observed',
      notes: 'Near the fence',
      endOfShift: ''
    },
    {
      userImg: 'assets/user2.png',
      user: 'Manager',
      level: 'Manager',
      receiveAt: '05:43:18',
      reviewStart: '05:44:16',
      reviewEnd: '05:44:18',
      duration: 'Oh 0m 12s',
      action: 'End Escalation',
      tag: 'Staff-No Notification',
      notes: 'RC',
      endOfShift: ''
    }
  ]
};

/** Close popup when clicking outside */


  /** Main table filter handling */
  selectedFilter: string = 'CLOSED'; // default

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  /** Calendar popup handling */
  isCalendarPopupOpen = false;
  openCalendarPopup() {
    this.isCalendarPopupOpen = true;
  }
  closeCalendarPopup() {
    this.isCalendarPopupOpen = false;
  }
  openCalendar(): void {
    this.openCalendarPopup();
  }

  /** Change calendar date by offset days */
  changeDate(offset: number) {
    if (this.selectedDate) {
      const updatedDate = new Date(this.selectedDate);
      updatedDate.setDate(updatedDate.getDate() + offset);
      this.selectedDate = updatedDate;
    }
  }

  /** Set calendar to today */
  setToday(): void {
    this.currentDate = new Date();
    this.selectedDate = this.currentDate;
  }

  isTablePopupVisible = false;  
  /** On selecting a date in popup calendar */
  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.closeCalendarPopup();
  }
  /** Open popup for clicked icon */
  tableopenPopup(item: any) {
    console.log('Opening popup for item:', item);
    this.selectedItem = item;

 this.isTablePopupVisible = true;
  }

  

  onCellClicked(event: any) {
    console.log('Cell clicked:', event);
    if (event.colDef.field === 'more') {
      const target = event.event.target as HTMLElement;
      if (target.closest('.info-icon')) {
        this.tableopenPopup(event.data); // open popup with row data
      }
    }
  }
  /** AG Grid column definitions for main table */
  columnDefs: ColDef[] = [
    {
      headerName: 'ID',
      field: 'id',
      floatingFilter: true,
      filter: true,
       suppressHeaderMenuButton: true,
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'SITE',
      field: 'site',
      floatingFilter: true,
      filter: true,
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'DEVICE',
      field: 'device',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'CAMERA',
      field: 'camera',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'CITY',
      field: 'city',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'DATE & TIME',
      field: 'dateTime',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
      valueFormatter: (params) => this.formatDateTime(params.value),
    },
    {
      headerName: 'ACTION TAG',
      field: 'actionTag',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
    },
    {
      headerName: 'EMP.',
      field: 'employee',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
      cellRenderer: (params: any) => {
        return `<img src="${params.value.avatar}" style="width:30px; height:30px; border-radius:50%;" alt="Emp"/>`;
      },
    },
    {
      headerName: 'ALERT TYPE',
      field: 'alertType',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
      cellRenderer: () =>
        `<span style="display:inline-block; width:14px; height:14px; background:green; border-radius:50%;"></span>`,
    },
    {
      headerName: 'MORE',
      field: 'more',
      headerClass: 'custom-header',
      cellClass: 'custom-cell',
      cellRenderer: () => `
    <span style="margin-right:8px;">
      <img src="assets/play-circle-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Play"/>
    </span>
    <span class="info-icon">
      <img src="assets/information-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Info"/>
    </span>
  `,
    },
  ];


  
  
  
  // pendingColumnDefs: ColDef[] = [
  //   {
  //     headerName: 'IDs',
  //     field: 'id',
  //     sortable: true,
  //     headerClass: 'custom-header',
  //     cellClass: 'custom-cell',
  //   },
  //   {
  //     headerName: 'SITE',
  //     field: 'site',
  //     sortable: true,
  //     headerClass: 'custom-header',
  //     cellClass: 'custom-cell',
  //   },
  //   {
  //     headerName: 'DEVICE',
  //     field: 'device',
  //     headerClass: 'custom-header',
  //     cellClass: 'custom-cell',
  //   },
  //   {
  //     headerName: 'CAMERA',
  //     field: 'camera',
  //     headerClass: 'custom-header',
  //     cellClass: 'custom-cell',
  //   },
  //   {
  //     headerName: 'CITY',
  //     field: 'city',
  //     headerClass: 'custom-header',
  //     cellClass: 'custom-cell',
  //   },
  //   {
  //     headerName: 'DATE & TIME',
  //     field: 'dateTime',
  //     sortable: true,
  //     headerClass: 'custom-header',
  //     cellClass: 'custom-cell',
  //     valueFormatter: (params) => this.formatDateTime(params.value),
  //   },
  //   {
  //     headerName: 'ACTION TAG',
  //     field: 'actionTag',
  //     headerClass: 'custom-header',
  //     cellClass: 'custom-cell',
  //   },
  //   {
  //     headerName: 'EMP.',
  //     field: 'employee',
  //     headerClass: 'custom-header',
  //     cellClass: 'custom-cell',
  //     cellRenderer: (params: any) => {
  //       return `<img src="${params.value.avatar}" style="width:30px; height:30px; border-radius:50%;" alt="Emp"/>`;
  //     },
  //   },
  //   {
  //     headerName: 'MORE',
  //     field: 'more',
  //     headerClass: 'custom-header',
  //     cellClass: 'custom-cell',
  //     cellRenderer: () => `
  //       <span style="margin-right:8px;"><img src="assets/play-circle-icon.svg" style="width:20px; height:20px;" alt="Play"/></span>
  //      <span class="info-icon">
  //     <img src="assets/information-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Info"/>
  //   </span>
  //     `,
  //   },
  // ];

pendingColumnDefs: ColDef[] = [
  { headerName: 'IDs', field: 'id', sortable: true, headerClass: 'custom-header', cellClass: 'custom-cell' },
  { headerName: 'SITE', field: 'site', sortable: true, headerClass: 'custom-header', cellClass: 'custom-cell' },
  { headerName: 'DEVICE', field: 'device', headerClass: 'custom-header', cellClass: 'custom-cell' },
  { headerName: 'CAMERA', field: 'camera', headerClass: 'custom-header', cellClass: 'custom-cell' },
  { headerName: 'CITY', field: 'city', headerClass: 'custom-header', cellClass: 'custom-cell' },
  {
    headerName: 'DATE & TIME',
    field: 'dateTime',
    sortable: true,
    headerClass: 'custom-header',
    cellClass: 'custom-cell',
    valueFormatter: (params) => this.formatDateTime(params.value),
  },
  { headerName: 'ACTION TAG', field: 'actionTag', headerClass: 'custom-header', cellClass: 'custom-cell' },
  {
    headerName: 'EMP.',
    field: 'employee',
    headerClass: 'custom-header',
    cellClass: 'custom-cell',
    cellRenderer: (params: any) => {
      return `<img src="${params.value.avatar}" style="width:30px; height:30px; "  class="avatar-img" alt="Emp"/>`;
    },
  },
  {
    headerName: 'MORE',
    field: 'more',
    headerClass: 'custom-header',
    cellClass: 'custom-cell',
    cellRenderer: () => `
      <img src="assets/play-circle-icon.svg" class="more-icon" alt="Play"/>
      <img src="assets/information-icon.svg" class="more-icon" alt="Info"/>
    `,
  },
];

  pendingRowData = [
    {
      id: '1234567',
      site: 'KFC - Tadepally',
      device: 'MDX712',
      camera: 'Cam 01',
      city: 't',
      dateTime: '2025-07-31T19:05:18',
      actionTag: 'Some Tag',
      employee: { avatar: 'assets/user1.png' },
      more: true,
    },
    { id: '1234568', site: 'KFC - Benz Circle', device: 'MDX713', camera: 'Cam 02', city: 'Benz Circle', dateTime: '2025-07-30T14:15:00', actionTag: 'Another Tag', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234569', site: 'KFC - MG Road', device: 'MDX714', camera: 'Cam 03', city: 'MG Road', dateTime: '2025-07-29T09:30:45', actionTag: 'Tag 3', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234570', site: 'KFC - Jubilee Hills', device: 'MDX715', camera: 'Cam 04', city: 'Jubilee Hills', dateTime: '2025-07-28T20:20:20', actionTag: 'Tag 4', employee: { avatar: 'assets/user1.png' }, more: true },
    { id: '1234571', site: 'KFC - Hitech City', device: 'MDX716', camera: 'Cam 05', city: 'Hitech City', dateTime: '2025-07-27T11:11:11', actionTag: 'Tag 5', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234572', site: 'KFC - Gachibowli', device: 'MDX717', camera: 'Cam 06', city: 'Gachibowli', dateTime: '2025-07-26T16:45:30', actionTag: 'Tag 6', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234573', site: 'KFC - Kondapur', device: 'MDX718', camera: 'Cam 07', city: 'Kondapur', dateTime: '2025-07-25T08:00:00', actionTag: 'Tag 7', employee: { avatar: 'assets/user1.png' }, more: true },
    { id: '1234574', site: 'KFC - Miyapur', device: 'MDX719', camera: 'Cam 08', city: 'Miyapur', dateTime: '2025-07-24T13:25:50', actionTag: 'Tag 8', employee: { avatar: 'assets/user2.png'}, more: true },
    { id: '1234575', site: 'KFC - Ameerpet', device: 'MDX720', camera: 'Cam 09', city: 'Ameerpet', dateTime: '2025-07-23T17:55:05', actionTag: 'Tag 9', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234576', site: 'KFC - Secunderabad', device: 'MDX721', camera: 'Cam 10', city: 'Secunderabad', dateTime: '2025-07-22T12:10:10', actionTag: 'Tag 10', employee: { avatar: 'assets/user1.png' }, more: true },
    { id: '1234577', site: 'KFC - Charminar', device: 'MDX722', camera: 'Cam 11', city: 'Charminar', dateTime: '2025-07-21T15:35:25', actionTag: 'Tag 11', employee: { avatar: 'assets/user2.png' }, more: true },
    
    // ...repeat for other rows
  ];

  /** Default column definition for AG Grid */
  defaultColDef: ColDef = { resizable: true, };
// 1. Tell AG Grid the hierarchy path
getDataPath = (data: any) => {
  return [data.city, data.site, data.device, data.camera];
};

// 2. Setup the Auto Group Column
autoGroupColumnDef = {
  headerName: 'Hierarchy',
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: any) => {
      return params.value; // just show the level name
    }
  }
};

  /** Sample row data for AG Grid */
  rowData = [
    {
      id: '1234567',
      site: 'KFC - Tadepally',
      device: 'MDX712',
      camera: 'Cam 01',
      city: 'Tadepally',
      dateTime: '2025-07-31T19:05:18',
      actionTag: 'Some Tag',
      employee: { avatar: 'assets/user1.png' },
      alertType: true,
      more: true,
    },
       { id: '1234568', site: 'KFC - Benz Circle', device: 'MDX713', camera: 'Cam 02', city: 'Benz Circle', dateTime: '2025-07-30T14:15:00', actionTag: 'Another Tag', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234569', site: 'KFC - MG Road', device: 'MDX714', camera: 'Cam 03', city: 'MG Road', dateTime: '2025-07-29T09:30:45', actionTag: 'Tag 3', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234570', site: 'KFC - Jubilee Hills', device: 'MDX715', camera: 'Cam 04', city: 'Jubilee Hills', dateTime: '2025-07-28T20:20:20', actionTag: 'Tag 4', employee: { avatar: 'assets/user1.png' }, more: true },
    { id: '1234571', site: 'KFC - Hitech City', device: 'MDX716', camera: 'Cam 05', city: 'Hitech City', dateTime: '2025-07-27T11:11:11', actionTag: 'Tag 5', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234572', site: 'KFC - Gachibowli', device: 'MDX717', camera: 'Cam 06', city: 'Gachibowli', dateTime: '2025-07-26T16:45:30', actionTag: 'Tag 6', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234573', site: 'KFC - Kondapur', device: 'MDX718', camera: 'Cam 07', city: 'Kondapur', dateTime: '2025-07-25T08:00:00', actionTag: 'Tag 7', employee: { avatar: 'assets/user1.png' }, more: true },
    { id: '1234574', site: 'KFC - Miyapur', device: 'MDX719', camera: 'Cam 08', city: 'Miyapur', dateTime: '2025-07-24T13:25:50', actionTag: 'Tag 8', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234575', site: 'KFC - Ameerpet', device: 'MDX720', camera: 'Cam 09', city: 'Ameerpet', dateTime: '2025-07-23T17:55:05', actionTag: 'Tag 9', employee: { avatar: 'assets/user2.png' }, more: true },
    { id: '1234576', site: 'KFC - Secunderabad', device: 'MDX721', camera: 'Cam 10', city: 'Secunderabad', dateTime: '2025-07-22T12:10:10', actionTag: 'Tag 10', employee: { avatar: 'assets/user1.png' }, more: true },
    { id: '1234577', site: 'KFC - Charminar', device: 'MDX722', camera: 'Cam 11', city: 'Charminar', dateTime: '2025-07-21T15:35:25', actionTag: 'Tag 11', employee: { avatar: 'assets/user2.png' }, more: true },
    
    // ...repeat for other rows
  ];

  /** Format datetime to 'MM/DD/YYYY HH:mm:ss TZ' */
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

  /** AG Grid locale customization to remove tooltips and ARIA labels */
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

  /** Lifecycle hook */
  ngOnInit() {
    this.selectedDate = new Date();
  }
}
