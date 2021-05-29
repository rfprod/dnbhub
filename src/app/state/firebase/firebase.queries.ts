import { QueryFn } from '@angular/fire/database';

const orderByValueEqChildKey: (childKey: string) => QueryFn =
  (childKey: string) => (ref: firebase.default.database.Reference) =>
    ref.orderByValue().equalTo(childKey);

const orderByKey: QueryFn = (ref: firebase.default.database.Reference) => ref.orderByKey();

const orderByPriority: QueryFn = (ref: firebase.default.database.Reference) =>
  ref.orderByPriority();

const orderByValue: QueryFn = (ref: firebase.default.database.Reference) => ref.orderByValue();

const limitToLast: (n: number) => QueryFn =
  (n: number) => (ref: firebase.default.database.Reference) =>
    ref.limitToLast(n);

export const queries = {
  orderByValueEqChildKey,
  orderByKey,
  orderByPriority,
  orderByValue,
  limitToLast,
};
