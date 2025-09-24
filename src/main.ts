// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import {} from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { HighchartsChartModule } from 'highcharts-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { routes } from './app/app-routing.module'; // your route array

// Register AG Grid modules before bootstrap
ModuleRegistry.registerModules([AllCommunityModule]);

// ---------------------
// Global passive listener patch
// ---------------------
(function() {
  const orig = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    if (
      type === 'scroll' ||
      type === 'wheel' ||
      type === 'touchstart' ||
      type === 'touchmove'
    ) {
      if (typeof options === 'boolean') {
        options = { capture: options };
      }
      options = { ...(options as object), passive: true };
    }
    return orig.call(this, type, listener, options);
  };
})();

// ---------------------
// Bootstrap Angular app
// ---------------------
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(
      FormsModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatNativeDateModule,
      BrowserAnimationsModule,
      AgGridModule,
      HighchartsChartModule
    )
  ]
});
