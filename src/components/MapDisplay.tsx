import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, View } from 'react-native';
import { MAPBOX_TOKEN, DEFAULT_ZOOM, DEMO_MODE } from '../constants';
import { getBoundingBox } from '../services/mapboxApi';
import { Coordinate, RunRoute } from '../types';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

interface Props {
  location: Coordinate;
  route: RunRoute | null;
}

export function MapDisplay({ location, route }: Props) {
  const center: [number, number] = [location.longitude, location.latitude];

  const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> | null = route
    ? {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates.map((c) => [c.longitude, c.latitude]),
        },
      }
    : null;

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Street}>
        {route ? (
          <MapboxGL.Camera
            bounds={{
              ...getBoundingBox(route.coordinates),
              paddingTop: 100,
              paddingBottom: 100,
              paddingLeft: 40,
              paddingRight: 40,
            }}
            animationMode="flyTo"
            animationDuration={1000} // animated transition when route is generated
          />
        ) : (
          <MapboxGL.Camera
            zoomLevel={DEFAULT_ZOOM}
            centerCoordinate={center}
            animationMode="flyTo"
            animationDuration={1000}
          />
        )}

        {/* Show real GPS dot in normal mode, fake marker in demo mode */}
        {DEMO_MODE ? (
          <MapboxGL.PointAnnotation id="demo-location" coordinate={center}>
            <View style={styles.markerOuter}>
              <View style={styles.markerInner} />
            </View>
          </MapboxGL.PointAnnotation>
        ) : (
          <MapboxGL.UserLocation visible androidRenderMode="gps" />
        )}

        {routeGeoJSON && (
          <MapboxGL.ShapeSource id="route-source" shape={routeGeoJSON}>
            <MapboxGL.LineLayer
              id="route-line"
              style={{
                lineColor: '#4CAF50',
                lineWidth: 4,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  markerOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(66, 133, 244, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
