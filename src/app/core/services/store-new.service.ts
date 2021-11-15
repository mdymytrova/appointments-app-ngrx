import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export abstract class StoreServiceNew<T> {
    private stateSubject: BehaviorSubject<T>;
    
    protected get state(): T {
      return this.stateSubject.getValue();
    }
  
    constructor(initialState: T) {
      this.stateSubject = new BehaviorSubject<T>(initialState);
    }
  
    select<K>(mapFn: (state: T) => K): Observable<K> {
      return this.stateSubject.asObservable().pipe(
        map((state: T) => mapFn(state)),
        distinctUntilChanged()
      );
    }
  
    setState(newState: Partial<T>) {
      this.stateSubject.next({
        ...this.state,
        ...newState,
      });
    }
}