import {Component, EventEmitter, HostListener, OnInit, Output, OnDestroy, Input} from "@angular/core";
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { CollectionsService } from '../../services/collections.service';
import {SearchResult} from '../../../shared/models/search-result.interface';

/**
 * @Component SearchBarComponent
 * @description
 * This component provides a search bar with manual autocomplete functionality.
 * It allows searching for both collections and items (wishes) depending on the `searchType`
 * and `currentCollectionId` inputs. Search results are retrieved via the `CollectionsService`
 * and presented as `SearchResult` objects. It supports keyboard navigation and option selection.
 *
 * @selector app-search-bar
 * @templateUrl ./search-bar.component.html
 * @styleUrls ./search-bar.component.css
 * @standalone true
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    CommonModule,
  ],
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  /**
   * @Input searchType
   * @description Defines the type of search to perform: 'collections' for top-level collections
   * or 'items' for items (wishes and subcollections) within a specific parent collection.
   */
  @Input() searchType: 'collections' | 'items' = 'collections';

  /**
   * @Input currentCollectionId
   * @description The ID of the current parent collection. This is required if `searchType` is 'items'
   * to search for elements within that specific collection.
   */
  @Input() currentCollectionId: number | null = null;

  /**
   * @Output optionSelected
   * @description Emits the complete `SearchResult` object when the user selects an option
   * from the autocomplete dropdown.
   */
  @Output() optionSelected = new EventEmitter<SearchResult>();

  /**
   * @Output searchPerformed
   * @description Emits the search text when the user presses the Enter key without
   * having selected an option from the autocomplete list.
   */
  @Output() searchPerformed = new EventEmitter<string>();

  /**
   * @property searchText
   * @description Model for the current value of the search input field.
   */
  searchText: string = '';

  /**
   * @property filteredOptions
   * @description An array of `SearchResult` objects displayed in the autocomplete dropdown.
   */
  filteredOptions: SearchResult[] = [];

  /**
   * @property showSuggestions
   * @description Controls the visibility of the suggestions dropdown.
   */
  showSuggestions: boolean = false;

  /**
   * @property highlightedOption
   * @description The currently highlighted option in the dropdown (for keyboard navigation).
   */
  highlightedOption: SearchResult | null = null;

  /**
   * @private searchInputSubject
   * @description A `Subject` used to manage user input with RxJS operators
   * like `debounceTime` and `distinctUntilChanged`.
   */
  private searchInputSubject = new Subject<string>();

  /**
   * @private destroy$
   * @description A `Subject` used for unsubscribing from observables
   * when the component is destroyed, preventing memory leaks.
   */
  private destroy$ = new Subject<void>();

  /**
   * @constructor
   * @param collectionsService The service for interacting with collection and search business logic.
   */
  constructor(private collectionsService: CollectionsService) { }

  /**
   * @method ngOnInit
   * @description Initializes the component. Sets up the RxJS pipeline for the `searchInputSubject`
   * to process user input with a debounce time and distinct value checks.
   */
  ngOnInit(): void {
    this.searchInputSubject.pipe(
      debounceTime(300), // Waits 300ms after the last keystroke to initiate the search
      distinctUntilChanged(), // Only proceeds if the text has changed from the previous value
      switchMap(value => this.filterResults(value)), // Calls the search service
      takeUntil(this.destroy$) // Unsubscribes when the component is destroyed
    ).subscribe(results => {
      this.filteredOptions = results;
      // Show suggestions only if there is text in the input and results were returned
      this.showSuggestions = this.searchText.length > 0 && results.length > 0;
      this.highlightedOption = null; // Resets highlighting when new options are loaded
    });
  }

  /**
   * @method ngOnDestroy
   * @description Lifecycle hook called when the component is destroyed.
   * Emits a value to trigger `takeUntil` to unsubscribe from all observables and completes the `Subject`.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @method onInputChange
   * @description Handles the `(input)` event from the search text field.
   * Updates `searchText` and emits the value to the `searchInputSubject`.
   * @param event The DOM input event.
   */
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.searchInputSubject.next(this.searchText);
    this.showSuggestions = true;
    this.highlightedOption = null;
  }

  /**
   * @private filterResults
   * @description Calls the appropriate service method (`searchCollections` or `searchItems`)
   * to fetch search results based on the `searchType` and the input value.
   * This function does not contain hardcoding; it retrieves data from the service.
   * @param value The current value of the search input.
   * @returns An `Observable` of `SearchResult[]`.
   */
  private filterResults(value: string): Observable<SearchResult[]> {
    if (!value.trim()) {
      return new Observable<SearchResult[]>(observer => observer.next([]));
    }

    if (this.searchType === 'collections') {
      return this.collectionsService.searchCollections(value);
    } else {
      if (this.currentCollectionId === null) {
        return new Observable<SearchResult[]>(observer => observer.next([]));
      }
      return this.collectionsService.searchItems(value, this.currentCollectionId);
    }
  }

  /**
   * @method selectOption
   * @description Handles the selection of an option from the autocomplete dropdown.
   * Updates the `searchText` and emits the selected `SearchResult` to the parent component.
   * @param option The `SearchResult` object that was selected.
   */
  selectOption(option: SearchResult): void {
    this.searchText = option.title;
    this.optionSelected.emit(option);
    this.showSuggestions = false;
    this.highlightedOption = null;
  }

  /**
   * @method onKeydown
   * @description Handles keyboard events for navigation and selection within the autocomplete.
   * Supports ArrowUp, ArrowDown, Enter, and Escape keys.
   * @param event The keyboard event.
   */
  onKeydown(event: KeyboardEvent): void {
    if (this.filteredOptions.length === 0 && event.key !== 'Enter') return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveHighlight(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveHighlight(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.highlightedOption) {
        this.selectOption(this.highlightedOption);
      } else {
        this.searchPerformed.emit(this.searchText);
        this.showSuggestions = false;
      }
    } else if (event.key === 'Escape') {
      this.showSuggestions = false; // Hides the dropdown
    }
  }

  /**
   * @method moveHighlight
   * @description Moves the highlight within the `filteredOptions` list.
   * The highlight wraps around from end to beginning and vice-versa.
   * @param direction The direction to move (1 for down, -1 for up).
   */
  moveHighlight(direction: number): void {
    if (this.filteredOptions.length === 0) {
      this.highlightedOption = null;
      return;
    }

    const currentIndex = this.highlightedOption
      ? this.filteredOptions.indexOf(this.highlightedOption)
      : -1;

    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      nextIndex = this.filteredOptions.length - 1;
    } else if (nextIndex >= this.filteredOptions.length) {
      nextIndex = 0; // Loops to the beginning
    }
    this.highlightedOption = this.filteredOptions[nextIndex];
  }

  /**
   * @method onClick
   * @description Listens for clicks anywhere in the document. If the click
   * is outside the search bar component, it hides the suggestions dropdown.
   * @param event The mouse event.
   */
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const searchBarElement = (event.target as HTMLElement).closest('.search-bar');
    if (!searchBarElement) { // If the click was NOT inside the search bar
      this.showSuggestions = false;
    }
  }

  /**
   * @method displayFn
   * @description A utility function to display the title of a `SearchResult` object.
   * (While not directly used for the input's display due to `ngModel`, it's a common pattern
   * in autocomplete components and can be useful for debugging or other displays).
   * @param item The `SearchResult` item to display.
   * @returns The title of the item, or an empty string if null/undefined.
   */
  displayFn(item: SearchResult): string {
    return item && item.title ? item.title : '';
  }
}
