import {Component, OnInit} from '@angular/core';
import {Thresholds} from "../../../models/Thresholds.model";
import {AwarenessService} from "../../../services/awareness.service";
import {CommunicationService} from "../../../services/communication.service";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
})
export class CompositeComponent implements OnInit{

  Thresholds: Thresholds[] = [];
  FilterThresholds: Thresholds = new Thresholds;
  constructor(public awareness: AwarenessService, private communication: CommunicationService,) {
  }

  ngOnInit() {
    this.loadComposite();
  }

  loadComposite() {
    this.FilterThresholds.acquireComposite((Thresholds: Thresholds[]) => {
      this.Thresholds = Thresholds;
      console.log("Allll", this.Thresholds);
    }, (error: any) => {
      // TODO! Handle errors
      console.log("Error", error);
    });
  }


  deleteInstance(doc: Thresholds){

    this.FilterThresholds = doc;
    this.FilterThresholds.deleted = true;
    this.FilterThresholds.modifiedDate = this.FilterThresholds.updateModifiedDate();

    this.FilterThresholds.putInstance((res: any) =>{
      this.communication.showSuccessToast();

      this.FilterThresholds.parseComposite(this.FilterThresholds);

      this.loadComposite();

    }, (err: any) =>{
      console.error('error', err)
      this.communication.showFailedToast();
    });
  }
}
