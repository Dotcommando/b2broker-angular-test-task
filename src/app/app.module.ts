import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from '@components/home/home.component';
import { HeaderComponent } from '@components/header/header.component';
import { BodyComponent } from '@components/body/body.component';
import { InputComponent } from '@ui/input/input.component';
import { TableComponent } from '@ui/table/table.component';
import { TableRowComponent } from './components/ui/table-row/table-row.component';
import { TableCellComponent } from './components/ui/table-cell/table-cell.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    HomeComponent,
    HeaderComponent,
    BodyComponent,
    TableComponent,
    TableRowComponent,
    TableCellComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
