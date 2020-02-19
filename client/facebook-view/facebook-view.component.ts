import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { AddonView } from '@materia/addons';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@AddonView('@materia/facebook')
@Component({
  selector: 'materia-facebook',
  templateUrl: './facebook-view.component.html',
  styleUrls: ['./facebook-view.component.scss']
})
export class FacebookViewComponent implements OnInit {
  @Input() app;
  @Input() settings;
  @Input() baseUrl: string;

  @Output() openSetup = new EventEmitter<void>();

  ngOnInit() {}
}
