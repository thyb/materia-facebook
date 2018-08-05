import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AddonSetup } from '@materia/addons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@AddonSetup('@materia/facebook')
@Component({
  selector: 'materia-facebook-setup',
  templateUrl: './facebook-setup.component.html',
  styleUrls: ['./facebook-setup.component.scss']
})
export class FacebookSetupComponent implements OnInit {
  settingsForm: FormGroup;

  @Input() settings: any;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      social_connect: this.settings && this.settings.social_connect,
      app_id: [this.settings && this.settings.app_id, Validators.required],
      app_secret: [this.settings && this.settings.app_secret, Validators.required]
    });

  }

  saveClick() {
    if (this.settingsForm.valid) {
      this.save.emit(this.settingsForm.value);
    }
  }

  close() {
    this.cancel.emit();
  }
}
