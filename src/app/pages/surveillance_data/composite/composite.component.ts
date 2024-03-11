import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {Surveillance} from "../../../models/Surveillance.model";
import {CommunicationService} from "../../../services/communication.service";

@Component({
  selector: 'app-composites',
  templateUrl: './composite.component.html'
})
export class CompositeComponent implements OnInit{
  Surveillance: Surveillance[] = [];
  FilterSurveillanceData: Surveillance = new Surveillance();

  constructor(private awareness: AwarenessService, private communication: CommunicationService) { }

  ngOnInit(): void {
    this.loadComposite()
  }

  loadComposite() {
    this.FilterSurveillanceData.acquireComposite((Surveillance: Surveillance[]) => {
      this.Surveillance = Surveillance;
      console.log("Allll", this.Surveillance);
    }, (error: any) => {
      // TODO! Handle errors
      console.log("Error", error);
    });
  }

  deleteInstance(doc: any){
    let SurveillanceInstance = new  Surveillance();

    SurveillanceInstance = doc;
    SurveillanceInstance.deleted = true;
    SurveillanceInstance.modifiedDate = SurveillanceInstance.updateModifiedDate();

    SurveillanceInstance.putInstance((res: any) =>{
      this.communication.showSuccessToast();

      SurveillanceInstance.parseComposite(SurveillanceInstance);

      this.loadComposite();

    }, (err: any) =>{
      console.error('error', err)
      this.communication.showFailedToast();
    });
  }

}
