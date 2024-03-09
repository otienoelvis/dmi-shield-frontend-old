import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class AppSideLoginComponent {

  hide: boolean = true;
  UserInstance: User = new User();
  UserFormControls: CompositeFormControls = {};
  user_password: string = "";

  constructor(private router: Router, private awareness: AwarenessService, private communication: CommunicationService) {
  }

  ngOnInit(): void {
    if(!this.awareness.awake) {
      this.router.navigate(['/authentication']);
    }

    this.UserFormControls["user_email"] = new FormControl('', [Validators.required]);
    this.UserFormControls["user_password"] = new FormControl('', [Validators.required]);
  }

  resetPassword() {
    console.log("Reset password");
  }

  submitInstance(): void {
    let is_valid = true;

    // Validate required fields
    Object.keys(this.UserFormControls).forEach(fc_key => {
      if (this.UserFormControls[fc_key].hasError("required")) {
        is_valid = false;
      }
    });

    if (is_valid) {
      this.UserInstance.user_password = this.user_password;
      this.UserInstance.authenticateInstance((res: any) => {
        if (res) {
          this.user_password = "";

          this.awareness.setFocused("authenticated", this.UserInstance._id, (res: any) => {
            this.router.navigate(['/authentication']);
          });

          this.communication.showSuccessToast();
        }
      }, (err: any) => {
        this.communication.showToast("Failed! Check your credentials and try again.");
      });
    } else {
      this.communication.showToast("Please provide username and password!");
    }
  }
}
