export interface Ienrollment {
    completed:boolean;
    courses:[
    {
        completed_lessons:string[];
        enrolled_at:Date;
        id:string;
        last_accessed:Date;
        progress:number;
        thumbnail:string;
        title:string;

    }
    ]
 timestamp: Date;
    user_id: string;
}
