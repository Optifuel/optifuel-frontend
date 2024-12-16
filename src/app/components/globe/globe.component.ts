import { Component, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';

import { environment } from '../../../environments/environment';
import { ShellService } from '../../services/shell.service';

@Component({
  selector: 'app-globe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './globe.component.html',
  styleUrl: './globe.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GlobeComponent {
  public style = environment.mapbox_style;
  public lat = 37.75;
  public lng = -122.41;
  public mapInteraction = true;
  public isSpinning = true;
  public userInteracting = false;

  private token: string = environment.mapbox_token;
  private selectedPOIs: any[] = [];

  constructor(private renderer: Renderer2, private shell: ShellService) {}

  ngOnInit() {
    loadScript(environment.mapbox_script, this.renderer)
      .then(() => loadScript(environment.mapbox_css, this.renderer))
      .then(() => loadScript(environment.mapbox_script, this.renderer))
      .catch((error) => console.error('Error loading scripts', error));

    // Initialize the map
    let map = new mapboxgl.Map({
      accessToken: this.token,
      container: 'map',
      // style: environment.mapbox_style,
      zoom: 1.3,
      center: [41.9027835, 12.4963655],
      interactive: this.mapInteraction,
      style: {
        version: 8,
        imports: [
          {
            id: "basemap",
            url: environment.mapbox_style,
            config: {
              lightPreset: "night"
            }
          }
        ],
        sources: {},
        layers: []
      }
    });
    // Add the pulsing dot
    this.addPulsingDot(map);


    // Emit the spinning value
    this.shell.subscribeToEvent('mapSpinning', (spinning: boolean) => {
      this.isSpinning = spinning;
    });

    // Manage the spinning of the globe
    // spinGlobe(map, this.isSpinning);
    // map.on('moveend', () => {
    //   spinGlobe(map, this.isSpinning);
    // });

    // Manage the insertion of POIs
    map = managePOIsInsertion(map, this.shell, this.renderer);
  }

  public addPulsingDot(map: mapboxgl.Map) {
    // Create the pulsing dot
    const size = 200;
    const pulsingDot: StyleImageInterface = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d')!;
      },

      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        if (this.context) {
          // Draw the outer circle.
          this.context.clearRect(0, 0, this.width, this.height);
          this.context.beginPath();
          this.context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          this.context.fillStyle = `rgba(45, 85, 255, ${1 - t})`;
          this.context.fill();

          // Draw the inner circle.
          this.context.beginPath();
          this.context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
          );
          this.context.fillStyle = 'rgba(45, 85, 255, 1)';
          this.context.strokeStyle = 'white';
          this.context.lineWidth = 6 + 4 * (1 - t);
          this.context.fill();
          this.context.stroke();

          // Update this image's data with data from the canvas.
          this.data = new Uint8Array(
            this.context.getImageData(0, 0, this.width, this.height).data.buffer
          );

          // Continuously repaint the map, resulting in the smooth animation of the dot.
          map.triggerRepaint();

          // Return `true` to let the map know that the image was updated.
          return true;
        } else {
          console.error('context is null');
          return false;
        }
      },
    };

    // Add the pulsing dot to the map
    map.on('load', () => {
      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
      let coordinates;

      navigator.geolocation.getCurrentPosition(function (position) {
        coordinates = [position.coords.longitude, position.coords.latitude];
        console.log(coordinates);

        map.addSource('dot-point', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: coordinates,
                },
                properties: {},
              },
            ],
          },
        });

        // Check if the dot-point source exists and is valid
        if (!map.getSource('dot-point')) {
          console.error('dot-point source does not exist');
        }

        map.addLayer({
          id: 'layer-with-pulsing-dot',
          type: 'symbol',
          source: 'dot-point',
          layout: {
            'icon-image': 'pulsing-dot',
            'icon-size': 0.3,
            visibility: 'visible',
          },
        });
        if (!map.getLayer('layer-with-pulsing-dot')) {
          console.error('layer-with-pulsing-dot does not exist');
        }
      });
    });
  }
}

interface StyleImageInterface {
  width: number;
  height: number;
  data: Uint8Array;
  onAdd: () => void;
  render: () => boolean;
  context?: CanvasRenderingContext2D;
}

function loadScript(src: string, renderer: Renderer2): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = renderer.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (error: any) => reject(error);
    renderer.appendChild(document.body, script);
  });
}

function spinGlobe(map: mapboxgl.Map, isSpinning: boolean) {
  const secondsPerRevolution = 120;
  const maxSpinZoom = 5;
  const slowSpinZoom = 3;
  const zoom = map.getZoom();
  if (zoom < maxSpinZoom && isSpinning) {
    let distancePerSecond = 360 / secondsPerRevolution;
    if (zoom > slowSpinZoom) {
      const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
      distancePerSecond *= zoomDif;
    }
    const center = map.getCenter();
    center.lng -= distancePerSecond;
    map.easeTo({ center, duration: 1000, easing: (n) => n });
  }
}

function managePOIsInsertion(
  map: mapboxgl.Map,
  shell: ShellService,
  renderer: Renderer2
): mapboxgl.Map {
  const selectedPOIs: any[] = [];
  shell.subscribeToEvent('addPOI', (poi: any) => {
    selectedPOIs.push(poi);
    shell.emitEvent('mapSpinning', false);
    map.easeTo({
      center: poi.geometry.coordinates,
      zoom: 12,
      duration: 1000,
    });
    new mapboxgl.Marker().setLngLat([poi.geometry.coordinates[0], poi.geometry.coordinates[1]]).addTo(map);
    // center the map on the POI
    // map.addSource(poi.properties.name, {
    //   type: 'geojson',
    //   data: {
    //     type: 'FeatureCollection',
    //     features: selectedPOIs,
    //   },
    // });
    // map.addLayer({
    //   id: poi.properties.name,
    //   type: 'circle',
    //   source: poi.properties.name,
    //   paint: {
    //     'circle-radius': 10,
    //     'circle-color': '#FF0000',
    //   },
    // });
  });
  if (selectedPOIs.length > 0) {
    const map = new mapboxgl.Map({
      accessToken: environment.mapbox_token,
      container: 'map',
      style: environment.mapbox_style,
      zoom: 1.2,
      center: [41.9027835, 12.4963655],
      interactive: true,
    });
    
    
    return map;
  } else {
    return map;
  }
}


