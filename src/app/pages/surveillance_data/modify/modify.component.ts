import {Component, OnInit} from '@angular/core';
import {MField} from "../../../models/MField.model";
import {CommunicationService} from "../../../services/communication.service";
import {AwarenessService} from "../../../services/awareness.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgxFileDropEntry} from "ngx-file-drop";
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import {FormControl} from "@angular/forms";
import {Surveillance} from "../../../models/Surveillance.model";
import {IModelStatus} from "../../../interfaces/IModel.model";
import {Guid} from "guid-typescript";

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
  ValidatedFileTypes: string[] = ["csv", "xlsx", "xls"]
  DocumentTypes: string[] = ["SARI", "CHOLERA", "POLIO"]

  UIMStatus: IModelStatus = {
    ms_processing:false,
    ms_action_result: false
  }

  constructor(private communication: CommunicationService, private awareness: AwarenessService, private http: HttpClient)
  {
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
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // saveFile(file, file.name);

          let SurveillanceInstance = new  Surveillance();
          if (SurveillanceInstance._id == "")
          {
            SurveillanceInstance._id =  this.generateUniqueId();
          }
          SurveillanceInstance.file_original_name = droppedFile.fileEntry.name;
          SurveillanceInstance.user_id = this.awareness.UserInstance._id;

          const parts = droppedFile.fileEntry.name.split('.');
          SurveillanceInstance.file_extension = parts[parts.length - 1];
          this.SurveillanceDataList.push(SurveillanceInstance);

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

    for (const SurveillanceInstance of this.SurveillanceDataList) {
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
    return Guid.create().toString();
  }

  assignDocumentType(event: any, fileIndex: number): void {
    this.SurveillanceDataList[fileIndex].file_type =  event.target.value;
    console.log(this.SurveillanceDataList);

  }

  describeFileType(File: any): boolean {
    const parts = File.fileEntry.name.split('.');
    let extension = parts[parts.length - 1].toLowerCase();

    if (this.ValidatedFileTypes && this.ValidatedFileTypes.includes(extension)) {
      return true;
    }

    return false;
  }

  validateFileHeaders(): boolean {



    // Headers
    const headers = new HttpHeaders({
      'security-token': 'mytoken'
    })

    this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', 'formData', { headers: headers, responseType: 'blob' })
      .subscribe(data => {
        // Sanitized logo returned from backend
      })
    return false;
  }

}
