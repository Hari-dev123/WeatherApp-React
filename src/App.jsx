import { useEffect, useState } from 'react';
import './App.css';

import clearIcon from './assets/clear.png';
import cloudIcon from './assets/clouds.png';
import drizzleIcon from './assets/drizzle.png';
import humidityIcon from './assets/humidity.png';
import mistIcon from './assets/mist.png';
import rainIcon from './assets/rain.png';
import searchIcon from './assets/search.png';
import snowIcon from './assets/snow.png';
import windIcon from './assets/wind.png';

const WeatherDetails = ({ icon, temp, city, country, lat, lon, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude: </span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lon">Longitude: </span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity Icon" className="icon" />
          <div className="data">
            <div>{humidity}%</div>
            <div>Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="Wind Icon" className="icon" />
          <div className="data">
            <div>{wind} km/h</div>
            <div>Wind</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [icon, setIcon] = useState('');
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('Chennai'); // Default city
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState();
  const [wind, setWind] = useState();
  const [text, setText] = useState('');
  const [cityNotFound, setCityNotFound] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    '01d': clearIcon,
    '01n': clearIcon,
    '02d': cloudIcon,
    '02n': cloudIcon,
    '03d': drizzleIcon,
    '03n': drizzleIcon,
    '04d': drizzleIcon,
    '04n': drizzleIcon,
    '09d': rainIcon,
    '09n': rainIcon,
    '10d': rainIcon,
    '10n': rainIcon,
    '13d': snowIcon,
    '13n': snowIcon,
  };

  const search = async (queryCity) => {
    let apiKey = '1348bfa57632645b961f854a16ef9a20';
    let cityName = queryCity || text; // Use the default city or search input
    let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`;

    if (!cityName.trim()) {
      setCityNotFound(true);
      return;
    }

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === '404') {
        console.error('City not found');
        setCityNotFound(true);
        return;
      }

      setCityNotFound(false);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      setCity(data.name);

      const ic = data.weather[0].icon;
      setIcon(weatherIconMap[ic] || clearIcon);
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching data');
    }
  };

  useEffect(() => {
    search('Chennai'); // Fetch default city (Chennai) on load
  }, []);

  return (
    <>
      <div className="container">
        <div className="input">
          <input
            type="text"
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                search();
              }
            }}
          />
          <div className="search" onClick={() => search()}>
            <img src={searchIcon} alt="Search" className="search-icon" />
          </div>
        </div>

        {cityNotFound && <div className="error">City not found. Please try again.</div>}
        {error && <div className="error">{error}</div>}

        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          humidity={humidity}
          wind={wind}
        />
      </div>
    </>
  );
}

export default App;
