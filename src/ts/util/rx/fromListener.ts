import {Observable, Subject, Subscriber} from "rxjs/index";

export const fromListener = function<T>(addListener: (listener: (t: T) => void) => void): Observable<T> {
    const observable = new Subject<T>();
    addListener(e => observable.next(e));
    return observable;
};