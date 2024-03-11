import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SurveillanceDataRoutes} from "./home.routing";
import {CFieldsModule} from "../cfields/cfields.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgxFileDropModule} from "ngx-file-drop";
import { WelvomeComponent } from './welcome/welvome/welvome.component';
import { WelcomeComponent } from './welcome/welcome.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SurveillanceDataRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CFieldsModule,
    TablerIconsModule,
    NgxFileDropModule
  ],
  declarations: [
    // CompositeComponent,
    // ModifyComponent
  
    WelvomeComponent,
    WelcomeComponent
  ]
})
export class HomeModule { }
