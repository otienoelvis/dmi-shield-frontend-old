import {IModelDatabase, IModelFilter, IModelStatus} from "../interfaces/IModel.model";
import {config} from "../config/config";
import PouchDB from "pouchdb";
import plugin from "pouchdb-find";
import {v1} from "uuid";

PouchDB.plugin(plugin);

export class Surveillance {
  _id: string = "";
  user_id: string = "";
  file_original_name: string = "";
  file_extension: string = "";
  file_header_status: boolean = true;
  file_data_status: boolean = true;
  validated: boolean = true;
  deleted: boolean = false;

  MStatus: IModelStatus = {
    ms_processing:false,
    ms_action_result: false
  }

  MFilter: IModelFilter = {
    mf_search: "",
    mf_tag: ""
  }

  MDatabase: IModelDatabase = {
    md_database: config.COUCHDB_ALCHEMY + "/surveillance_data"
  }

  constructor() {
  }

  parseInstance(doc: any){
    this._id = doc['_id']
    this.user_id = doc['user_id']
    this.file_original_name = doc['file_original_name']
    this.file_extension = doc['file_extension']
    this.file_header_status = doc['file_header_status']
    this.file_data_status = doc['file_data_status']
    this.validated = doc['validated']
    this.deleted = doc['deleted']

    return this;
  }

  parseComposite(rows: any){
    let CompositeSurveillanceData :Surveillance[] = [];

    rows.forEach((row: any) =>{
        let SurveillanceDataTemp = new Surveillance();
        CompositeSurveillanceData.push(SurveillanceDataTemp.parseInstance(row))
      }
    );

    return CompositeSurveillanceData;
  }

  mapInstance(_rev: string){
    let doc = {
      "_id": this._id,
      "_rev": _rev,
      "user_id": this.user_id,
      "file_original_name": this.file_original_name,
      "file_extension": this.file_extension,
      "file_header_status": this.file_header_status,
      "file_data_status": this.file_data_status,
      "validated": this.validated,
      "deleted": this.deleted,
    }

    return doc;
  }

  putInstance(response: any, error: any){
    this.MStatus.ms_processing = true;
    let _rev: string = "";

    // Create ident
    if (this._id == "") { this._id = v1(); }

    // Connect to remote
    let db = new PouchDB(this.MDatabase.md_database);

    this.acquireInstance((doc: any) => {
      _rev = doc["_rev"];
    }, null, () => {
      db.put(this.mapInstance(_rev))
        .then(res => {
          this.MStatus.ms_action_result = true;
          response(res);
        }).catch((err: any) => {
        error(err);
      }).finally(() => {
        this.MStatus.ms_processing = false;
      });
    });
  }

  async acquireInstance(success: any, error: any, finished: any = null){
    let db = new PouchDB(this.MDatabase.md_database)

    db.get(this._id)
      .then(function (doc){
        success(doc)
      }).catch(function (err){
        error(err)
    }).finally(() =>{
      if (finished) finished();
    });
  }


  async acquireComposite(success: any, error: any){
    let db = new PouchDB(this.MDatabase.md_database)
    let instance = this;
    let Surveillance: Surveillance[] = []

    db.createIndex({
      index: {
        fields: ['file_original_name']
      }
    }).then((res: any) => {
      db.find({
        selector: {
          'file_original_name': { $regex: ".*" + this.MFilter.mf_search + ".*" }
        },
        sort: [{ 'file_original_name': 'asc' }]
      }).then(res => {
        Surveillance = instance.parseComposite(res.docs);
        success(Surveillance);
      }).catch(err => {
        error(err);
      });
    });
  }

}
