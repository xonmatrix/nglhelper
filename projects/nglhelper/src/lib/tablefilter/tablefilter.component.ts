import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { HttpHelper } from '../http/httphelper';

@Component({
    selector: 'table-filter',
    templateUrl: './tablefilter.component.html',
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFilterComponent {

    constructor(private http: HttpHelper, private cdr: ChangeDetectorRef) { }

    filterTypes: Array<any> = [];
    filterItems: Array<any> = [{
        Type: 'None',
        FilterTypes: this.getFilterTypes('All'),
    }];
    currFilter = {};

    @Output()
    filterChange = new EventEmitter<any>();

    @Input()
    set FilterTypes(val) {
        this.filterTypes = val;
        this.buildFilterItems();
        this.cdr.markForCheck();
    }


    private buildFilterItems() {
        // rebuild filter items.
        for (let i = this.filterItems.length - 1; i >= 0; i--) {
            const def = this.filterTypes.find(f => f.Type === this.filterItems[i].Type);
            if (!def) {
                this.filterItems.splice(i, 1);
                continue;
            }
            this.filterItems[i].FilterTypes = this.getFilterTypes(this.filterItems[i].Type);
        }
    }

    @Input()
    set filter(val) {
        if (this.currFilter === val)
            return;

        if (Array.isArray(val)) // backward compatible
            this.currFilter = {};
        else
            this.currFilter = val;

       
        // from currFilter object bind back to filterItems

        const selectedKey = [];

        // add unselected 
        for (const key in this.currFilter) {
            if (this.currFilter.hasOwnProperty(key)) {
                if (!this.filterItems.some(a => a.Type === key)
                    && this.filterTypes.some(a => a.Type === key)) {
                    const f: any = {
                        Type: key,
                        FilterTypes: []
                    };
                    this.filterItems.push(f);
                    this.selectFilterType(f);
                    selectedKey.push(key);
                }
            }
        }

        for (let i = this.filterItems.length - 2; i >= 0; i--) {
            if (this.filterItems[i].Type !== 'None' && !selectedKey.some(a => this.filterItems[i].Type === a))
                this.filterItems.splice(i, 1);
        }

        // remove extra.
        this.finallizeSelectionList();
        setTimeout(() => {
            this.cdr.markForCheck();
        }, 0);
        this.cdr.markForCheck();
    }

    filterValueChanged() {
        this.filterChange.next(this.currFilter);
        this.cdr.markForCheck();
    }

    selectFilterType(filter) {
       
        let f :any= this.filterTypes.find(a => a.Type === filter    .Type);
        if (!f) {
            f = {};
            f.Type = 'None';
            f.Field = '';
            return;
        }

        filter.Type = f.Type;
        filter.Field = f.Field;

        if (f.Field === 'multi' || f.Field === 'dropdown') {
            filter.Source = [];
            if (f.SourceTable) {
                this.http.Get$(f.SourceTable)
                    .subscribe((items) => {
                        filter.Source = items;
                    });
            } else if (f.SourceItem) {
                filter.Source = f.SourceItem;
            }

            if (f.hasOwnProperty('Inject')) {
                filter.Source.push(f.Inject);
            }
        } else if (f.Field === 'lookup') {
            filter.SourceTable = f.SourceTable;
            filter.Source = [];
            if (this.currFilter[f.Type] !== undefined) {
                this.http.Post$(f.SourceTable + '/retrieve', {
                    Id: this.currFilter[f.Type]
                }, {
                        Loader: 'None'
                    }).subscribe((items) => {
                        filter.Source = items;
                        this.cdr.markForCheck();
                    });
            }
        } else {
            delete filter.Source;
            delete filter.SourceTable;
        }
    }

    filterLookup(filter, term) {
        if (filter.debouceTimer)
            clearTimeout(filter.debouceTimer);

        filter.debouceTimer = setTimeout(() => {
            this.http.Post$(filter.SourceTable, {
                Filter: term
            }, {
                    Loader: 'None'
                }).subscribe((items) => {
                    filter.Source = items;
                    this.cdr.markForCheck();
                });
        }, 300);

    }

    filterTypeChanged(filter) {

        this.selectFilterType(filter);

        // remove filter properties that is not in the lists.
        for (let key in this.currFilter) {
            if (!this.filterItems.some(a => a.Type === key))
                delete this.currFilter[key];
        }

        this.finallizeSelectionList();
    }

    finallizeSelectionList() {
        // remove none from middle.
        for (let i = this.filterItems.length - 2; i >= 0; i--) {
            if (this.filterItems[i].Type === 'None')
                this.filterItems.splice(i, 1);
        }

        // add none if there isn't any
        if (this.filterItems[this.filterItems.length - 1].Type !== 'None')
            this.filterItems.push({
                Type: 'None',
                FilterTypes: this.getFilterTypes('All'),
            });

        this.buildFilterItems();
        this.cdr.markForCheck();
    }

    getFilterTypes(currentType?) {
        return this.filterTypes.filter((s) => {
            if (s.Type == 'None' || s.Type == currentType || currentType === 'All') // alway allow none or current selection
                return true;

            return (this.filterItems.findIndex((a) => s.Type == a.Type) < 0);
        }).map((a) => {
            return { Type: a.Type, Display: a.Display };
        });
    }
}