export interface Major {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  duration: string;
  icon: string;
  competencies: string[];
  careerPaths: string[];
}

export interface CurriculumComponent { title: string; portion: string; description: string; icon: string; }
export interface CurriculumGrade { grade: string; title: string; description: string; }
export interface CurriculumProfile { curriculumName: string; schedule: string; dataSemester: string; internetAccess: string; electricitySource: string; electricityPower: string; landArea: string; }
export interface CurriculumContent { framework: string; intro: string; profile: CurriculumProfile; components: CurriculumComponent[]; structure: CurriculumGrade[]; }
