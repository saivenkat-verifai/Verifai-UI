import { Component, OnInit } from "@angular/core";
import { GridApi, GridReadyEvent, ColDef, ModuleRegistry, AllCommunityModule, QuickFilterModule } from "ag-grid-community";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { EscalationPopupComponent } from "../../shared/escalation-popup/escalation-popup.component";
import { AgGridModule } from "ag-grid-angular";
import { CalendarComponent } from "src/app/shared/calendar/calendar.component";
import { EventsService } from "./events.service";
import { ESCALATED_COLORS } from "src/app/shared/constants/chart-colors";

// Register AG Grid modules
ModuleRegistry.registerModules([QuickFilterModule, AllCommunityModule]);

interface IconData { iconPath: string; count: number; }
interface CardDot { iconcolor: string; count: number; }
interface EscalatedDetail { label: string; value: number; color: string; icons?: IconData[]; colordot?: CardDot[]; }
interface SecondEscalatedDetail { label?: string; value?: number; iconPath?: string; color?: string; iconcolor?: string; }

@Component({
    selector: "app-events",
    templateUrl: "./events.component.html",
    styleUrls: ["./events.component.css"],
    imports: [
        CommonModule,
        // EscalationPopupComponent,
        AgGridModule,
        FormsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        CalendarComponent,
    ]
})
export class EventsComponent implements OnInit {
  /** -------------------- Dates -------------------- */
  currentDate: Date = new Date();
  selectedDate: Date | null = null;

  /** -------------------- Filters & toggles -------------------- */
  selectedFilter: "CLOSED" | "PENDING" = "PENDING";
  suspiciousChecked: boolean = true;
  falseChecked: boolean = false;
  searchTerm: string = "";
  showMore: boolean = false;

  /** -------------------- AG Grid APIs -------------------- */
  gridApi!: GridApi;
  closedGridApi: any;
  pendingGridApi: any;

  /** -------------------- Popup handling -------------------- */
  isTablePopupVisible = false;
  isPopupVisible = false;
  selectedItem: any = null;

  isPlayPopupVisible = false;
  selectedPlayItem: any = null;
  currentSlideIndex: number = 0;

  isCalendarPopupOpen = false;

  /** -------------------- Dashboard data -------------------- */
  rowData: any[] = [];
  pendingRowData: any[] = [];
  secondEscalatedDetails: SecondEscalatedDetail[] = [];

  /** -------------------- Column defs -------------------- */
  closedColumnDefs: ColDef[] = [];
  pendingColumnDefs: ColDef[] = [];
  defaultColDef: ColDef = { resizable: true };
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

  constructor(private eventsService: EventsService) {}

  /** -------------------- Lifecycle -------------------- */
  ngOnInit() {
    this.selectedDate = new Date();
    this.setupColumnDefs();

    if (this.selectedFilter === "PENDING") {
      this.loadPendingEvents();
      this.loadsecondEscalatedDetails();
    }
  }

  /** -------------------- Filter & toggle actions -------------------- */
  setFilter(filter: "CLOSED" | "PENDING") {
    this.selectedFilter = filter;
    this.searchTerm = "";

    if (filter === "PENDING") {
      this.loadPendingEvents();
      this.pendingGridApi?.setQuickFilter("");
    } else {
      this.suspiciousChecked = true;
      this.falseChecked = false;
      this.loadClosedEvents();
      this.loadsecondEscalatedDetails();
      this.closedGridApi?.setQuickFilter("");
    }
  }

  onSuspiciousToggle() {
    this.suspiciousChecked = false;
    this.falseChecked = true;
    this.loadClosedEvents();
    this.loadsecondEscalatedDetails();
  }

  onFalseToggle() {
    this.suspiciousChecked = true;
    this.falseChecked = false;
    this.loadClosedEvents();
    this.loadsecondEscalatedDetails();
  }

  toggleMore() {
    this.showMore = !this.showMore;
  }

  /** -------------------- AG Grid setup -------------------- */
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    const resizeAll = () => {
      const ids = this.gridApi.getColumns()?.map((col) => col.getColId()) ?? [];
      this.gridApi.autoSizeColumns(ids, false);
      this.gridApi.sizeColumnsToFit();
    };
    setTimeout(resizeAll);
    this.gridApi.addEventListener("firstDataRendered", resizeAll);
    window.addEventListener("resize", resizeAll);
  }

  onClosedGridReady(params: any) { this.closedGridApi = params.api; }
  onPendingGridReady(params: any) { this.pendingGridApi = params.api; }

  onFilterTextBoxChanged() {
    this.gridApi?.setGridOption("quickFilterText", this.searchTerm);
  }

  closedQuickFilterMatcher = (quickFilterParts: string[], rowText: string) => {
    return quickFilterParts.every((part) => new RegExp(part, "i").test(rowText));
  };

  pendingQuickFilterMatcher = (quickFilterParts: string[], rowText: string) => {
    return quickFilterParts.every((part) => new RegExp(part, "i").test(rowText));
  };

  onCellClicked(event: any) {
    const target = event.event.target as HTMLElement;
    if (event.colDef.field === "more") {
      if (target.closest(".info-icon")) this.tableopenPopup(event.data);
      if (target.closest(".play-icon")) this.openPlayPopup(event.data);
    }
  }

  /** -------------------- Popups -------------------- */
  tableopenPopup(item: any) {
    this.selectedItem = item;
    this.isTablePopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
    this.isTablePopupVisible = false;
  }

  openPlayPopup(item: any) {
    this.selectedPlayItem = item;
    this.isPlayPopupVisible = true;
  }

  closePlayPopup() {
    this.isPlayPopupVisible = false;
    this.selectedPlayItem = null;
  }

  openCalendarPopup() { this.isCalendarPopupOpen = true; }
  closeCalendarPopup() { this.isCalendarPopupOpen = false; }
  openCalendar(): void { this.openCalendarPopup(); }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.closeCalendarPopup();
  }

  changeDate(offset: number) {
    if (this.selectedDate) {
      const updatedDate = new Date(this.selectedDate);
      updatedDate.setDate(updatedDate.getDate() + offset);
      this.selectedDate = updatedDate;
    }
  }

  setToday(): void {
    this.currentDate = new Date();
    this.selectedDate = this.currentDate;
  }

  prevSlide() {
    if (this.selectedPlayItem?.videoFile?.length) {
      this.currentSlideIndex =
        (this.currentSlideIndex - 1 + this.selectedPlayItem.videoFile.length) %
        this.selectedPlayItem.videoFile.length;
    }
  }

  nextSlide() {
    if (this.selectedPlayItem?.videoFile?.length) {
      this.currentSlideIndex =
        (this.currentSlideIndex + 1) % this.selectedPlayItem.videoFile.length;
    }
  }

  /** -------------------- Helper functions -------------------- */
  getIconLabel(iconPath: string | undefined): string {
    const map: { [key: string]: string } = {
      "assets/home.svg": "SITE EVENTS",
      "assets/cam.svg": "CAMERA EVENTS",
      "assets/direction.svg": "GROUP EVENTS",
      "assets/moniter.svg": "MONITER EVENTS",
    };
    return iconPath ? map[iconPath] || "" : "";
  }

  formatDateTime(value: string) {
    if (!value) return "";
    const isoString = value.replace("_", "T").replace(/-/g, (match, offset) => offset > 9 ? ":" : "-");
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return value;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  /** -------------------- API calls -------------------- */
  loadPendingEvents() {
    this.eventsService.getEventsPendingEventa().subscribe({
      next: (res) => this.pendingRowData = res.data || res,
      error: (err) => console.error("Error fetching pending events:", err),
    });
  }

  loadClosedEvents() {
    this.eventsService.getSuspiciousEvents(this.suspiciousChecked).subscribe({
      next: (res) => {
        if (res?.eventData) {
          this.rowData = res.eventData.map((e: any) => ({
            siteId: e.siteId,
            siteName: e.siteName,
            device: e.unitId,
            cameraId: e.cameraId.slice(-2),
            duration: `${Math.floor(e.eventDuration / 60)}m ${e.eventDuration % 60}s`,
            tz: "CT",
            eventStartTime: e.eventStartTime,
            actionTag: e.actionTag,
            employee: { name: e.employee || "Unknown", avatar: "assets/user1.png", level: e.userLevels || "N/A" },
            alertType: "green",
            more: true,
          }));
        }
      },
      error: (err) => console.error("Failed to load closed events", err),
    });
  }

  loadsecondEscalatedDetails() {
    this.eventsService.getSuspiciousEvents(this.suspiciousChecked).subscribe({
      next: (res) => {
        if (res?.counts) {
          this.secondEscalatedDetails = [
            { label: "Total", value: res.counts.totalEventsCount || 0, color: "#ED3237" },
            { iconPath: "assets/home.svg", value: res.counts.sites || 0, color: "#ED3237" },
            { iconPath: "assets/cam.svg", value: res.counts.cameras || 0, color: "#ED3237" },
            { iconcolor: "#53BF8B", value: res.counts.Manual_Wall || 0, color: "#ED3237" },
            { iconcolor: "#FFC400", value: res.counts.Event_Wall || 0, color: "#ED3237" },
          ];
        }
      },
      error: (err) => this.secondEscalatedDetails = [],
    });
  }

  /** -------------------- Utility -------------------- */
  autoSizeColumn(colKey: string) { this.gridApi?.autoSizeColumns([colKey], true); }
  autoSizeColumns(colKeys: string[]) { this.gridApi?.autoSizeColumns(colKeys, true); }

  setupColumnDefs() {
    this.closedColumnDefs = [
      { headerName: "ID", field: "siteId", headerClass: "custom-header", cellClass: "custom-cell", floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "SITE", field: "siteName", headerClass: "custom-header", cellClass: "custom-cell", floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "DEVICE", field: "device", headerClass: "custom-header", cellClass: "custom-cell", floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "CAMERA", field: "cameraId", headerClass: "custom-header", cellClass: "custom-cell", floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "EVENT TIME", field: "eventStartTime", headerClass: "custom-header", cellClass: "custom-cell", valueFormatter: (params) => this.formatDateTime(params.value), floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "DURATION", field: "duration", headerClass: "custom-header", cellClass: "custom-cell", floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "TZ", field: "tz", headerClass: "custom-header", cellClass: "custom-cell", floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "ACTION TAG", field: "actionTag", headerClass: "custom-header", cellClass: "custom-cell", floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "EMP.", field: "employee", headerClass: "custom-header", cellClass: "custom-cell", valueFormatter: (params) => params.value?.name || "", cellRenderer: (params: any) => `<div style="display:flex; align-items:center; gap:8px;"><img src="${params.value.avatar}" style="width:30px; height:30px; border-radius:50%;" alt="Emp"/><span>${params.value.name} - Level ${params.value.level}</span></div>`, floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "ALERT TYPE", field: "alertType", headerClass: "custom-header", cellClass: "custom-cell", cellRenderer: () => `<span style="display:inline-block; width:14px; height:14px; background:green; border-radius:50%;"></span>`, floatingFilter: true, filter: true, suppressHeaderMenuButton: true },
      { headerName: "MORE", field: "more", headerClass: "custom-header", cellClass: "custom-cell", cellRenderer: () => `<span class="play-icon" style="margin-right:8px;"><img src="assets/play-circle-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Play"/></span><span class="info-icon"><img src="assets/information-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Info"/></span>` },
    ];

    this.pendingColumnDefs = [
      { headerName: "ID", field: "id", sortable: true, headerClass: "custom-header", cellClass: "custom-cell" },
      { headerName: "SITE", field: "site", sortable: true, headerClass: "custom-header", cellClass: "custom-cell" },
      { headerName: "DEVICE", field: "device", headerClass: "custom-header", cellClass: "custom-cell" },
      { headerName: "CAMERA", field: "camera", headerClass: "custom-header", cellClass: "custom-cell" },
      { headerName: "CITY", field: "city", headerClass: "custom-header", cellClass: "custom-cell" },
      { headerName: "DATE & TIME", field: "dateTime", sortable: true, headerClass: "custom-header", cellClass: "custom-cell", valueFormatter: (params) => this.formatDateTime(params.value) },
      { headerName: "ACTION TAG", field: "actionTag", headerClass: "custom-header", cellClass: "custom-cell" },
      { headerName: "EMP.", field: "employee", headerClass: "custom-header", cellClass: "custom-cell", cellRenderer: (params: any) => `<img src="${params.value.avatar}" style="width:30px; height:30px;" class="avatar-img" alt="Emp"/>` },
      { headerName: "MORE", field: "more", headerClass: "custom-header", cellClass: "custom-cell", cellRenderer: () => `<span class="play-icon" style="margin-right:8px;"><img src="assets/play-circle-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Play"/></span><span class="info-icon"><img src="assets/information-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Info"/></span>` },
    ];
  }

   escalatedDetailsClosed: EscalatedDetail[] = [
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

    escalatedDetailsPending: EscalatedDetail[] = [
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
    // ...other cards
  ];


  
}
