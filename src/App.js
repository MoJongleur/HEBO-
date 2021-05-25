// Modules
import React, {useRef, useState} from "react";
import {YMaps, Map, Placemark, Polygon, Polyline} from 'react-yandex-maps';
import {useDispatch, useSelector} from "react-redux";
// css
import './App.css';
// const
import constant from './const';
// action
import {requestSuccess, saveRequest, waitRequest} from "./redux/action";
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

  const status = useSelector((state) => state.map);

  const onMapClick = async (e) => {
    const coords = e.get("coords");
    const closed = refMkad.current.geometry.getClosest(coords);

    await ymaps.geocode(coords).then(res => {
      dispatch(saveRequest({coords, closed, name: res.geoObjects.get(0).getAddressLine()}));
    });

    displayMap(coords, closed)
  };

  const displayMap = (coords, closed) => {
    if( ymaps && !status.wait ) {

      dispatch(waitRequest());

      setMyPlacemark(coords);
      setMyGeoLine(closed);

      refMap.current.geoObjects.remove(multiR);

      ymaps.route([
        [55.76, 37.64],
        coords
      ]).then(function (route) {

        //составляем коллекцию сегментов пути
        var pathsObjects = ymaps.geoQuery(route.getPaths()),
          edges = [];

        //переберём сегменты и разобьём их на отрезки-линии
        pathsObjects.each(function (path) {
          var coordinates = path.geometry.getCoordinates();
          for (var i = 1, l = coordinates.length; i < l; i++) {
            edges.push({
              type: 'LineString',
              coordinates: [coordinates[i], coordinates[i - 1]]
            });
          }
        });

        // добавим эту выборку на карту, но показывать не будем
        // она нужна только для расчётов
        var routeObjects = ymaps.geoQuery(edges).setOptions('visible', false).addToMap(refMap.current);
        //находим сегменты, попадающие внутрь мкад
        var objectsInMoscow = routeObjects.searchInside(refMkad.current);
        //объекты за пределами МКАД получим исключением полученных выборок из исходной (так проще!).
        var objectsOutMoscow = routeObjects.remove(objectsInMoscow);
        //находим начальную точку полученной выборки
        var start_coords = objectsOutMoscow.get(0).geometry.getCoordinates()[1];
        //удаляем расчётный маршрут с карты
        routeObjects.removeFromMap(refMap.current);

        //строим маршрут от стартовой точки до клика
        ymaps.route([
          start_coords,
          coords
        ]).then(function (needed_route) {
          //длина маршрута
          var distance = Math.round(needed_route.getLength()/1000);
          console.log(distance + 'км по дороге')
          console.log(closed.distance/1000 + 'км по воздуху')

          needed_route.options.set({ strokeWidth: 10, strokeColor: '#000000', wayPointVisible: false });
          refMap.current.geoObjects.add(needed_route);

          setMultiR(needed_route);

          dispatch(requestSuccess());

        });
      });

    }
  };

  return (
    <div style={{display: 'flex', width: '100%', height: '100%'}}>
      {status.wait ? <div style={{backgroundColor: 'white', opacity: 0.5, width: '100%', height: '100%', position: 'absolute', zIndex: 999}}></div> : null}
      <YMaps
        query={{ apikey: constant.yandexKey }}
        >
        <div className="app">
          <Map
            width="100%"
            height="100%"
            modules={["multiRouter.MultiRoute", "geocode", "route", "geoQuery"]}
            defaultState={{ center: [55.76, 37.64], zoom: 10 }}
            onClick={onMapClick}
            instanceRef={refMap}
            onLoad={ymaps => setYmaps(ymaps)} >
            <Polygon
              instanceRef={refMkad}
              geometry={constant.mkad_km}
            />
            { myGeoLine && !status.wait ?
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
