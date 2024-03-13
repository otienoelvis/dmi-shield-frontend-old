import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {User} from "../../../models/User.model";
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import {Thresholds} from "../../../models/Thresholds.model";

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
})
export class ModifyComponent implements OnInit{

  ThresholdsInstance = new Thresholds();
  ThresholdsFormControls: CompositeFormControls = {};

  constructor(public awareness: AwarenessService) {
  }

  ngOnInit() {
  }


}
