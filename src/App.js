// Modules
import React, {useRef, useState} from "react";
import {YMaps, Map, Placemark, Polygon, Polyline} from 'react-yandex-maps';
import {useDispatch} from "react-redux";
// css
import './App.css';
// const
import constant from './const';
// action
import {saveRequest} from "./redux/action";
// components
import HystoryList from './historyList'

function App() {
  const [myPlacemark, setMyPlacemark] = useState(null);
  const refMkad = useRef(null);
  const refMap = useRef(null);
  const [ymaps, setYmaps] = useState(null);
  const [multiR, setMultiR] = useState(null);
  const [myGeoLine, setMyGeoLine] = useState(null);
  const dispatch = useDispatch();

  const onMapClick = async (e) => {
    const coords = e.get("coords");
    const closed = refMkad.current.geometry.getClosest(coords);

    await ymaps.geocode(coords).then(res => {
      dispatch(saveRequest({coords, closed, name: res.geoObjects.get(0).getAddressLine()}));
    });

    displayMap(coords, closed)
  };

  const displayMap = (coords, closed) => {
    if( ymaps ) {

      setMyPlacemark(coords);
      setMyGeoLine(closed);

      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [closed.position, coords],
          params: {
            routingMode: "auto",
            results: 1,
          }
        },
        {
          boundsAutoApply: false,
          wayPointVisible: false
        }
      );

      if( multiR ) {
        refMap.current.geoObjects.remove(multiR)
      }
      setMultiR(multiRoute);
      refMap.current.geoObjects.add(multiRoute);
    }
  };

  return (
    <div style={{display: 'flex', width: '100%', height: '100%'}}>
      <YMaps
        query={{ apikey: constant.yandexKey }}
        >
        <div className="app">
          <Map
            width="100%"
            height="100%"
            modules={["multiRouter.MultiRoute", "geocode"]}
            defaultState={{ center: [55.76, 37.64], zoom: 10 }}
            onClick={onMapClick}
            instanceRef={refMap}
            onLoad={ymaps => setYmaps(ymaps)} >
            <Polygon
              instanceRef={refMkad}
              geometry={constant.mkad_km}
            />
            { myGeoLine ?
              <Polyline
                geometry={[myGeoLine.position, myPlacemark]}
                options={{
                  strokeColor: "#404040",
                  strokeWidth: 2
                }}
              />
            :
              null
            }
            { myPlacemark ? <Placemark geometry={myPlacemark} /> : null }
          </Map>
        </div>
      </YMaps>
      <HystoryList displayMap={displayMap}  />
    </div>
  )
};

export default App;
