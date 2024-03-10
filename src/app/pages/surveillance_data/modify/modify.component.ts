import {Component, OnInit} from '@angular/core';
import {MField} from "../../../models/MField.model";
import {CommunicationService} from "../../../services/communication.service";
import {AwarenessService} from "../../../services/awareness.service";
import {HttpClient} from "@angular/common/http";
import {NgxFileDropEntry} from "ngx-file-drop";
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import {FormControl, Validators} from "@angular/forms";
import {Surveillance} from "../../../models/Surveillance.model";

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html'
})
export class ModifyComponent implements OnInit{
  MFieldInstance = new MField();
  allowedFiles: string=  ".csv, .pdf, .docs, .xlsx, .xls"
  public Files: NgxFileDropEntry[] = [];
  public UploadedFiles: File[] = [];
  SurveillanceFormControl : CompositeFormControls = {}
  SurveillanceInstance = new  Surveillance();

  constructor(private communication: CommunicationService, private awareness: AwarenessService, private http: HttpClient) { }

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
    this.SurveillanceFormControl["File"] = new FormControl(null, [Validators.required])
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.Files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
           // You could upload it like this:
           const formData = new FormData()
           formData.append('logo', file, relativePath)

           // Headers
           const headers = new HttpHeaders({
           'security-token': 'mytoken'
           })

           this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
           .subscribe(data => {
           // Sanitized logo returned from backend
           })
           **/

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

}
