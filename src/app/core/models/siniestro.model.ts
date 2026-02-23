export interface Siniestro {
    id: number;
    accidentDate: Date;
    userAffected: string;
    insurance: string;
    policyNumber: string; 
    unitData: string;     
    location: string;
    description: string;
    otherUnits: boolean;  
    adjustorId: number;
    resolutionDate?: Date;
    payment?: number;
    administratorId?: number;
    estatus: number;
    multimedia: Blob[];    
}