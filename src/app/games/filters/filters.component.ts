import { 
  Component, 
  ElementRef,
  EventEmitter, 
  OnDestroy, 
  OnInit, 
  Output,  
  ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  // Outputs
  @Output() priceSelected = new EventEmitter<number>();
  @Output() tagSelected = new EventEmitter<{name: string, status: boolean}>();
  // Form elements
  filtersForm = new FormGroup({
    adventure: new FormControl(null),
    action: new FormControl(null),
    indie: new FormControl(null),
  });
  priceFilterInput = new FormControl(0);
  // Subscriptions
  tagSubscriptions: Subscription[] = [];
  priceFilterSub: Subscription;
  @ViewChild('priceFilterInputEl') priceFilterInputEl: ElementRef;

  constructor() { }

  ngOnInit(): void {
    let i = 0;
    const controls = Object.values(this.filtersForm.controls);
    const controlNames = Object.keys(this.filtersForm.controls);
    for (let control of controls) {
      const controlName = controlNames[i];
      this.tagSubscriptions[i] = control.valueChanges.subscribe((val: boolean) => {
        const emittedTag = {
          name: controlName,
          status: val
        };
        this.tagSelected.emit(emittedTag);
      });
      ++i;
    }

    this.priceFilterSub = this.priceFilterInput.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe((val: number) => {
        this.priceSelected.emit(val);
      });
  }

  ngOnDestroy(): void {
    this.tagSubscriptions.forEach(sub => {
      sub.unsubscribe();
    });
    this.priceFilterSub.unsubscribe();
  }
}
