import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import {Thresholds} from "../../../models/Thresholds.model";
import {CommunicationService} from "../../../services/communication.service";
import {FormControl, Validators} from "@angular/forms";
import {Guid} from "guid-typescript";

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
})
export class ModifyComponent implements OnInit{

  ThresholdsInstance = new Thresholds();
  ThresholdsFormControls: CompositeFormControls = {};

  constructor(private awareness: AwarenessService, private communication: CommunicationService) {
  }

  ngOnInit() {
    this.seedInstance();

    this.awareness.awaken(() => {
      this.initialize();
    });
  }


  seedInstance() {
    this.ThresholdsFormControls["threshold_name"] = new FormControl('', [Validators.required]);
    this.ThresholdsFormControls["threshold_limit"] = new FormControl('', [Validators.required]);
  }

  initialize() {
    this.ThresholdsInstance._id = this.awareness.getFocused("threshold");

    if (this.ThresholdsInstance._id != "") {
      this.ThresholdsInstance.acquireInstance((doc: any) => {
        this.ThresholdsInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
      });
    }
  }

  submitInstance(): void {
    let is_valid = true;

    Object.keys(this.ThresholdsFormControls).forEach(fc_key => {
      if (this.ThresholdsFormControls[fc_key].hasError("required")) {
        is_valid = false;
        return;
      }
    });
    console.log('this.ThresholdsInstance', this.ThresholdsInstance)
    if (this.ThresholdsInstance._id == "")
    {
      this.ThresholdsInstance._id =  this.generateUniqueId();
    }

    if (is_valid) {
      this.ThresholdsInstance.putInstance((res: any) => {
        this.communication.showSuccessToast();

        this.ThresholdsInstance.acquireInstance((doc: any) => {
          this.ThresholdsInstance.parseInstance(doc);
        }, (err: any) => {
          // TODO! Handle errors
        });
      }, (err: any) => {
        console.log('ThresholdsInstance', this.ThresholdsInstance)
        console.error('submitInstance', err)
        this.communication.showFailedToast();
      });
    } else {
      this.communication.showToast("Kindly fill in all required fields!");
    }
  }



  generateUniqueId(){
    let uui = Guid.create().toString();
    console.log('generateUniqueId', uui)
    return uui;
  }


}
