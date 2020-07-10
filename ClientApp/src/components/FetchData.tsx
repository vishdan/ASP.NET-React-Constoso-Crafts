import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

import { ApplicationState } from "../store";
import * as WeatherForecastsStore from "../store/WeatherForecasts";

type WeatherForecastProps = WeatherForecastsStore.WeatherForecastsState &
  typeof WeatherForecastsStore.actionCreators &
  RouteComponentProps<{ startDateIndex: string }>;

const FetchData = (props: WeatherForecastProps) => {
  useEffect(() => {
    ensureDataFetched();
  }, [props]);

  const ensureDataFetched = () => {
    const startDateIndex = parseInt(props.match.params.startDateIndex, 10) || 0;
    props.requestWeatherForecasts(startDateIndex);
  };

  const renderForecastsTable = () => {
    return (
      <table className="table table-striped" aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {props.forecasts.map(
            (forecast: WeatherForecastsStore.WeatherForecast) => (
              <tr key={forecast.date}>
                <td>{forecast.date}</td>
                <td>{forecast.temperatureC}</td>
                <td>{forecast.temperatureF}</td>
                <td>{forecast.summary}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    );
  };

  const renderPagination = () => {
    const prevStartDateIndex =
      props.startDateIndex !== 0 ? (props.startDateIndex || 0) - 5 : 0;
    const nextStartDateIndex = (props.startDateIndex || 0) + 5;

    return (
      <div className="d-flex justify-content-between">
        <Link
          className="btn btn-outline-secondary btn-sm"
          to={`/fetch-data/${prevStartDateIndex}`}
        >
          Previous
        </Link>
        {props.isLoading && <span>Loading...</span>}
        <Link
          className="btn btn-outline-secondary btn-sm"
          to={`/fetch-data/${nextStartDateIndex}`}
        >
          Next
        </Link>
      </div>
    );
  };

  return (
    <>
      <h1 id="tabelLabel">Weather forecast</h1>
      <p>
        This component demonstrates fetching data from the server and working
        with URL parameters.
      </p>
      {renderForecastsTable()}
      {renderPagination()}
    </>
  );
};

export default connect(
  (state: ApplicationState) => state.weatherForecasts,
  WeatherForecastsStore.actionCreators
)(FetchData as any);
