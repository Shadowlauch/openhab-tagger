import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  $items: Observable<any[]>;

  form: FormGroup;

  constructor(private svc: AppService, fb: FormBuilder) {
    this.form = fb.group({
      search: ''
    });
  }

  ngOnInit(): void {
    this.$items = this.svc.getItems().pipe(
      switchMap(items => {
        return this.form.get('search').valueChanges.pipe(
          startWith(''),
          distinctUntilChanged(),
          debounceTime(50),
          map(search => {
            if (search === '') {
              return items;
            } else {
              return items.filter(i => i.label && i.label.toLowerCase().includes(search.toLowerCase()));
            }
          })
        );
      })
    );
  }

  add(event: MatChipInputEvent, item: any): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      item.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string, item: any) {
    const index = item.tags.findIndex(t => t === tag);

    if (index !== -1) {
      item.tags.splice(index, 1);
    }
  }

  save(item: any) {
    this.svc.saveItem(item).subscribe(res => console.log(res));
  }
}
