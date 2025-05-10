export interface Icourse {
        title:string;
        created_at:Date;
        category_id: string;
        course_id: string;
        description: string;
        thumbnail: string;
        discount: number;
        duration: number;
        is_published: boolean;
        instructor_id: string;
        what_will_learn: string[];
        requirements: string[];
        language: string;
        level:string;
        price:number;
        rating:{
            rate:number;
            rating_count:number
        }
      
      
}
