import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, ReplaySubject, defer } from 'rxjs';
import { map, tap, catchError, retry } from 'rxjs/operators';

import { City, Pending, Status,
         AutocompletedCity,
         GeocodeCity, CityCoords, CityWeather } from './city';


@Injectable({
  providedIn: 'root',
})
export class CityService {

  lastTimeUpdated: Date; // last time weather was updated

  constructor(
    private http: HttpClient
  ) {
  }

  // Is LocalStorage empty?
  isLSEmpty(): boolean {

    if(localStorage.getItem('cities')) {
      return false;
    }
    return true;
  }

  // Get saved cities from the LocalStorage
  getSaved(): Observable<City[]> {

    const saved_cities = JSON.parse(localStorage.getItem('cities'));
    return of(saved_cities);
  }

  // Remove city from the LocalStorage by its ID
  removeCityByID(id: string) {

    this.getSaved().subscribe(res => {
      res.forEach((el, index) => {
        if(el.locationId === id) res.splice(index, 1);
      });

      // if it was not the last city, then we update 
      // our cities-object in the LocalStorage
      if(res.length !== 0) {
        localStorage.setItem('cities', JSON.stringify(res));
      } else {

        // if it was the last city of the list, 
        // then we also remove two items: cities and lastUpdate
        localStorage.removeItem('cities');
        localStorage.removeItem('lastUpdate');
      }

    });    
  }

  // Get autocomplete results based on users input.
  // We use HERE API for that purpose.
  loadAutocompletedCities(str: string): Pending<AutocompletedCity> {
    const status = new ReplaySubject<Status>();

    let autocompleteURL = "https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?";
    
    const params = new HttpParams()
      .set('query', str)
      .set('language', "en")
      .set('resultType', "city")
      .set('maxresults', "15")
      .set('apiKey', "YOUR_API_KEY");

    const request = this.http.get<AutocompletedCity[]>(autocompleteURL, {params})
      .pipe(
        map(data => data['suggestions']),
        retry(2),
        catchError(error => {
          status.next(Status.ERROR);
          throw 'Error loading suggestions';
        }),
        tap((data) => {
          if(data.length == 0) {
            status.next(Status.EMPTY);
          } else {
            status.next(Status.SUCCESS);
          }
        })
      );

    const data = defer(() => {
      status.next(Status.LOADING);
      return request;
    });

    return { data, status };
  }

  // Get city's coordinates from HERE API.
  // We should use separate request for coords because 
  // HERE API doesn't give us these from autocomplete request
  loadCityCoordinates(_lbl: string): Pending<GeocodeCity> {

    const status = new ReplaySubject<Status>();

    let autocompleteURL = "https://geocode.search.hereapi.com/v1/geocode?";
    
    const params = new HttpParams()
      .set('q', _lbl)
      .set('language', "en")
      .set('apiKey', "YOUR_API_KEY");

    const request = this.http.get<GeocodeCity[]>(autocompleteURL, {params})
      .pipe(
        map(data => data['items']),
        retry(2),
        catchError(error => {
          status.next(Status.ERROR);
          throw 'Error loading coordinates';
        }),
        tap((data) => {
          // if(data.length == 0) {
          //   status.next(Status.EMPTY);
          // } else {
            status.next(Status.SUCCESS);
          // }
          // console.log(data);
        })
      );

    const data = defer(() => {
      status.next(Status.LOADING);
      return request;
    });

    return { data, status };
  }

  // Get city's current weather and timezone from openweathermap.org API.
  // We use city coordinates as input data.
  loadCityWeather(_coords: CityCoords): Pending<CityWeather> {

    const status = new ReplaySubject<Status>();

    let autocompleteURL = "https://api.openweathermap.org/data/2.5/weather?";

    const params = new HttpParams()
      .set('lat', _coords.lat.toString())
      .set('lon', _coords.lng.toString())
      .set('appid', "YOUR_APP_ID");

    const request = this.http.get<CityWeather[]>(autocompleteURL, {params})
      .pipe(
        retry(2),
        catchError(error => {
          status.next(Status.ERROR);
          throw 'Error loading weather';
        }),
        tap((data) => {
          // if(data.length == 0) {
          //   status.next(Status.EMPTY);
          // } else {
            status.next(Status.SUCCESS);
          // }
          // console.log(data);
        })
      );

    const data = defer(() => {
      status.next(Status.LOADING);
      return request;
    });

    return { data, status };
  }

  // Adding new city to the LocalStorage
  addNewCity(_city: AutocompletedCity) {
    
    let _coords: CityCoords;
    
    let saved_cities = [];

    // check if we've already got any cities in the LocalStorage
    if(!localStorage.getItem('cities')) {
      localStorage.setItem('cities', '{}'); // if not, we create empty object
    } else if(this.isCityExist(_city['locationId'])) { // if there are some cities added, we check existing of this particular city
      alert(_city['address']['city'] + ' is already saved!');
      return
    } else {
      saved_cities = JSON.parse(localStorage.getItem('cities')); // if this particular city doesn't exist, we get full list for further manipulation
    }

    // 1 - getting coordinates of city
    this.loadCityCoordinates(_city['label']).data.pipe(
      map(gdata => {
        if(gdata) {
          _coords = gdata[0]['position'];
        }
        else {
          alert("Sorry, something went wrong and I can't add this city...");
          return
        }
        
        // 2 - getting weather and timezone
        this.loadCityWeather(_coords).data
          .pipe(
            map(wdata => {

              // pack all our data to object with City model and push it to saved_cities object              
              saved_cities.push({
                locationId: _city['locationId'],
                city_name: _city['address']['city'], 
                state: _city['address']['state'],
                country_name: _city['address']['country'],
                coord: {
                    lon: _coords['lng'],
                    lat: _coords['lat']
                },
                timezone: wdata['timezone'],
                cur_time: '',
                cur_date: '',
                w_icon: '../../assets/icons/w_icons/' + wdata['weather'][0]['icon'] + '.png',
                w_description: wdata['weather'][0]['description'],
                w_temp_kelvin: wdata['main']['temp']
              });

              // Write updated object to the LocalStorage 
              localStorage.setItem('cities', JSON.stringify(saved_cities));

              // Save the time of weather update
              this.setLastWeatherUpdate();

              // We also change icon in the autocomleted list 
              // from "add" to "saved"
              const parentElem = document.getElementById(_city['locationId']);
              const iconElem = parentElem.querySelector('.add');
              iconElem.setAttribute( 'src', '../../assets/icons/saved.png' );
              iconElem.setAttribute( 'class', 'icon saved' );

            })
          )
          .subscribe(wdata => wdata);
      })
    ).subscribe(gdata => gdata);

  }

  // Check if city exists
  isCityExist(_id: string): boolean {

    const cities = JSON.parse(localStorage.getItem('cities'));

    for (let index = 0; index < cities.length; index++) {
      if(_id === cities[index]['locationId']) { return true; }
    }

    return false;
  }

  // Check the last time of getting weather update.
  // If it more than 1 hour from last update, we update it.
  isWeatherUpToDate(): boolean {

    const lastTime = localStorage.getItem('lastWeatherUpdate');

    if(!lastTime) {
      return false;
    }

    const timeFromLastUpdate = (Date.parse(Date()) - Date.parse(lastTime))

    // If it is more than 1 hour (3 600 000 ms) from the last update,
    // it is time to update weather
    if( timeFromLastUpdate > 3_600_000 ) {
      return false;
    }
    return true;
  }

  setLastWeatherUpdate() {
    localStorage.setItem('lastWeatherUpdate', Date());
  }

  // Update weather (using openweathermap.org API)
  updateWeather() {

    // Only works if we got saved cities or 
    // if it's more than 1 hour from the last update
    if(!localStorage.getItem('cities')) {
      return
    }
    if(this.isWeatherUpToDate() === true) {
      return
    }
    
    const cities_coords = []

    // We update weather with city's coords
    this.getSaved().pipe(
      map(data => {
        data.forEach(el => {
          cities_coords.push({'id': el.locationId, 'coord': {'lat': el.coord.lat, 'lng': el.coord.lon} })
        })
      })
    ).subscribe(data => data);


    cities_coords.forEach(cdata => {

      // After we got coords, we request new weather data
      this.loadCityWeather(cdata['coord']).data.pipe(
        map(wdata => {
          
          // Updating template
          const parentElem = document.getElementById(cdata['id']);
          const iconElem = parentElem.querySelector('.w-icon');
          const tempElem = parentElem.querySelector('.w-temp');

          iconElem.setAttribute( 'src', '../../assets/icons/w_icons/' + wdata['weather'][0]['icon'] + '.png' );
          iconElem.setAttribute( 'title', wdata['weather'][0]['description'] );
          tempElem.textContent = ( wdata['main']['temp'] - 273.15).toFixed(0).toString();

          // Updating cities-object in the LocalStorage
          const saved_cities = JSON.parse(localStorage.getItem('cities'));
          saved_cities.forEach((element: any) => {
            if(element.locationId === cdata['id']) {
              element.w_icon = '../../assets/icons/w_icons/' + wdata['weather'][0]['icon'] + '.png';
              element.w_description = wdata['weather'][0]['description'];
              element.w_temp_kelvin = wdata['main']['temp'];
            }
          }); 

          // Write updated object to the LocalStorage 
          localStorage.setItem('cities', JSON.stringify(saved_cities));
          this.setLastWeatherUpdate();
          
          console.log('🌤WeatherService: Weather Updated!');
        })
      ).subscribe(wdata => wdata);
    })
  }

}
