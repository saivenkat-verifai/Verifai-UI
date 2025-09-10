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
import { ModuleRegistry } from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";

// Register the TreeDataModule for tree data feature
ModuleRegistry.registerModules([TreeDataModule]);

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

  showPopup = false;

autoGroupColumnDef: ColDef = {
  headerName: 'SITE ID',
  field: 'siteId',
  cellRendererParams: {
    suppressCount: true, // removes child count (optional)
  },
  valueGetter: (params) => {
    return params.data && !params.data.isCamera ? params.data.siteId : '';
  }
};

  /** Columns for Sites AG Grid */
  sitesColumnDefs: ColDef[] = [
  {
    headerName: "SITE / CAMERA NAME",
    field: "siteName",
    cellClass: "custom-cell",
    valueGetter: (params) =>
      params.data.isCamera ? params.data.cameraName : params.data.siteName,
  },
  {
    headerName: "CAMERAS",
    field: "totalCamerasCount",
    cellClass: "custom-cell",
    valueGetter: (params) => (params.data.isCamera ? "" : params.data.totalCamerasCount),
  },
  ];

  /** Columns for Users AG Grid */
  usersColumnDefs: ColDef[] = [
    { headerName: "USER ID", field: "userId", cellClass: "custom-cell" },
    { headerName: "NAME", field: "User_Name", cellClass: "custom-cell" },
    { headerName: "EMAIL", field: "email", cellClass: "custom-cell" },
    { headerName: "STATUS", field: "status", cellClass: "custom-cell" },
  ];

  /** Default column definition */
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  /** Row data arrays */
  sitesRowData: any[] = [];
  usersRowData: any[] = [];

  /** Handle popup toggle */
  togglePopup() {
    this.showPopup = !this.showPopup;
    this.openPopupEvent.emit(this.data);
  }

  openPopup(groupData: any) {
    this.data = groupData;
    this.showPopup = true;
  }

  openSection(section: string) {
    this.sectionChange.emit(section);
    this.showPopup = false;
  }

  toggleStatus(isActive: boolean) {
    if (this.data) {
      this.data.status = isActive ? "ACTIVE" : "INACTIVE";
    }
  }

  /** ngOnChanges to transform API data for tree structure */
  ngOnChanges() {
    if (this.data) {
      this.sitesRowData = [];

      if (Array.isArray(this.data.groupSites)) {
        this.data.groupSites.forEach((site: any) => {
          // Add parent row
          this.sitesRowData.push({
            siteId: site.siteId,
            siteName: site.siteName,
            status: site.status,
            totalCamerasCount: site.totalCamerasCount,
            isCamera: false, // parent
          });

          // Add child camera rows
          const cameras = Array.from(
            { length: site.totalCamerasCount },
            (_, i) => ({
              siteId: site.siteId,
              cameraName: `mdx-cam${i + 1}`,
              isCamera: true,
            })
          );

          this.sitesRowData.push(...cameras);
        });
      }

      // Users row data
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

  /** AG Grid tree data hierarchy */
  getDataPath = (data: any) => {
    if (data.isCamera) {
      return [data.siteId.toString(), data.cameraName]; // child path
    } else {
      return [data.siteId.toString()]; // parent path
    }
  };

  /** AG Grid ready handlers */
  onSitesGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  onUsersGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  closePopup() {
    this.close.emit();
  }
}
