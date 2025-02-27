export interface IProject extends Document {
    projectname: string;
    description: string;
    projectcost: string;
    projectfor: string;
    projecttype: string;
    summary: string;
    completiondate: Date;
    startdate: Date;
    lastdate: Date;
    latitude: string;
    longitude: string;
    huntername?: string;
    hunterlocation?: string;
    ibexsize?: string;
    priceOld?: string;
    ibexphotos: IbexPhoto[];
    projectphotos: IbexPhoto[];
  }
  interface IbexPhoto {
    cloudinary_url: string;
    cloudinary_id: string;
  }