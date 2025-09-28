// src/types/questionnaire.ts
// Catálogo Global - SkillGroups
export interface SkillGroupDto {
  code: string;
  description: string;
}

// CRUD requests se precisar
export interface CreateSkillGroupRequest {
  code: string;
  description: string;
}

export interface UpdateSkillGroupRequest {
  code: string;
  description: string;
}

export interface QuestionnaireDto {
  id: number;
  name: string;
  description?: string;
  status: QuestionnaireStatusEnum;
  createdAt: string;
}

export interface QuestionnaireListDto {
  questionnaires: QuestionnaireDto[];
  totalCount: number;
}

export enum QuestionnaireStatusEnum {
  Draft = "Draft",
  Published = "Published",
  Archived = "Archived",
}

export interface FormQuestionDto {
  id: number;
  text: string;
  observations?: string;
  order: number;
}

export interface FormSectionDto {
  id: number;
  name: string;
  order: number;
  questions: FormQuestionDto[];
}

export interface QuestionnaireDetailDto {
  id: number;
  name: string;
  description?: string;
  status: QuestionnaireStatusEnum;
  createdAt: string;
  sections: FormSectionDto[];
}
// Interfaces para criação de questionário
export interface CreateFormQuestionRequest {
  text: string;
  observations?: string;
  order: number;
}

export interface CreateFormSectionRequest {
  name: string;
  order: number;
  questions: CreateFormQuestionRequest[];
}

export interface CreateQuestionnaireRequest {
  name: string;
  description?: string;
  status: QuestionnaireStatusEnum;
  sections: CreateFormSectionRequest[];
}

// Interfaces para atualização de questionário
export interface UpdateFormQuestionRequest {
  id: number;
  text: string;
  observations?: string;
  order: number;
}

export interface UpdateFormSectionRequest {
  id: number;
  name: string;
  order: number;
  questions: UpdateFormQuestionRequest[];
}

export interface UpdateQuestionnaireRequest {
  id: number;
  name?: string;
  description?: string;
  status: QuestionnaireStatusEnum;
  sections?: UpdateFormSectionRequest[];
}
export interface DefaultAnswerDto {
  id: number;
  questionnaireId: number;
  label: string;
  color: string;
}

export interface CreateDefaultAnswerRequest {
  questionnaireId: number;
  label: string;
  color: string;
}
