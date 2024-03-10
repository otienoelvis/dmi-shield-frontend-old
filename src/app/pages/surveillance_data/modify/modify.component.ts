import {Component, OnInit} from '@angular/core';
import {MField} from "../../../models/MField.model";
import {CommunicationService} from "../../../services/communication.service";
import {AwarenessService} from "../../../services/awareness.service";
import {HttpClient} from "@angular/common/http";
import {NgxFileDropEntry} from "ngx-file-drop";
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import {FormControl, Validators} from "@angular/forms";
import {Surveillance} from "../../../models/Surveillance.model";
import {IModelStatus} from "../../../interfaces/IModel.model";
import {v1, v4, v5} from "uuid";
import {Guid} from "guid-typescript";
// import * as fs from "fs";



@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html'
})
export class ModifyComponent implements OnInit{
  MFieldInstance = new MField();
  allowedFiles: string=  ".csv, .pdf, .docx, .xlsx, .xls"
  public Files: NgxFileDropEntry[] = [];
  public UploadedFiles: File[] = [];
  SurveillanceFormControl : CompositeFormControls = {}
  SurveillanceDataList: Surveillance[] = [];
  public newGuid: Guid;

  UIMStatus: IModelStatus = {
    ms_processing:false,
    ms_action_result: false
  }

  constructor(private communication: CommunicationService, private awareness: AwarenessService, private http: HttpClient)
  {
    this.newGuid = Guid.create()
  }

  ngOnInit(): void {
    // this.seedInstance();

    this.MFieldInstance._id = this.awareness.getFocused("mfield");

    if (this.MFieldInstance._id != "") {
      this.MFieldInstance.acquireInstance((doc: any) => {
        this.MFieldInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
      });
    }
  }

  seedInstance(){
    this.SurveillanceFormControl["FileType"] = new FormControl();
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.Files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // let content = file.stream();
          //
          // fs.WriteStream(content)
          // fs.writeFileSync(file.name, 'jem' , 'utf-8');
          // // this.functionDownload(fileStream).then(r => {
          //
          // // });


        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }



  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }

  removeFile(index: number) {
    this.Files.splice(index, 1);
  }

  SubmitInstance(){
    if(this.Files.length < 1){
      this.UIMStatus.ms_action_result = true;
      this.communication.showToast("Kindly add at least one file");
    }


    // let newGuid = v4();
    let newGuid = Guid.create().toString();
    let index = 0;
    for (const file of this.Files) {
      let SurveillanceInstance = new  Surveillance();

      if (SurveillanceInstance._id == "")
      {
        // console.log(file.fileEntry.name, + "Created a new ")
        // SurveillanceInstance._id =  newId;
        SurveillanceInstance._id =  this.generateUniqueId();
      }
      SurveillanceInstance.file_original_name = file.fileEntry.name;
      SurveillanceInstance.user_id = this.awareness.UserInstance._id;

      const parts = file.fileEntry.name.split('.');
      SurveillanceInstance.file_extension = parts[parts.length - 1];

      SurveillanceInstance.putInstance((res: any) =>{
        this.communication.showSuccessToast();

        SurveillanceInstance.parseComposite(SurveillanceInstance);

      }, (err: any) =>{
        console.error('error', err)
        console.log('finalList', this.SurveillanceDataList);
        this.communication.showFailedToast();
      });

    }

  }

  generateUniqueId(){

    let newId = Guid.create().toString();

      return newId;
  }



}
