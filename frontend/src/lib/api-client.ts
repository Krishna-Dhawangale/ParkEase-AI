/**
 * ParkEase AI — API Client
 * Wraps fetch with auth headers and standardized {success, message, data} envelope unwrapping.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export class ApiClient {
  private static getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('parkease-token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Unwraps standardized API response envelope.
   * If response has { success, message, data }, returns data.
   * If response is raw (non-envelope), returns as-is.
   */
  private static async unwrapResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      // Handle envelope error format
      if (errorData.message) {
        throw new Error(errorData.message);
      }
      throw new Error(errorData.detail || 'API request failed');
    }

    const json = await response.json();

    // Unwrap envelope if present
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      if (!json.success) {
        throw new Error(json.message || 'API request failed');
      }
      return json.data as T;
    }

    // Return raw response for non-envelope endpoints (e.g. auth)
    return json as T;
  }

  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.unwrapResponse<T>(response);
  }

  static async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.unwrapResponse<T>(response);
  }

  static async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.unwrapResponse<T>(response);
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.unwrapResponse<T>(response);
  }
}
