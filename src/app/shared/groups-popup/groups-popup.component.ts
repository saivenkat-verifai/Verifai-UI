import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { AgGridModule } from "ag-grid-angular";
import { FormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-groups-popup",
  templateUrl: "./groups-popup.component.html",
  styleUrls: ["./groups-popup.component.css"],
  standalone: true,
  imports: [
    AgGridModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    CommonModule,
  ],
})
export class GroupsPopupComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() selectedItem: any;
  @Input() selectedDate: Date | null = null;
  @Input() data: any; // Receives second API data: { groupSites, groupUsers }
  @Output() sectionChange = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();

  @Output() openPopupEvent = new EventEmitter<any>();

  openSection(section: string) {
    this.sectionChange.emit(section);
    this.showPopup = false;
  }

  /** Columns for groupSites AG Grid */
  sitesColumnDefs: ColDef[] = [
    { headerName: "SITE ID", field: "siteId", cellClass: "custom-cell" },
    { headerName: "SITE NAME", field: "siteName", cellClass: "custom-cell" },
    // { headerName: 'STATUS', field: 'status', cellClass: 'custom-cell' },
    {
      headerName: "CAMERAS",
      field: "totalCamerasCount",
      cellClass: "custom-cell",
    },
    // { headerName: 'TOTAL CAMERAS', field: 'totalCamerasCount', cellClass: 'custom-cell' },
  ];

  /** Columns for groupUsers AG Grid */
  usersColumnDefs: ColDef[] = [
    { headerName: "USER ID", field: "userId", cellClass: "custom-cell" },
    { headerName: "NAME", field: "User_Name", cellClass: "custom-cell" },
    { headerName: "EMAIL", field: "email", cellClass: "custom-cell" },
    { headerName: "STATUS", field: "status", cellClass: "custom-cell" },
  ];

  toggleStatus(isActive: boolean) {
    this.data.status = isActive ? "ACTIVE" : "INACTIVE";
  }

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  /** Separate rowData for sites and users */
  sitesRowData: any[] = [];
  usersRowData: any[] = [];

  showPopup = false;

  togglePopup() {
    this.showPopup = !this.showPopup;
    this.openPopupEvent.emit(this.data); // send current group to parent
  }
  openPopup(groupData: any) {
    console.log("Opening popup for group:", groupData);
    this.data = groupData; // the dropdown will now show this
    this.showPopup = true;
  }

  ngOnChanges() {
    if (this.data) {
      // Map groupSites to sitesRowData
      if (Array.isArray(this.data.groupSites)) {
        this.sitesRowData = this.data.groupSites.map((site: any) => ({
          siteId: site.siteId,
          siteName: site.siteName,
          status: site.status,
          groupSitesCamerasCount: site.groupSitesCamerasCount,
          totalCamerasCount: site.totalCamerasCount,
        }));
      } else {
        this.sitesRowData = [];
      }

      // Map groupUsers to usersRowData
      if (Array.isArray(this.data.groupUsers)) {
        this.usersRowData = this.data.groupUsers.map((user: any) => ({
          userId: user.userId,
          User_Name: user.User_Name,
          email: user.email,
          status: user.status,
        }));
      } else {
        this.usersRowData = [];
      }
    }
  }

  /** AG Grid ready for sites */
  onSitesGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  /** AG Grid ready for users */
  onUsersGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  closePopup() {
    this.close.emit();
  }
}
