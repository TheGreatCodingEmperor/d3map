import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './module/shared-module';
import { GlobalConfigComponent } from './config-bar/global-config/global-config.component';
import { SvgConfigComponent } from './config-bar/svg-config/svg-config.component';
import { ScaleBarZoomConfigComponent } from './config-bar/scale-bar-zoom-config/scale-bar-zoom-config.component';
import { RectConfigComponent } from './config-bar/rect-config/rect-config.component';
import { BubblesConfigComponent } from './config-bar/bubbles-config/bubbles-config.component';
import { PathsConfigComponent } from './config-bar/paths-config/paths-config.component';
import { AceEditorModule } from 'ng2-ace-editor';

@NgModule({
  declarations: [
    AppComponent,
    GlobalConfigComponent,
    SvgConfigComponent,
    ScaleBarZoomConfigComponent,
    RectConfigComponent,
    BubblesConfigComponent,
    PathsConfigComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    SharedModule,
    BrowserAnimationsModule,
    AceEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
