import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [FormsModule, AutoCompleteModule, ButtonModule],
  providers: [SearchService],
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {
  items: any[] = [];
  value: any;
  filteredItems: any[] = [];

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {}

  search(event: any): void {
    const query = event.query;
    const sessionToken = 'f1e7b1b0-3b3b-4b3b-8b3b-3b3b3b3b3b3b';
    this.searchService.searchSuggestions(query, sessionToken).subscribe({
      next: (data) => {
        this.items = data.suggestions;
        console.log(this.items);
      },
      error: (err) => console.error('Error fetching suggestions:', err),
    });
  }
}