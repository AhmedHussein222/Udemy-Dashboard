export interface Icourse {
        created_at:Date;
        category_id: string;
        course_id: string;
        description: string;
        discount: number;
        duration: number;
        is_published: boolean;
        instructor_id: string;
        language: string;
        level:string;
        price:number;
        rating:{
            rate:number;
            rating_count:number
        }
      
      
}
