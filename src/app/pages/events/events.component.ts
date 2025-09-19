import { Component, OnInit } from "@angular/core";
import { ESCALATED_COLORS } from "src/app/shared/constants/chart-colors";
import { GridApi, GridReadyEvent, ColDef } from "ag-grid-community";
import { CommonModule } from "@angular/common";
import { EscalationPopupComponent } from "../../shared/escalation-popup/escalation-popup.component";
import { AgGridModule } from "ag-grid-angular";
import { FormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { EventsService } from "./events.service";

import { CalendarComponent } from "src/app/shared/calendar/calendar.component";

import { QuickFilterModule } from "ag-grid-community";
// Register module
ModuleRegistry.registerModules([QuickFilterModule]);
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

/** Dot card structure for escalated details */
interface CardDot {
  iconcolor: string;
  count: number;
}

/** Escalated detail data structure */
interface EscalatedDetail {
  label: string;
  value: number;
  color: string;
  icons?: IconData[]; // optional for icons inside cards
  colordot?: CardDot[]; // optional for dot-cards
}

/** Second escalated detail, can be a label or icon */
interface SecondEscalatedDetail {
  label?: string;
  value?: number;
  iconPath?: string;
  color?: string;
  iconcolor?: string; // 👈 for dot-cards
}

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.css"],
  standalone: true, // Make sure this component is standalone too
  imports: [
    CommonModule,
    EscalationPopupComponent, // ✅ Import the standalone component
    AgGridModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    CalendarComponent
  ],
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
  showMore: boolean = false;
  constructor(private eventsService: EventsService) {}

  gridColumnApi: any;

  /** Lifecycle hook */
  ngOnInit() {
    this.selectedDate = new Date();
    if (this.selectedFilter === "CLOSED") {
      this.loadClosedEvents();
    }
    this.loadsecondEscalatedDetails(); // 👈 load API data here
  }

  toggleMore() {
    this.showMore = !this.showMore;
  }

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
    window.addEventListener("resize", this.boundResize);

    // Resize after first data render
    this.gridApi.addEventListener("firstDataRendered", resizeAll);
  }

  ngOnDestroy() {
    if (this.boundResize) {
      window.removeEventListener("resize", this.boundResize);
    }
  }

  onFilterTextBoxChanged() {
    if (this.gridApi) {
      this.gridApi.setGridOption("quickFilterText", this.searchTerm);
    }
  }

// Matcher for CLOSED table
closedQuickFilterMatcher = (quickFilterParts: string[], rowText: string) => {
  // You can customize rowText if you want only certain columns to be searched
  return quickFilterParts.every((part) => {
    const regex = new RegExp(part, 'i'); // case-insensitive
    return regex.test(rowText);
  });
};

// Matcher for PENDING table
pendingQuickFilterMatcher = (quickFilterParts: string[], rowText: string) => {
  return quickFilterParts.every((part) => {
    const regex = new RegExp(part, 'i');
    return regex.test(rowText);
  });
};

  

  /** Mapping icon paths to their labels for popup headings */
  iconLabelMap: { [key: string]: string } = {
    "assets/home.svg": "SITE EVENTS",
    "assets/cam.svg": "CAMERA EVENTS",
    "assets/direction.svg": "GROUP EVENTS",
    "assets/moniter.svg": "MONITER EVENTS",
  };

  /** Get icon label from the icon path */
  getIconLabel(iconPath: string | undefined): string {
    if (!iconPath) return "";
    return this.iconLabelMap[iconPath] || "";
  }

  escalatedDetails: EscalatedDetail[] = [
    {
      label: "False",
      value: 1500,
      color: ESCALATED_COLORS[0],
      icons: [
        { iconPath: "assets/home.svg", count: 300 },
        { iconPath: "assets/cam.svg", count: 1500 },
      ],
      colordot: [
        { iconcolor: "#FF0000", count: 12 },
        { iconcolor: "#00FF00", count: 7 },
      ],
    },
    {
      label: "Escalated",
      value: 1500,
      color: ESCALATED_COLORS[0],
      icons: [
        { iconPath: "assets/home.svg", count: 300 },
        { iconPath: "assets/cam.svg", count: 1500 },
      ],
      colordot: [
        { iconcolor: "#FF0000", count: 12 },
        { iconcolor: "#00FF00", count: 7 },
      ],
    },
    {
      label: "Arrest",
      value: 1500,
      color: ESCALATED_COLORS[0],
      icons: [
        { iconPath: "assets/home.svg", count: 300 },
        { iconPath: "assets/cam.svg", count: 1500 },
      ],
      colordot: [
        { iconcolor: "#FF0000", count: 12 },
        { iconcolor: "#00FF00", count: 7 },
      ],
    },
    {
      label: "Intervention",
      value: 1500,
      color: ESCALATED_COLORS[0],
      icons: [
        { iconPath: "assets/home.svg", count: 300 },
        { iconPath: "assets/cam.svg", count: 1500 },
      ],
      colordot: [
        { iconcolor: "#FF0000", count: 12 },
        { iconcolor: "#00FF00", count: 7 },
      ],
    },
    {
      label: "Diterred",
      value: 1500,
      color: ESCALATED_COLORS[0],
      icons: [
        { iconPath: "assets/home.svg", count: 300 },
        { iconPath: "assets/cam.svg", count: 1500 },
      ],
      colordot: [
        { iconcolor: "#FF0000", count: 12 },
        { iconcolor: "#00FF00", count: 7 },
      ],
    },
    {
      label: "Missed Event",
      value: 1500,
      color: ESCALATED_COLORS[0],
      icons: [
        { iconPath: "assets/home.svg", count: 300 },
        { iconPath: "assets/cam.svg", count: 1500 },
      ],
      colordot: [
        { iconcolor: "#FF0000", count: 12 },
        { iconcolor: "#00FF00", count: 7 },
      ],
    },
    {
      label: "Information",
      value: 1500,
      color: ESCALATED_COLORS[0],
      icons: [
        { iconPath: "assets/home.svg", count: 300 },
        { iconPath: "assets/cam.svg", count: 1500 },
      ],
      colordot: [
        { iconcolor: "#FF0000", count: 12 },
        { iconcolor: "#00FF00", count: 7 },
      ],
    },
    // ...other cards
  ];

  /** Search term for filtering second escalated section */


  /** Filter logic for search bar */
  get filteredDetails() {
    return this.secondEscalatedDetails.filter((e) => {
      const text = e.label || "";
      return text.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  /** Chart data for escalated section */
  escalatedGraph = [
    { label: "Missed", value: 1500, height: 85 },
    { label: "Suspicious", value: 200, height: 45 },
    { label: "Deterred", value: 30, height: 20 },
    { label: "Intervention", value: 10, height: 10 },
    { label: "Arrest", value: 5, height: 5 },
    { label: "Information", value: 5, height: 5 },
  ];

  /** Comparison graph data */
  compareGraph = [
    { label: "Missed", current: 1500, previous: 1150 },
    { label: "Suspicious", current: 200, previous: 450 },
    { label: "Deterred", current: 30, previous: 60 },
    { label: "Intervention", current: 10, previous: 30 },
    { label: "Arrest", current: 5, previous: 5 },
    { label: "Information", current: 5, previous: 5 },
  ];

  /** Utility for circular gradient percentage chart */
  getCircleGradient(percent: number): string {
    const deg = percent * 3.6; // convert % to degrees
    return `conic-gradient(#e53935 ${deg}deg, #fce4ec 0deg)`;
  }

  /** Popup handling */
  isPopupVisible = false;
  selectedItem: any = null;
  isPlayPopupVisible = false;
  selectedPlayItem: any = null;

  /** Configurations for each popup table */
  tableConfigs: { [key: string]: { rowData: any[]; columnDefs: ColDef[] } } = {
    "assets/home.svg": {
      columnDefs: [
        {
          headerName: "CAMERA NAME",
          field: "cameraName",
          width: 200,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "FL",
          field: "Fl",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "MS",
          field: "Ms",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "SS",
          width: 100,
          field: "Ss",
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "DT",
          field: "Dt",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "IT",
          field: "It",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "AR",
          field: "Ar",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "IN",
          field: "In",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
      ],
      rowData: [
        {
          cameraName: "Cam 01 - Entrance",
          Fl: "1",
          Ms: "2",
          Ss: "5",
          Dt: "7",
          It: "9",
          Ar: "10",
          In: "16",
        },
        {
          cameraName: "Cam 02 - Lobby",
          Fl: "6",
          Ms: "4",
          Ss: "7",
          Dt: "0",
          It: "1",
          Ar: "6",
          In: "0",
        },
        {
          cameraName: "Cam 03 - Parking Lot",
          Fl: "6",
          Ms: "1",
          Ss: "4",
          Dt: "0",
          It: "7",
          Ar: "9",
          In: "7",
        },
        {
          cameraName: "Cam 04 - Cash Counter",
          Fl: "9",
          Ms: "4",
          Ss: "8",
          Dt: "7",
          It: "0",
          Ar: "0",
          In: "6",
        },
      ],
    },
    "assets/cam.svg": {
      columnDefs: [
        {
          headerName: "CAMERA NAME",
          field: "cameraName",
          width: 200,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "FL",
          field: "Fl",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "MS",
          field: "Ms",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "SS",
          field: "Ss",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "DT",
          field: "Dt",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "IT",
          field: "It",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "AR",
          field: "Ar",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
        {
          headerName: "IN",
          field: "In",
          width: 100,
          headerClass: "custom-header",
          cellClass: "custom-cell",
        },
      ],
      rowData: [
        {
          cameraName: "Cam 01 - Entrance",
          Fl: "1",
          Ms: "2",
          Ss: "5",
          Dt: "7",
          It: "9",
          Ar: "10",
          In: "16",
        },
        {
          cameraName: "Cam 02 - Lobby",
          Fl: "6",
          Ms: "4",
          Ss: "7",
          Dt: "0",
          It: "1",
          Ar: "6",
          In: "0",
        },
        {
          cameraName: "Cam 03 - Parking Lot",
          Fl: "6",
          Ms: "1",
          Ss: "4",
          Dt: "0",
          It: "7",
          Ar: "9",
          In: "7",
        },
        {
          cameraName: "Cam 04 - Cash Counter",
          Fl: "9",
          Ms: "4",
          Ss: "8",
          Dt: "7",
          It: "0",
          Ar: "0",
          In: "6",
        },
      ],
    },
    "assets/direction.svg": {
      columnDefs: [
        { headerName: "Group ID", field: "groupId" },
        { headerName: "Description", field: "desc" },
      ],
      rowData: [
        { groupId: "G1", desc: "Group Alpha" },
        { groupId: "G2", desc: "Group Beta" },
      ],
    },
    "assets/moniter.svg": {
      columnDefs: [
        { headerName: "Monitor ID", field: "monitorId" },
        { headerName: "Health", field: "health" },
      ],
      rowData: [
        { monitorId: "M1", health: "OK" },
        { monitorId: "M2", health: "Warning" },
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
    escalationId: "1234567",
    ticketNo: "—",
    siteName: "KFC - Tadepally",
    cameraName: "MDX712 - Cam01",
    eventTimeCT: "18-04-2025 05:43:18",
    eventTimeCustomer: "18-04-2025 05:43:18",
    eventTimeIN: "18-04-2025 16:13:18",
    type: "Escalation",
    city: "Tadepally",
    totalDuration: "oh 20m 18s",
    indiaDuration: "oh 7m 27s",
    usDuration: "oh 1m 20s",
    alarmEvents: [
      {
        time: "18-04-2025 05:44:16",
        userImg: "assets/user1.png",
        status: "Success",
      },
      {
        time: "18-04-2025 05:49:16",
        userImg: "assets/user2.png",
        status: "Success",
      },
      {
        time: "18-04-2025 05:54:16",
        userImg: "assets/user2.png",
        status: "Success",
      },
    ],
    report: [
      {
        userImg: "assets/user1.png",
        user: "Team Member",
        level: "Team Member",
        receiveAt: "05:43:18",
        reviewStart: "05:44:16",
        reviewEnd: "05:44:18",
        duration: "Oh 1m 0s",
        action: "Escalation",
        tag: "Vehicle Observed",
        notes: "18-04-2025 05:43:18",
        endOfShift: "",
      },
      {
        userImg: "assets/user2.png",
        user: "Team Leader",
        level: "Team Leader",
        receiveAt: "05:43:18",
        reviewStart: "05:44:16",
        reviewEnd: "05:44:18",
        duration: "Oh 2m 55s",
        action: "Escalation",
        tag: "Intruder Observed",
        notes: "Near the fence",
        endOfShift: "",
      },
      {
        userImg: "assets/user2.png",
        user: "Manager",
        level: "Manager",
        receiveAt: "05:43:18",
        reviewStart: "05:44:16",
        reviewEnd: "05:44:18",
        duration: "Oh 0m 12s",
        action: "End Escalation",
        tag: "Staff-No Notification",
        notes: "RC",
        endOfShift: "",
      },
    ],
  };

  /** Close popup when clicking outside */

  /** Main table filter handling */
  

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
    console.log("Opening popup for item:", item);
    this.selectedItem = item;

    this.isTablePopupVisible = true;
  }

  onCellClicked(event: any) {
    console.log("Cell clicked:", event);
    if (event.colDef.field === "more") {
      const target = event.event.target as HTMLElement;
      if (target.closest(".info-icon")) {
        this.tableopenPopup(event.data); // open popup with row data
      }
      // Play icon popup
      if (target.closest(".play-icon")) {
        this.openPlayPopup(event.data); // open a different popup with row data
      }
    }
  }

  /** Open play popup for clicked icon */
  openPlayPopup(item: any) {
    console.log("Opening play popup for item:", item);
    this.selectedPlayItem = item;
    this.isPlayPopupVisible = true;
  }

  /** Close play popup */
  closePlayPopup() {
    this.isPlayPopupVisible = false;
    this.selectedPlayItem = null;
  }

  pendingColumnDefs: ColDef[] = [
    {
      headerName: "IDs",
      field: "id",
      sortable: true,
      headerClass: "custom-header",
      cellClass: "custom-cell",
    },
    {
      headerName: "SITE",
      field: "site",
      sortable: true,
      headerClass: "custom-header",
      cellClass: "custom-cell",
    },
    {
      headerName: "DEVICE",
      field: "device",
      headerClass: "custom-header",
      cellClass: "custom-cell",
    },
    {
      headerName: "CAMERA",
      field: "camera",
      headerClass: "custom-header",
      cellClass: "custom-cell",
    },
    {
      headerName: "CITY",
      field: "city",
      headerClass: "custom-header",
      cellClass: "custom-cell",
    },
    {
      headerName: "DATE & TIME",
      field: "dateTime",
      sortable: true,
      headerClass: "custom-header",
      cellClass: "custom-cell",
      valueFormatter: (params) => this.formatDateTime(params.value),
    },
    {
      headerName: "ACTION TAG",
      field: "actionTag",
      headerClass: "custom-header",
      cellClass: "custom-cell",
    },
    {
      headerName: "EMP.",
      field: "employee",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      cellRenderer: (params: any) => {
        return `<img src="${params.value.avatar}" style="width:30px; height:30px; "  class="avatar-img" alt="Emp"/>`;
      },
    },
    {
      headerName: "MORE",
      field: "more",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      cellRenderer: () => `
      <img src="assets/play-circle-icon.svg" class="more-icon" alt="Play"/>
      <img src="assets/information-icon.svg" class="more-icon" alt="Info"/>
    `,
    },
  ];

  pendingRowData = [
    {
      id: "1234577",
      site: "KFC - Charminar",
      device: "MDX722",
      camera: "Cam 11",
      city: "Charminar",
      dateTime: "2025-07-21T15:35:25",
      actionTag: "Tag 11",
      employee: { avatar: "assets/user2.png" },
      more: true,
    },

    // ...repeat for other rows
  ];

  /** Default column definition for AG Grid */
  defaultColDef: ColDef = { resizable: true };
  // 1. Tell AG Grid the hierarchy path
  getDataPath = (data: any) => {
    return [data.city, data.site, data.device, data.camera];
  };

  // 2. Setup the Auto Group Column
  autoGroupColumnDef = {
    headerName: "Hierarchy",
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: (params: any) => {
        return params.value; // just show the level name
      },
    },
  };

  closedGridApi: any;
pendingGridApi: any;
selectedFilter: 'CLOSED' | 'PENDING' = 'CLOSED';
searchTerm: string = '';

onClosedGridReady(params: any) {
  this.closedGridApi = params.api;
}

onPendingGridReady(params: any) {
  this.pendingGridApi = params.api;
}

setFilter(filter: 'CLOSED' | 'PENDING') {
  this.selectedFilter = filter;
  
  // Clear search whenever tab changes
  this.searchTerm = '';

  // Optionally, if using ag-Grid API, reset the quick filter
  if (this.selectedFilter === 'CLOSED' && this.closedGridApi) {
    this.closedGridApi.setQuickFilter('');
  } else if (this.selectedFilter === 'PENDING' && this.pendingGridApi) {
    this.pendingGridApi.setQuickFilter('');
  }
}

  // Current slide index
  currentSlideIndex: number = 0;

  // Show previous image
  prevSlide() {
    if (this.selectedPlayItem?.videoFile?.length) {
      this.currentSlideIndex =
        (this.currentSlideIndex - 1 + this.selectedPlayItem.videoFile.length) %
        this.selectedPlayItem.videoFile.length;
    }
  }

  // Show next image
  nextSlide() {
    if (this.selectedPlayItem?.videoFile?.length) {
      this.currentSlideIndex =
        (this.currentSlideIndex + 1) % this.selectedPlayItem.videoFile.length;
    }
  }

  secondEscalatedDetails: SecondEscalatedDetail[] = [];

  formatDateTime(value: string) {
    if (!value) return "";

    // Convert "2025-08-25_03-44-39" → "2025-08-25T03:44:39"
    const isoString = value.replace("_", "T").replace(/-/g, (match, offset) => {
      return offset > 9 ? ":" : "-";
    });

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return value;

    const pad = (num: number) => String(num).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  /** start row data for electedFilter === 'CLOSED' */
  rowData: any[] = [];

  /** Auto-size single column including its data */
  autoSizeColumn(colKey: string) {
    if (this.gridApi) {
      const column = this.gridApi.getColumnDef(colKey);
      if (column) {
        // Include header when auto-sizing
        this.gridApi.autoSizeColumns([colKey], true);
      }
    }
  }

  /** Auto-size multiple columns at once */
  autoSizeColumns(colKeys: string[]) {
    if (this.gridApi) {
      this.gridApi.autoSizeColumns(colKeys, true);
    }
  }

  columnDefs: ColDef[] = [
    {
      headerName: "ID",
      field: "siteId",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: "SITE",
      field: "siteName",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: "DEVICE",
      field: "device",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: "CAMERA",
      field: "cameraId",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    // {
    //   headerName: "CITY",
    //   field: "city",
    //   headerClass: "custom-header",
    //   cellClass: "custom-cell",
    // },
    {
      headerName: "EVENT TIME",
      field: "eventStartTime",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      valueFormatter: (params) => this.formatDateTime(params.value),
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: "DURATION",
      field: "duration",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: "TZ",
      field: "tz",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: "ACTION TAG",
      field: "actionTag",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: "EMP.",
      field: "employee",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      valueFormatter: (params) => params.value?.name || "", // <-- string value for filters/sort
      cellRenderer: (params: any) => {
        const emp = params.value;
        return `
      <div style="display:flex; align-items:center; gap:8px;">
        <img src="${emp.avatar}" style="width:30px; height:30px; border-radius:50%;" alt="Emp"/>
        <span>${emp.name} - Level ${emp.level}</span>
      </div>
    `;
      },
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },

    {
      headerName: "ALERT TYPE",
      field: "alertType",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      cellRenderer: () =>
        `<span style="display:inline-block; width:14px; height:14px; background:green; border-radius:50%;"></span>`,
      floatingFilter: true,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: "MORE",
      field: "more",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      cellRenderer: () => `
        <span class="play-icon style="margin-right:8px;">
          <img src="assets/play-circle-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Play"/>
        </span>
        <span class="info-icon">
          <img src="assets/information-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Info"/>
        </span>
      `,
    },
  ];
  loadsecondEscalatedDetails() {
    this.eventsService.getSuspiciousEvents().subscribe({
      next: (res) => {
        if (res && res.counts) {
          this.secondEscalatedDetails = [
            {
              label: "Total",
              value: res.counts.totalEventsCount || 0,
              color: "#ED3237",
            },
            {
              iconPath: "assets/home.svg",
              value: res.counts.sites || 0,
              color: "#ED3237",
            },
            {
              iconPath: "assets/cam.svg",
              value: res.counts.cameras || 0,
              color: "#ED3237",
            },

            // 👇 separate cards for dots
            {
              iconcolor: "#FFC400",
              value: res.counts.Event_Wall || 0,
              color: "#ED3237",
            },
            {
              iconcolor: "#53BF8B",
              value: res.counts.Manual_Wall || 0,
              color: "#ED3237",
            },
          ];
        }
      },
      error: (err) => {
        console.error("Failed to load events", err);
        this.secondEscalatedDetails = [];
      },
    });
  }

  loadClosedEvents() {
    this.eventsService.getSuspiciousEvents().subscribe({
      next: (res) => {
        if (res && res.eventData) {
          this.rowData = res.eventData.map((e: any) => ({
            siteId: e.siteId,
            siteName: e.siteName,
            device: e.unitId,
            cameraId: e.cameraId.slice(-2),
            // city: e.city,
            // duration: `${Math.floor(e.eventDuration / 3600)}h ${Math.floor((e.eventDuration % 3600) / 60)}m ${e.eventDuration % 60}s`,
            duration: `${Math.floor(e.eventDuration / 60)}m ${
              e.eventDuration % 60
            }s`,
            tz: "CT",
            eventStartTime: e.eventStartTime,
            actionTag: e.actionTag,
            // employee: { avatar: e.employeeAvatar || 'assets/default-user.png' },
            employee: {
              name: e.employee || "Unknown", // employee name
              avatar: "assets/user1.png", // default avatar
              level: e.userLevels || "N/A", // user level
            },
            alertType: "green",
            more: true,
          }));
          // ✅ Auto-size columns based on data + header
          setTimeout(() => {
            this.autoSizeColumns([
              "siteId",
              "siteName",
              "device",
              "cameraId",
              "duration",
              "actionTag",
            ]);
          });
        }
      },
      error: (err) => {
        console.error("Failed to load events", err);
        this.rowData = [];
      },
    });
  }


  /** AG Grid locale customization to remove tooltips and ARIA labels */
  localeText = {
    sortAscending: "",
    sortDescending: "",
    sortUnSort: "",
    columnMenu: "",
    ariaLabelSortAscending: "",
    ariaLabelSortDescending: "",
    ariaLabelSortNone: "",
    ariaLabelColumnMenu: "",
  };
}
