
export interface UpdateData {
    description?: string;
    ibexrate?: number;
    guideName?: string;
    ibexsize?: string;
    priceOld?: string;
    newPrice?: string;
    huntername?: string;
    hunterlocation?: string;
    latitude?: string;
    longitude?: string;
    huntdate?: Date;
    huntType?: string;
    ibexname?: string;
    ibexphotos?: { cloudinary_url: string; cloudinary_id: string }[];
  }