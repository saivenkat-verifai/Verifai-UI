// src/app/shared/shared.module.ts (or the module declaring GroupsPopupComponent)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import { GroupsPopupComponent } from './groups-popup/groups-popup.component';

@NgModule({
  declarations: [
    // other components
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule, // <— required for AG Grid
  ],
  exports: [
    // other components
  ]
})
export class SharedModule {}
