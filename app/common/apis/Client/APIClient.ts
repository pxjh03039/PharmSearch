import { HTTP_STATUS_CODE } from "../constants/http";
import { dispatchErrorEvent } from "./Error";

const baseHeader = {
  "Content-Type": "application/json",
};

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class HTTPError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export default class APIClient {
  async get<T = any>(path: string): Promise<T> {
    const response = await this.request<T>("GET", path);
    const data = await this.handleResponse<T>(response);

    return data as T;
  }

  async post<T = any>(path: string, body?: any): Promise<T> {
    const response = await this.request<T>("POST", path, body);
    const data = await this.handleResponse<T>(response);

    return data as T;
  }

  async patch<T = any>(path: string, body?: any): Promise<T> {
    const response = await this.request<T>("PATCH", path, body);
    const data = await this.handleResponse<T>(response);

    return data as T;
  }

  async delete<T = any>(path: string, body?: any): Promise<T> {
    const response = await this.request<T>("DELETE", path, body);
    const data = await this.handleResponse<T>(response);

    return data as T;
  }

  async request<T>(
    method: HTTPMethod,
    path: string,
    body?: any
  ): Promise<Response> {
    try {
      const url = `${path}`;
      const response = await fetch(url, {
        method,
        headers: baseHeader,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();

        let parsedError;
        try {
          parsedError = JSON.parse(errorText);
        } catch {
          parsedError = { error: errorText };
        }

        const errorMessage =
          parsedError.error || parsedError.message || errorText;

        const httpError = new HTTPError(
          `에러 발생 (url: ${url})\n내용: ${errorMessage} (${response.status})`,
          response.status
        );

        this.showErrorModal(httpError);
        throw httpError;
      }

      return response;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }

      const networkError = new HTTPError(
        `네트워크 오류 또는 요청 실패 (url: ${path})`,
        HTTP_STATUS_CODE.NETWORK_ERROR
      );

      this.showErrorModal(networkError);
      throw networkError;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T | null> {
    if (response.status === HTTP_STATUS_CODE.NO_CONTENT) {
      return null;
    }

    return (await response.json()) as T;
  }

  private showErrorModal(error: HTTPError) {
    const errorLines = error.message.split("\n");
    const contentLine = errorLines.find((line) => line.includes("내용:"));
    let displayMessage = "알 수 없는 오류가 발생했습니다.";

    if (contentLine) {
      const match = contentLine.match(/내용:\s*(.+)\s*\(\d+\)/);
      if (match && match[1]) {
        displayMessage = match[1].trim();
      }
    }

    dispatchErrorEvent({
      message: displayMessage,
      statusCode: error.status,
    });
  }
}
