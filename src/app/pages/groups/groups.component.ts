import { Component, OnInit, OnDestroy } from "@angular/core";
import { GridApi, GridReadyEvent, ColDef } from "ag-grid-community";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { GroupsPopupComponent } from "../../shared/groups-popup/groups-popup.component";
import { AgGridModule } from "ag-grid-angular";
import { GroupsService } from "./groups.service"; // ✅ Import service
import { QuickFilterModule, ModuleRegistry } from "ag-grid-community";
// Register module
ModuleRegistry.registerModules([QuickFilterModule]);

interface SecondEscalatedDetail {
  label?: string;
  value: number;
  iconPath?: string;
  color: string;
}

@Component({
    selector: "app-groups",
    templateUrl: "./groups.component.html",
    styleUrls: ["./groups.component.css"],
    imports: [CommonModule, FormsModule, GroupsPopupComponent, AgGridModule]
})
export class GroupsComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  private boundResize?: () => void;
  gridApi!: GridApi;
  private apiSub?: Subscription;

  constructor(private groupsService: GroupsService) {}

  ngOnInit() {
    this.selectedDate = new Date();
    this.loadGroups();
  }

  /** Close popups */
  closePopup() {
    this.isPopupVisible = false;
    this.isTablePopupVisible = false;
  }



  searchTerm: string = "";
  rowData: any[] = [];
  secondEscalatedDetails: SecondEscalatedDetail[] = [];

  isPopupVisible = false;
  isTablePopupVisible = false;
  selectedItem: any = null;
  popupColumnDefs: ColDef[] = [];
  popupRowData: any[] = [];

  selectedFilter: string = "CLOSED";
  currentIndex = 0; // currently selected item index

  nextItem() {
    if (this.currentIndex < this.rowData.length - 1) {
      this.currentIndex++;
      this.loadGroupDetails(this.rowData[this.currentIndex].id);
    }
  }

  prevItem() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadGroupDetails(this.rowData[this.currentIndex].id);
    }
  }

  onFilterTextBoxChanged() {
    if (this.gridApi) {
      this.gridApi.setGridOption("quickFilterText", this.searchTerm);
    }
  }
  quickFilterMatcher = (quickFilterParts: string[], rowText: string) => {
    return quickFilterParts.every((part) => {
      const regex = new RegExp(part, "i"); // case-insensitive
      return regex.test(rowText);
    });
  };

  columnDefs: ColDef[] = [
    { headerName: "ID", field: "id", sortable: true },
    { headerName: "NAME", field: "name", sortable: true },
    { headerName: "LEVEL", field: "level", sortable: true },
    { headerName: "SITE", field: "site" },
    { headerName: "CAMERAS", field: "cameras" },
    { headerName: "EMPLOYEES", field: "employees" },
    {
      headerName: "STATUS",
      field: "status",
      headerClass: "custom-header",
      cellClass: "custom-cell",
      cellRenderer: (params: any) => {
        const color = params.value === "ACTIVE" ? "#53BF8B" : "#00000040";
        return `
          <span style="display:inline-flex; align-items:center; gap:6px;">
            <span style="display:inline-block; width:14px; height:14px; background:${color}; border-radius:50%;"></span>
          </span>
        `;
      },
    },
    {
      headerName: "MORE",
      field: "more",
      cellRenderer: () => `
        <span class="info-icon">
          <img src="assets/information-icon.svg" style="width:20px; height:20px; cursor:pointer;" alt="Info"/>
        </span>
      `,
    },
  ];

  // New queue model
newQueue = {
  name: '',
  level: ''
};


onCreateQueueClick() {
  this.currentSection = 'queue';
}

createQueue() {
  if (!this.newQueue.name || !this.newQueue.level) {
    console.warn("Queue form is incomplete");
    return;
  }

  // TODO: hook up to service (backend call)
  console.log("Queue Created:", this.newQueue);

  // Reset
  this.newQueue = { name: '', level: ''};

  // Close and go back to default section
  this.goBack();
}

  onAddClick() {
    this.isPopupVisible = true;
  }

  defaultColDef: ColDef = { resizable: true, filter: true };

  /** Load data via service */
  loadGroups() {
    this.apiSub = this.groupsService.getGroups().subscribe({
      next: (res) => {
        if (res?.status === "Success" && Array.isArray(res.groupData)) {
          this.rowData = res.groupData.map((g: any) => ({
            id: g.GroupId,
            name: g.GroupName,
            level: g.level,
            site: g.sites,
            cameras: g.cameras,
            employees: g.employees,
            status: g.status?.toUpperCase(),
            more: true,
          }));

          const total = res.groupData.filter((g: any) => g).length;
          const active = res.groupData.filter(
            (g: any) => g.status?.toUpperCase() === "ACTIVE"
          ).length;
          const inactive = res.groupData.filter(
            (g: any) => g.status?.toUpperCase() === "INACTIVE"
          ).length;

          this.secondEscalatedDetails = [
            { label: "Total", value: total, color: "#f44336" },
            { label: "Active", value: active, color: "#2196f3" },
            { label: "Inactive", value: inactive, color: "#4caf50" },
          ];

          // ✅ Auto-select first group and call second API
          if (this.rowData.length > 0) {
            this.loadGroupDetails(this.rowData[0].id);
          }
        }
      },
      error: (err) => {
        console.error("Failed to load groups:", err);
      },
    });
  }

  /** Load second API and send data to popup */
  loadGroupDetails(groupId: number) {
    this.groupsService.getGroupSitesAndUsers(groupId).subscribe({
      next: (res) => {

        // Merge second API data into selectedItem
        const baseData = this.rowData.find((r) => r.id === groupId);
        this.selectedItem = {
          ...baseData,
          groupSites: res.groupSites,
          groupUsers: res.groupUsers,
        };

        // Show popup
        this.isTablePopupVisible = true;
      },
      error: (err) => console.error("Failed to load group sites/users:", err),
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
    window.addEventListener("resize", this.boundResize);
    this.gridApi.addEventListener("firstDataRendered", resizeAll);
  }

  onCellClicked(event: any) {
    if (event.colDef.field === "more") {
      const target = event.event.target as HTMLElement;
      if (target.closest(".info-icon")) {
        // Call second API for clicked row
        this.loadGroupDetails(event.data.id);
      }
    }
  }

 

sites = [
  { id: 1, name: 'Site 1' },
  { id: 2, name: 'Site 2' }
];

cameras = [
  { id: 1, name: 'Camera 1' },
  { id: 2, name: 'Camera 2' }
];

  currentSection: string = 'default'; // default = normal right section
 

  onSectionChange(section: string) {
    this.currentSection = section;
  }

  goBack() {
    this.currentSection = 'default';
  }

  formatDateTime(dateStr: string) {
    const d = new Date(dateStr);
    return d
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      })
      .replace("GMT", "CT");
  }

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

  ngOnDestroy() {
    if (this.boundResize)
      window.removeEventListener("resize", this.boundResize);
    if (this.apiSub) this.apiSub.unsubscribe();
  }
}
