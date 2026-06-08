// ============================================================
// OWNER: Tharindu
// Resource: /api/sales
// Swagger: http://localhost:8080/swagger-ui/index.html
//
// Real endpoints (verified):
//   POST   /api/sales/plant/{plantId}?quantity=N   create a sale (no body)
//   GET    /api/sales                              list ALL sales as an array
//   GET    /api/sales/page?page=N&size=M&sort=..   paginated sales
//   GET    /api/sales/{id}                         get one sale
//   DELETE /api/sales/{id}                         delete a sale
//
// Sale DTO shape:
//   { id, plant: { id, name, price, quantity, category: {...} },
//     quantity, totalPrice, soldAt }
// ============================================================
import { apiClient, type ApiResponse } from './apiClient';

export interface CategoryRef {
  id: number;
  name?: string;
}

export interface PlantRef {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: CategoryRef;
}

export interface SaleDto {
  id: number;
  plant: PlantRef;
  quantity: number;
  totalPrice: number;
  soldAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

type Auth = Record<string, string>;

export const salesApi = {
  /** GET /api/sales — returns the full array (no pagination). */
  list: (auth: Auth): Cypress.Chainable<ApiResponse<SaleDto[]>> =>
    apiClient.get<SaleDto[]>('/api/sales', undefined, auth),

  /** GET /api/sales/page?page=&size= — Spring Pageable. */
  listPaged: (
    auth: Auth,
    qs: { page?: number; size?: number; sort?: string } = {}
  ): Cypress.Chainable<ApiResponse<PageResponse<SaleDto>>> =>
    apiClient.get<PageResponse<SaleDto>>('/api/sales/page', qs, auth),

  /** GET /api/sales/{id}. */
  getOne: (auth: Auth, id: number): Cypress.Chainable<ApiResponse<SaleDto>> =>
    apiClient.get<SaleDto>(`/api/sales/${id}`, undefined, auth),

  /** POST /api/sales/plant/{plantId}?quantity=N — no body. */
  create: (
    auth: Auth,
    args: { plantId: number; quantity: number }
  ): Cypress.Chainable<ApiResponse<SaleDto>> =>
    apiClient.post<SaleDto>(
      `/api/sales/plant/${args.plantId}`,
      undefined,
      auth,
      { quantity: args.quantity }
    ),

  /** DELETE /api/sales/{id}. */
  delete: (auth: Auth, id: number): Cypress.Chainable<ApiResponse<void>> =>
    apiClient.delete<void>(`/api/sales/${id}`, auth),
};
