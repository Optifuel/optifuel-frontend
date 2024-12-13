import { Component, OnInit, DoCheck } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Select } from 'primeng/select';
import { Knob } from 'primeng/knob';
import { AutoComplete } from 'primeng/autocomplete';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Renderer2 } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [Select, Knob, AutoComplete, ProgressSpinner],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.scss'
})
export class NavigatorComponent  {
  
}
