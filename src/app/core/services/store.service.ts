import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export abstract class StoreService<T> {
    protected subject!: BehaviorSubject<T>;
    state$: Observable<T>;
    state: T;
    previous: T | undefined;

    protected abstract store: string;

    constructor(initialValue: Partial<T>) {
        this.subject = new BehaviorSubject<T>(initialValue as T);
        this.state$ = this.subject.asObservable();

        this.state = initialValue as T;
        this.state$.subscribe(s => {
            this.state = s;
        })
    }

    patch(newValue: Partial<T>) {
        this.previous = this.state;
        const newState = Object.assign({}, this.state, newValue);
        this.subject.next(newState);
    }

    set(newValue: Partial<T>) {
        this.previous = this.state;
        const newState = Object.assign({}, newValue) as T;
        this.subject.next(newState);
    }   
}