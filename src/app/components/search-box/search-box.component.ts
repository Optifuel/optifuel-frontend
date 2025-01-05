import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';

import { AutoCompleteModule } from 'primeng/autocomplete';

import { SearchService } from '../../services/search.service';
import { ShellService } from '../../services/shell.service';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  providers: [SearchService],
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchBoxComponent implements OnInit {
  items: any[] = [];
  value: any;
  filteredItems: any[] = [];

  constructor(private searchService: SearchService, private shell: ShellService) {}

  ngOnInit(): void {}

  search(event: any): void {
    const query = event.query;
    const sessionToken = 'f1e7b1b0-3b3b-4b3b-8b3b-3b3b3b3b3b3b';
    this.searchService.searchSuggestions(query, sessionToken).subscribe({
      next: (data) => {
        this.items = data.suggestions;
      },
      error: (err) => console.error('Error fetching suggestions:', err),
    });
  }

  addPOItoTrip(event: any): void {
    this.searchService.getPOIDetails(event.value.mapbox_id, 'f1e7b1b0-3b3b-4b3b-8b3b-3b3b3b3b3b3b').subscribe({
      next: (data) => {        
        this.shell.addPOI(data.features[0]);
        this.value = '';
      },
      error: (err) => console.error('Error fetching POI details:', err),
    });
  }
}