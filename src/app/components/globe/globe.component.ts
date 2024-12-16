import { Component, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '../../../environments/environment';
import { ShellService } from '../../services/shell.service';
import { PointLike } from 'mapbox-gl';

@Component({
  selector: 'app-globe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GlobeComponent {
  public style = environment.mapbox_style;
  public lat = 37.75;
  public lng = -122.41;
  public mapInteraction = true;
  public isSpinning = true;

  public gotoOffset: PointLike = [120, 20];

  private token: string = environment.mapbox_token;
  private map!: mapboxgl.Map;

  constructor(private renderer: Renderer2, private shell: ShellService) {}

  ngOnInit(): void {
    this.loadScripts()
      .then(() => this.initializeMap())
      .catch((error) => console.error('Error loading scripts', error));
  }

  private async loadScripts(): Promise<void> {
    await this.loadScript(environment.mapbox_script);
    await this.loadScript(environment.mapbox_css);
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (error: any) => reject(error);
      this.renderer.appendChild(document.body, script);
    });
  }

  private initializeMap(): void {
    this.map = new mapboxgl.Map({
      accessToken: this.token,
      container: 'map',
      zoom: 1.3,
      center: [41.9027835, 12.4963655],
      interactive: this.mapInteraction,
      style: {
        version: 8,
        imports: [
          {
            id: 'basemap',
            url: environment.mapbox_style,
            config: {
              lightPreset: 'night',
            },
          },
        ],
        sources: {},
        layers: [],
      },
    });

    this.map.on('load', () => {
      this.map.setConfigProperty('basemap', 'show3dObjects', false);
      this.map.setConfigProperty('basemap', 'fog', false);
      this.addPulsingDot();
    });

    this.shell.mapSpinning.subscribe((spinning: boolean) => {
      this.isSpinning = spinning;
      this.spinGlobe();
      this.map.on('moveend', () => this.spinGlobe());
    });

    this.shell.gotoPOIEvent.subscribe((poi: any) => {
      this.gotoPOI(poi);
    });

    this.managePOIsInsertion();
  }

  private gotoPOI(poi: any): void {
    this.map.easeTo({
      center: poi.geometry.coordinates,
      zoom: 12,
      duration: 1000,
      offset: this.gotoOffset,
    });
  }

  private addPulsingDot(): void {
    const size = 200;
    const map = this.map; // Reference to the map instance

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

          this.data = new Uint8Array(
            this.context.getImageData(0, 0, this.width, this.height).data.buffer
          );

          // Use the `map` reference from the enclosing scope
          map.triggerRepaint();
          return true;
        }
        return false;
      },
    };

    this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

    navigator.geolocation.getCurrentPosition((position) => {
      const coordinates = [position.coords.longitude, position.coords.latitude];
      this.map.addSource('dot-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates },
              properties: {},
            },
          ],
        },
      });

      this.map.addLayer({
        id: 'layer-with-pulsing-dot',
        type: 'symbol',
        source: 'dot-point',
        layout: {
          'icon-image': 'pulsing-dot',
          'icon-size': 0.3,
        },
      });
    });
  }

  private spinGlobe(): void {
    const secondsPerRevolution = 120;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    const zoom = this.map.getZoom();
    if (zoom < maxSpinZoom && this.isSpinning) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = this.map.getCenter();
      center.lng -= distancePerSecond;
      this.map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  }

  private managePOIsInsertion(): void {
    this.shell.POIs.subscribe((pois: any[]) => {
      // Delete all markers
      const markers = document.getElementsByClassName('custom-marker');
      while (markers.length > 0) {
        markers[0].remove();
      }

      if (pois.length === 0) {
        return;
      }

      // Last POI
      const poi = pois[pois.length - 1];
      
      // Goto the last POI
      this.shell.stopSpinningMap();
      this.gotoPOI(poi);

      // Add all markers
      pois.forEach((poi, index) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.textContent = (index + 1).toString();

        new mapboxgl.Marker(el)
          .setLngLat(poi.geometry.coordinates)
          .addTo(this.map);
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
