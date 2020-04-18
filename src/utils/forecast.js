const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const access_key = "ad85093133574d10ebff376dc6e2e87f";
  const url =
    "http://api.weatherstack.com/current?access_key=" +
    access_key +
    "&query=" +
    latitude +
    "," +
    longitude;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location.", undefined);
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          ". It is currently " +
          body.current.temperature +
          "°C at " +
          body.location.name +
          " but feels like " +
          body.current.feelslike +
          "°C. The wind speed is " +
          body.current.wind_speed +
          "km/h at " +
          body.current.wind_degree +
          " degrees. The humidity is " +
          body.current.humidity +
          "%."
      );
    }
  });
};

module.exports = { forecast: forecast };
