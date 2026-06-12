// ============================================================
// SHARED API CLIENT — /api/plants
//   OWNER (update):       Tharindu
//   OWNER (list/get/del): Bhawanthi
//   OWNER (create):       Malinda
//
// Real endpoints (verified from Swagger + live calls):
//   GET    /api/plants                              array of full Plant
//   GET    /api/plants/{id}                         PlantEditResponseDTO (flat categoryId)
//   GET    /api/plants/paged?name=&categoryId=&page=&size=   paginated
//   GET    /api/plants/category/{categoryId}        array under sub-category
//   GET    /api/plants/summary                      { totalPlants, lowStockPlants }
//   POST   /api/plants/category/{categoryId}        create plant under category
//   PUT    /api/plants/{id}                         body: { name, price, quantity, categoryId }
//   DELETE /api/plants/{id}
//
// IMPORTANT: PUT body uses a FLAT categoryId (verified against the live API) —
//            same shape as GET /api/plants/{id} (PlantEditResponseDTO).
// ============================================================
import { apiClient, type ApiResponse } from './apiClient';

export interface CategoryRef {
  id: number;
  name?: string;
}

export interface PlantDto {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: CategoryRef;     // present on /api/plants and PUT response
  categoryId?: number;         // present on /api/plants/{id} (PlantEditResponseDTO)
}

export interface PlantUpdateRequest {
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
}

export interface PlantCreateRequest {
  name: string;
  price: number;
  quantity: number;
}

export interface PagePlantResponse {
  content: PlantDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

type Auth = Record<string, string>;

export const plantsApi = {
  // ---- OWNER: Bhawanthi (list / get / delete) ----
  list: (auth: Auth): Cypress.Chainable<ApiResponse<PlantDto[]>> =>
    apiClient.get<PlantDto[]>('/api/plants', undefined, auth),

  listPaged: (
    auth: Auth,
    qs: { name?: string; categoryId?: number; page?: number; size?: number; sort?: string } = {}
  ): Cypress.Chainable<ApiResponse<PagePlantResponse>> =>
    apiClient.get<PagePlantResponse>('/api/plants/paged', qs, auth),

  listByCategory: (auth: Auth, categoryId: number): Cypress.Chainable<ApiResponse<PlantDto[]>> =>
    apiClient.get<PlantDto[]>(`/api/plants/category/${categoryId}`, undefined, auth),

  getOne: (auth: Auth, id: number): Cypress.Chainable<ApiResponse<PlantDto>> =>
    apiClient.get<PlantDto>(`/api/plants/${id}`, undefined, auth),

  delete: (auth: Auth, id: number): Cypress.Chainable<ApiResponse<void>> =>
    apiClient.delete<void>(`/api/plants/${id}`, auth),

  // ---- OWNER: Malinda (create) ----
  /** POST /api/plants/category/{categoryId} — create plant under that sub-category. */
  create: (
    auth: Auth,
    categoryId: number,
    body: PlantCreateRequest
  ): Cypress.Chainable<ApiResponse<PlantDto>> =>
    apiClient.post<PlantDto>(`/api/plants/category/${categoryId}`, body, auth),

  // ---- OWNER: Tharindu (update) ----
  /** PUT /api/plants/{id}. Body uses a flat categoryId — see header comment. */
  update: (
    auth: Auth,
    id: number,
    body: PlantUpdateRequest
  ): Cypress.Chainable<ApiResponse<PlantDto>> =>
    apiClient.put<PlantDto>(`/api/plants/${id}`, body, auth),
};
