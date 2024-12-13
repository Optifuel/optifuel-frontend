import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { SearchService } from '../../services/search.service';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [FormsModule, AutoComplete],
  providers: [SearchService],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})
export class SearchBoxComponent {
  constructor(private searchService: SearchService) {}
  items: any[] = [];
  value: any;

  search(event: any): void {
    const query = event.query;
    const sessionToken = "f1e7b1b0-3b3b-4b3b-8b3b-3b3b3b3b3b3b";
    this.searchService.searchSuggestions(query, sessionToken).subscribe({
      next: (data) => {
        this.items = data.suggestions.map((item: any) => item.name);
        console.log('Risultati:', this.items);
      },
      error: (err) => console.error('Errore durante la ricerca:', err),
    });
  }

}
// https://api.mapbox.com/search/searchbox/v1/suggest/?q=bar&access_token=pk.eyJ1Ijoic2FudGFsMTIxMCIsImEiOiJjbTQ2dnRwM2UxOWcwMmtxeHRqd2ppZmhjIn0.PMYKUNf0nPFK5soI4Eu10w&session_token=f1e7b1b0-3b3b-4b3b-8b3b-3b3b3b3b3b3b&language=it&limit=10&types=country,region,district,postcode,locality,place,neighborhood,address,poi,street,category

