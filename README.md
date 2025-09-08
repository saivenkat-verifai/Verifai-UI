# VerifaiLogin

This is a dashboard-style Angular application built with Angular 16.2. It features a login page, dashboard, and several pages (Events, Groups, Employees, Sites) with a modern UI.

## Main Features

- **Authentication:** Simple login page with dummy credentials.
- **Dashboard:** Displays event statistics, escalated event details, and visualizations.
- **Charts:** Uses [Highcharts](https://www.highcharts.com/) (via `highcharts-angular`) for interactive line and column charts.
- **Data Tables:** Uses [AG Grid](https://www.ag-grid.com/) for advanced, customizable tables with sorting, filtering, and custom cell renderers.
- **Material Design:** Uses Angular Material components (e.g., datepicker, buttons) for consistent UI.
- **Responsive Layout:** CSS and layout are designed for a modern, responsive experience.

## Technologies Used

- **Angular 16.2**
- **Highcharts** (with `highcharts-angular`)
- **AG Grid** (`ag-grid-angular` and `ag-grid-community`)
- **Angular Material** (`@angular/material`)
- **RxJS** for reactive programming
- **TypeScript** for type safety

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
