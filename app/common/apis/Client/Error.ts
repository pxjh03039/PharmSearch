export interface ErrorEventDetail {
  message: string;
  statusCode?: number;
}

export const ERROR_EVENT_NAME = "api-error";

export function dispatchErrorEvent(detail: ErrorEventDetail) {
  const event = new CustomEvent(ERROR_EVENT_NAME, { detail });
  window.dispatchEvent(event);
}
