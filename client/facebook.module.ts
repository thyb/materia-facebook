import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatButtonModule,
  MatRippleModule,
  MatSnackBarModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatListModule,
  MatTooltipModule,
  MatCheckboxModule
} from '@angular/material';

import { Addon } from '@materia/addons';

import { FacebookViewComponent } from './facebook-view/facebook-view.component';
import { HttpClientModule } from '@angular/common/http';
import { FacebookSetupComponent } from './facebook-setup/facebook-setup.component';

@Addon('@materia/facebook')
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatRippleModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,
    MatListModule,
    MatCheckboxModule
  ],
  declarations: [FacebookViewComponent, FacebookSetupComponent],
  exports: [FacebookViewComponent],
  entryComponents: []
})
export class FacebookModule {}
