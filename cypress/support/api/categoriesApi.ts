// ============================================================
// OWNER: Manodya (list/create/delete) + Malinda (update)
// Resource: /api/categories
//
// Refer to Swagger UI for exact request/response shapes:
//   http://localhost:8080/swagger-ui/index.html
//
// Pattern: every method returns ApiResponse<T> from apiClient.
// ============================================================
import { apiClient, type ApiResponse } from './apiClient';

export interface CategoryDto {
  id: number;
  name: string;
  parentId?: number | null;
}
export interface CreateCategoryRequest {
  name: string;
  parent?: { id: number } | null;
}

export const categoriesApi = {
  // TODO Manodya: confirm path/query against Swagger.
  list: (auth: Record<string, string>, qs?: { page?: number; size?: number; search?: string; parentId?: number }) =>
    apiClient.get<CategoryDto[] | { content: CategoryDto[] }>('/api/categories', qs, auth),

  listPaged: (auth: Record<string, string>, qs?: { name?: string; page?: number; size?: number; parentId?: number; sortField?: string; sortDir?: string }) =>
    apiClient.get<{ content: CategoryDto[] }>('/api/categories/page', qs, auth),

  getSummary: (auth: Record<string, string>) =>
    apiClient.get<{ mainCategories: number; subCategories: number }>('/api/categories/summary', undefined, auth),

  // TODO Manodya
  getOne: (auth: Record<string, string>, id: number) =>
    apiClient.get<CategoryDto>(`/api/categories/${id}`, undefined, auth),

  // TODO Manodya
  create: (auth: Record<string, string>, body: CreateCategoryRequest): Cypress.Chainable<ApiResponse<CategoryDto>> =>
    apiClient.post<CategoryDto>('/api/categories', body, auth),

  // TODO Malinda
  update: (auth: Record<string, string>, id: number, body: CreateCategoryRequest) =>
    apiClient.put<CategoryDto>(`/api/categories/${id}`, body, auth),

  // TODO Manodya
  delete: (auth: Record<string, string>, id: number) =>
    apiClient.delete<void>(`/api/categories/${id}`, auth),
};
