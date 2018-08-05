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
import { MatSnackBar, MatDialog } from '@angular/material';

declare var window: any;
declare var FB: any;

@AddonView('@materia/facebook')
@Component({
  selector: 'materia-facebook',
  templateUrl: './facebook-view.component.html',
  styleUrls: ['./facebook-view.component.scss']
})
export class FacebookViewComponent implements OnInit {
  nbEmails: number;

  dialogRef: any;

  data: any;

  @Input() app;
  @Input() settings;
  @Input() baseUrl: string;

  @Output() openSetup = new EventEmitter<void>();

  constructor(private http: HttpClient, private dialog: MatDialog) {
    (function(d, s, id) {
      let js;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    window.fbAsyncInit = () => {
      console.log('fbasyncinit');

      FB.init({
        appId: 'facebook app id here',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.10'
      });
      FB.AppEvents.logPageView();
      // This is where we do most of our code dealing with the FB variable like adding an observer to check when the user signs in

      // ** ADD CODE TO NEXT STEP HERE **
    };
  }

  ngOnInit() {}

  connect() {}

  signin() {}

  private runQuery(entity: string, query: string, params?: any) {
    return this.http
      .post(`${this.baseUrl}/entities/${entity}/queries/${query}`, params)
      .toPromise();
  }
}
