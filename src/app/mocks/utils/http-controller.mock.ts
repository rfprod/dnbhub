import { HttpRequest } from '@angular/common/http';
import { HttpTestingController, RequestMatch, TestRequest } from '@angular/common/http/testing';

export type THttpRequestMatcher<T> = string | RequestMatch | ((req: HttpRequest<T>) => boolean);

export function flushHttpRequests<T>(
  httpController: HttpTestingController,
  verify = false,
  matcher: THttpRequestMatcher<T> = (req: HttpRequest<T>): boolean => true,
  responseData: unknown = {},
): void {
  httpController.match(matcher).forEach((req: TestRequest) => {
    req.flush(responseData);
  });
  if (verify) {
    httpController.verify();
  }
}
