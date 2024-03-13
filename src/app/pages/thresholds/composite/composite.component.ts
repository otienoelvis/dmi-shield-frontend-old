import {Component, OnInit} from '@angular/core';
import {Thresholds} from "../../../models/Thresholds.model";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrls: ['./composite.component.scss']
})
export class CompositeComponent implements OnInit{

  Thresholds: Thresholds[] = [];
  FilterThresholds: Thresholds = new Thresholds;
  constructor() {
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
}
